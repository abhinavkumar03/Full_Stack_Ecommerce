import React from 'react';
import './Footer.css';
import footer_logo from '../Assets/logo_big.png';
import instagram_icon from '../Assets/instagram_icon.png';
import pintrest_icon from '../Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';

const Footer = () => {
  const personalInfo = {
    name: "Abhinav Kumar",
    title: "Software Developer",
    contact: {
      phone: "+91 9971029451",
      email: "ak2711474@gmail.com",
      linkedin: "linkedin.com/in/abhinavkumar03",
      github: "github.com/abhinavkumar03"
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-branding">
            <div className="footer-logo">
              <img src={footer_logo} alt="SHOPPER Logo" />
              <p>SHOPPER</p>
            </div>
            <p className="footer-tagline">Quality products at your fingertips</p>
          </div>

          <div className="footer-nav">
            <div className="footer-nav-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>
            <div className="footer-nav-column">
              <h4>Products</h4>
              <ul>
                <li><a href="#clothing">Clothing</a></li>
                <li><a href="#accessories">Accessories</a></li>
                <li><a href="#collections">Collections</a></li>
              </ul>
            </div>
            <div className="footer-nav-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#faq">FAQs</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-subscribe">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest products and offers</p>
            <div className="footer-subscribe-form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="footer-social-icons">
              <a href="#instagram" className="footer-icons-container">
                <img src={instagram_icon} alt="Instagram" />
              </a>
              <a href="#pinterest" className="footer-icons-container">
                <img src={pintrest_icon} alt="Pinterest" />
              </a>
              <a href="#whatsapp" className="footer-icons-container">
                <img src={whatsapp_icon} alt="WhatsApp" />
              </a>
            </div>
          </div>

          <div className="footer-contact">
            <h4>Contact Info</h4>
            <p><span>Email:</span> {personalInfo.contact.email}</p>
            <p><span>Phone:</span> {personalInfo.contact.phone}</p>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copyright">© {currentYear} {personalInfo.name}. All Rights Reserved.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;