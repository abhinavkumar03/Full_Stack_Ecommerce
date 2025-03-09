import React, { useState, useEffect } from 'react';
import { backend_url, currency } from '../../App';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [addressForm, setAddressForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${backend_url}/profile`, {
        headers: {
          'auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      console.log('Profile data:', data); // For debugging
      setUser(data);
      setFormData({ name: data.name, email: data.email });
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError(error.message || 'Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      const response = await fetch(`${backend_url}/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUser(data.user);
      setEditMode(false);
    } catch (error) {
      setError('Error updating profile');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${backend_url}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify(
          editingAddressId 
            ? { ...addressForm, addressId: editingAddressId }
            : addressForm
        ),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const data = await response.json();
      setUser({ ...user, addresses: data.addresses });
      setShowAddressForm(false);
      setEditingAddressId(null);
      resetAddressForm();
    } catch (error) {
      setError('Error saving address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${backend_url}/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      const data = await response.json();
      setUser({ ...user, addresses: data.addresses });
    } catch (error) {
      setError('Error deleting address');
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      name: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      isDefault: false,
    });
  };

  if (loading) return (
    <div className="profile-container">
      <div className="loading">Loading your profile...</div>
    </div>
  );

  if (error) return (
    <div className="profile-container">
      <div className="error">{error}</div>
    </div>
  );

  if (!user) return (
    <div className="profile-container">
      <div className="error">Unable to load profile. Please try logging in again.</div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-tabs">
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'addresses' ? 'active' : ''}
          onClick={() => setActiveTab('addresses')}
        >
          Addresses
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-info">
            <h2>Profile Information</h2>
            {editMode ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="button-group">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={() => {
                    setEditMode(false);
                    setFormData({ name: user.name, email: user.email });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="addresses-section">
            <h2>Addresses</h2>
            <button
              className="add-btn"
              onClick={() => {
                resetAddressForm();
                setShowAddressForm(true);
                setEditingAddressId(null);
              }}
            >
              Add New Address
            </button>

            {showAddressForm && (
              <div className="address-form">
                <h3>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                <form onSubmit={handleAddressSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>PIN Code</label>
                      <input
                        type="text"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    />
                    <label htmlFor="isDefault">Set as default address</label>
                  </div>
                  <div className="button-group">
                    <button type="submit" className="save-btn">
                      {editingAddressId ? 'Update' : 'Save'} Address
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddressId(null);
                        resetAddressForm();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="addresses-list">
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((address) => (
                  <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                    {address.isDefault && <span className="default-badge">Default</span>}
                    <h3>{address.name}</h3>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>Phone: {address.phone}</p>
                    <div className="address-actions">
                      <button className="edit-btn" onClick={() => handleEditAddress(address)}>
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteAddress(address._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No addresses added yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order History</h2>
            <div className="orders-list">
              {user.orders && user.orders.length > 0 ? (
                user.orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).map((order) => (
                  <div key={order.orderId} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Order #{order.orderId}</h3>
                        <p className="order-date">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="order-status">
                        <span className={`status ${order.orderStatus.toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                        <span className={`payment ${order.paymentStatus.toLowerCase()}`}>
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img src={backend_url + item.image} alt={item.name} />
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: {currency}{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <div className="shipping-address">
                        <h4>Shipping Address</h4>
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                      </div>
                      <div className="order-summary">
                        <p><strong>Total Amount:</strong> {currency}{order.totalAmount}</p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No orders found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 