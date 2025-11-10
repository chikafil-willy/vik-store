import React from "react";
import whatsappLogo from "../assets/whatsapp.png";
import instagramLogo from "../assets/instagram.png";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#302e2e",
        textAlign: "center",
        padding: "2rem 0 1rem 0",
        borderTop: "1px solid #444",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      {/* 🪞 Logo */}
      <div>
        <img
          src={logo}
          alt="v6ixcollection Logo"
          style={{
            width: "90px",
            height: "90px",
            objectFit: "contain",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* 🌐 Social Icons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.2rem",
          marginTop: "0.5rem",
        }}
      >
        <a
          href="https://wa.me/08180552305"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={whatsappLogo}
            alt="WhatsApp"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </a>

        <a
          href="https://www.instagram.com/v6ixcollections?igsh=d3vwc28xaTY1eDv"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={instagramLogo}
            alt="Instagram"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </a>
      </div>

      {/* 📧 Contact + Policies + FAQ + About Us */}
      <p
        style={{
          color: "#bebcb9ff",
          fontWeight: "500",
          margin: "0.5rem 0 0",
          fontSize: "0.95rem",
        }}
      >
        📧 vi6ixs@gmail.com &nbsp; | &nbsp;
        <a
          href="/policy"
          style={{
            color: "#978b78ff",
            textDecoration: "none",
            transition: "color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#f5a623")}
        >
          Policies
        </a>
        &nbsp; | &nbsp;
        <a
          href="/faq"
          style={{
            color: "#978b78ff",
            textDecoration: "none",
            transition: "color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#47443eff")}
        >
          FAQ
        </a>
        &nbsp; | &nbsp;
        <a
          href="/about"
          style={{
            color: "#978b78ff",
            textDecoration: "none",
            transition: "color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#111110ff")}
        >
          About Us
        </a>
      </p>

      {/* ⚖️ Copyright */}
      <p
        style={{
          fontSize: "0.9rem",
          color: "#b19e9eff",
          margin: "0.3rem 0",
        }}
      >
        © 2025 v6ixcollection. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
