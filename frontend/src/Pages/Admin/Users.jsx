import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { backend_url } from '../../App';
import './Admin.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backend_url}/allusers`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        const response = await fetch(`${backend_url}/removeuser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data.success) {
          fetchUsers();
        } else {
          setError(data.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const endpoint = editingUser ? '/edituser' : '/adduser';
      const response = await fetch(`${backend_url}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser ? { ...formData, id: editingUser.id } : formData),
      });
      const data = await response.json();
      if (data.success) {
        setShowForm(false);
        fetchUsers();
        resetForm();
      } else {
        setError(data.message || 'Failed to save user. Please try again.');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowForm(true);
  };

  const handleResetPassword = async (user) => {
    const newPassword = window.prompt('Enter new password for ' + user.name);
    if (newPassword) {
      try {
        setLoading(true);
        const response = await fetch(`${backend_url}/edituser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            password: newPassword,
            role: user.role,
          }),
        });
        const data = await response.json();
        if (data.success) {
          alert('Password updated successfully');
          fetchUsers();
        } else {
          setError(data.message || 'Failed to reset password');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        setError('Failed to reset password. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
    });
    setEditingUser(null);
    setError('');
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  return (
    <div className="admin-users">
      <div className="header">
        <div className="header-button">
          <h1>Manage Users</h1>
          <Link to="/admin/dashboard" className="admin-link edit-btn">
            Back to Dashboard
          </Link>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => setShowForm(true)} className="admin-link add-user-btn">
            Add New User
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="close-btn" onClick={() => { setShowForm(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{editingUser ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Processing...' : (editingUser ? 'Update User' : 'Add User')}
              </button>
            </form>
          </div>
        </div>
      )}

      {showUserDetails && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={() => setShowUserDetails(false)}>×</button>
            </div>
            <div className="user-details">
              <h3>Profile Information</h3>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Member Since:</strong> {new Date(selectedUser.date).toLocaleDateString()}</p>

              <h3>Addresses</h3>
              {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                <div className="addresses-grid">
                  {selectedUser.addresses.map((address, index) => (
                    <div key={index} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                      {address.isDefault && <span className="default-badge">Default</span>}
                      <p><strong>{address.name}</strong></p>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <p>Phone: {address.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No addresses added</p>
              )}

              <h3>Order History</h3>
              {selectedUser.orders && selectedUser.orders.length > 0 ? (
                <div className="orders-list">
                  {selectedUser.orders.map((order, index) => (
                    <div key={index} className="order-card">
                      <div className="order-header">
                        <div>
                          <h4>Order #{order.orderId}</h4>
                          <p className="order-date">{new Date(order.orderDate).toLocaleDateString()}</p>
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
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="order-item">
                            <img src={backend_url + item.image} alt={item.name} />
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p>Quantity: {item.quantity}</p>
                              <p>Price: ₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <div className="shipping-address">
                          <h4>Shipping Address</h4>
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                          <p>Phone: {order.shippingAddress.phone}</p>
                        </div>
                        <div className="order-summary">
                          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No orders found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}

      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p className="user-role">Role: {user.role}</p>
              <p>Orders: {user.orders?.length || 0}</p>
              <p>Addresses: {user.addresses?.length || 0}</p>
            </div>
            <div className="user-actions">
              <button
                className="edit-btn"
                onClick={() => handleEdit(user)}
                disabled={loading}
              >
                Edit
              </button>
              <button
                className="reset-btn"
                onClick={() => handleResetPassword(user)}
                disabled={loading}
              >
                Reset Password
              </button>
              <button
                className="view-btn"
                onClick={() => handleViewDetails(user)}
                disabled={loading}
              >
                View Details
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(user.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;