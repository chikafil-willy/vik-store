import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* 🪞 Logo Section */}
        <div className="footer-logo">
          <img src="/logo.png" alt="V6ix Collection Logo" className="logo" />
        </div>

        {/* 📞 Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="footer-contacts">
            <li>
              <a
                href="https://wa.me/2348180552305"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                <img
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  className="whatsapp-img"
                />
                0818 055 2305
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/2348098765432"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                <img
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  className="whatsapp-img"
                />
                0809 876 5432
              </a>
            </li>
          </ul>
        </div>

        {/* 🛍️ Categories Section */}
        <div className="footer-section">
          <h3>Categories</h3>
          <ul className="footer-links">
            <li><Link to="/category/shirts & polos">Shirts & Polos</Link></li>
            <li><Link to="/category/trousers">Trousers</Link></li>
            <li><Link to="/category/caps">Caps</Link></li>
            <li><Link to="/category/jewelries">Jewelries</Link></li>
            <li><Link to="/category/shoes">Shoes</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} V6ix Collection. All rights reserved.</p>
      </div>

      {/* 💅 Inline CSS */}
      <style jsx="true">{`
        .footer {
          background: #111;
          color: #eee;
          padding: 2rem 1rem;
          text-align: center;
        }

        .footer-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .footer-logo {
          text-align: center;
          flex: 1;
          min-width: 150px;
        }

        .footer-logo .logo {
          width: 100px;
          margin-bottom: 0.5rem;
        }

        .footer-section {
          flex: 1;
          min-width: 150px;
        }

        .footer-section h3 {
          margin-bottom: 0.5rem;
          color: #ff4081;
        }

        .footer-links,
        .footer-contacts {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li,
        .footer-contacts li {
          margin: 5px 0;
        }

        .footer-links a,
        .whatsapp-link {
          color: #eee;
          text-decoration: none;
          transition: color 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .whatsapp-link:hover {
          color: #ff4081;
        }

        .whatsapp-img {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          border-radius: 10px;
        }

        .footer-bottom {
          border-top: 1px solid #444;
          padding-top: 0.8rem;
          font-size: 0.9rem;
          color: #bbb;
        }

        /* 📱 Keep row layout on mobile too */
        @media (max-width: 768px) {
          .footer-container {
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
            text-align: center;
            gap: 1rem;
          }

          .footer-section,
          .footer-logo {
            flex: 1;
            min-width: 100px;
          }

          .footer-links a,
          .whatsapp-link {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
