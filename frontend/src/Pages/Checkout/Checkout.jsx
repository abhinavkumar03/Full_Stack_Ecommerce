import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { backend_url, currency } from '../../App';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalCartAmount, clearCart } = useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAddresses();
    fetchProducts();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${backend_url}/profile`, {
        headers: {
          'auth-token': token,
        },
      });
      const data = await response.json();
      setAddresses(data.addresses || []);
      // Set default address if available
      const defaultAddress = data.addresses?.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${backend_url}/allproducts`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getCartProducts = () => {
    return products.filter(product => cartItems[product.id] > 0).map(product => ({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.new_price,
      quantity: cartItems[product.id]
    }));
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare order items
      const items = getCartProducts();
      const totalAmount = getTotalCartAmount();

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create order
      const response = await fetch(`${backend_url}/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({
          addressId: selectedAddress,
          paymentMethod,
          items,
          totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();

      if (data.success) {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const token = localStorage.getItem('auth-token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Update order status based on payment method
        const statusResponse = await fetch(`${backend_url}/order/update-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
          body: JSON.stringify({
            orderId: data.order.orderId,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
            orderStatus: 'processing'
          }),
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to update order status');
        }

        const statusData = await statusResponse.json();
        setOrderDetails(statusData.order);
        setOrderSuccess(true);
        clearCart(); // Clear the cart after successful order
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess && orderDetails) {
    return (
      <div className="checkout-container">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Order ID: {orderDetails.orderId}</p>
          <div className="order-summary">
            <h3>Order Summary</h3>
            <p>Total Amount: {currency}{orderDetails.totalAmount}</p>
            <p>Payment Method: {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p>Payment Status: {orderDetails.paymentStatus}</p>
          </div>
          <div className="success-actions">
            <button onClick={() => navigate('/profile')} className="view-order-btn">
              View Order
            </button>
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-content">
        <div className="delivery-section">
          <h2>Select Delivery Address</h2>
          {addresses.length > 0 ? (
            <div className="addresses-list">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`address-card ${selectedAddress === address._id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddress(address._id)}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === address._id}
                    onChange={() => setSelectedAddress(address._id)}
                  />
                  <div className="address-details">
                    <h3>{address.name}</h3>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>Phone: {address.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-address">
              <p>No delivery addresses found.</p>
              <button onClick={() => navigate('/profile')} className="add-address-btn">
                Add New Address
              </button>
            </div>
          )}
        </div>

        <div className="payment-section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <div className="payment-option">
              <input
                type="radio"
                id="cod"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="cod">Cash on Delivery</label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="online"
                name="payment"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="online">Pay Online (Coming Soon)</label>
            </div>
          </div>
        </div>

        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="cart-items">
            {getCartProducts().map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={backend_url + item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {currency}{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="total-amount">
            <h3>Total Amount: {currency}{getTotalCartAmount()}</h3>
          </div>
        </div>

        <button
          className="place-order-btn"
          onClick={handlePayment}
          disabled={loading || !selectedAddress}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout; 