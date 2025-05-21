import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">CIRO</h3>
            <p className="company-description">
              Your trusted partner in electronic device repair and maintenance. We provide professional services with guaranteed quality and customer satisfaction.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
             
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/repair">Repair Services</Link></li>
              <li><Link to="/firmware">Firmware</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/aboutus">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-title">Our Services</h3>
            <ul className="footer-links">
              <li>Device Repair</li>
              <li>Firmware Updates</li>
              <li>Diagnostics</li>
              <li>Maintenance</li>
              <li>Spare Parts</li>
              <li>Technical Support</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="contact-info">
              <li>
                <Phone size={18} />
                <span>0714487329</span>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:hemal.rx8@gmail.com">hemal.rx8@gmail.com</a>
              </li>
              <li>
                <MapPin size={18} />
                <span>No 452/6 Thisara building, Avissawella Rd, Kaduwela</span>
              </li>
              <li>
                <Clock size={18} />
                <span>Open Monday - Sunday</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} CIRO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;