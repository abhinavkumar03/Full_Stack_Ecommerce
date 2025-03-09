import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../Assets/nav-dropdown.svg'
import { jwtDecode } from 'jwt-decode';
import { backend_url } from '../../App';

const Navbar = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("shop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalCartItems } = useContext(ShopContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.user.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      }
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProducts();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${backend_url}/searchproducts?query=${encodeURIComponent(searchQuery)}`, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      if (error.name === 'AbortError') {
        setError('Connection timed out. Please check your internet connection.');
      } else if (!window.navigator.onLine) {
        setError('You are offline. Please check your internet connection.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please try again later.');
      } else {
        setError('An error occurred while searching. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.search-container')) {
      setShowDropdown(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [searchQuery]);

  return (
    <div className='nav'>
      <div className="nav-left">
        <Link to='/' onClick={() => { setMenu("shop") }} style={{ textDecoration: 'none' }} className={`nav-logo`}>
          <img src={logo} alt="logo" />
          <p>SHOPPER</p>
        </Link>
      </div>

      <div className={`nav-right`}>
        <img
          onClick={toggleMenu}
          className={`nav-dropdown ${isMenuOpen ? 'open' : ''}`}
          src={nav_dropdown}
          alt=""
        />

        <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-visible' : ''}`}>
          <div className={`search-container`}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {(showDropdown || error) && (
              <div className="search-dropdown">
                {loading ? (
                  <div className="search-loading">Searching...</div>
                ) : error ? (
                  <div className="search-error">{error}</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(product => (
                    <div
                      key={product.id}
                      className="search-product-card"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img src={backend_url + product.image} alt={product.name} />
                      <div className="search-product-info">
                        <h4>{product.name}</h4>
                        <p className="search-product-price">₹{product.new_price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">No products found</div>
                )}
              </div>
            )}
          </div>
          <li onClick={() => { setMenu("shop"); setIsMenuOpen(false) }}>
            <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>Shop</Link>
            {menu === "shop" ? <hr /> : <></>}
          </li>
          <li onClick={() => { setMenu("mens"); setIsMenuOpen(false) }}>
            <Link to='/mens' style={{ textDecoration: 'none', color: 'inherit' }}>Men</Link>
            {menu === "mens" ? <hr /> : <></>}
          </li>
          <li onClick={() => { setMenu("womens"); setIsMenuOpen(false) }}>
            <Link to='/womens' style={{ textDecoration: 'none', color: 'inherit' }}>Women</Link>
            {menu === "womens" ? <hr /> : <></>}
          </li>
          <li onClick={() => { setMenu("kids"); setIsMenuOpen(false) }}>
            <Link to='/kids' style={{ textDecoration: 'none', color: 'inherit' }}>Kids</Link>
            {menu === "kids" ? <hr /> : <></>}
          </li>
          {isAdmin && (
            <li onClick={() => { setMenu("admin"); setIsMenuOpen(false) }}>
              <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/admin/dashboard'>Admin</Link>
              {menu === "admin" ? <hr /> : <></>}
            </li>
          )}
        </ul>

        <div className="nav-login-cart">
          {localStorage.getItem('auth-token')
            ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace("/"); }}>Logout</button>
            : <Link to='/login' style={{ textDecoration: 'none' }}><button>Login</button></Link>}
          <Link to="/cart"><img src={cart_icon} alt="cart" /></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
