// Navbar.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdShoppingCart,
  MdClear,
  MdPersonAdd,
  MdAccountCircle,
  MdMenu,
  MdClear as MdClearMenu,
} from "react-icons/md";
import { signOut, onAuthStateChanged } from "firebase/auth";
import logo from "../assets/logo.png";
import CategoryDropdown from "./CategoryDropdown";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { auth } from "../firebase";

const Navbar = () => {
  const { cart } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [user, setUser] = useState(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const accountRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
      if (showHamburgerMenu && !event.target.closest(".hamburger-menu") && !event.target.closest(".hamburger-button")) {
        setShowHamburgerMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHamburgerMenu]);

  const handleSignOut = async () => {
    await signOut(auth);
    setShowAccountDropdown(false);
  };

  return (
    <nav className="navbar">
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "0 10px" }}>
          {/* Mobile Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className="hamburger-button"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#000" }}
                title="Menu"
              >
                {showHamburgerMenu ? <MdClearMenu size={26} /> : <MdMenu size={26} />}
              </button>
              <Link to="/"><img src={logo} alt="Logo" style={{ height: "35px" }} /></Link>
            </div>

            {/* Right icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/cart" className="cart-link" title="Cart">
                <MdShoppingCart size={22} />
                {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
              </Link>

              {user ? (
                <div ref={accountRef} style={{ position: "relative" }}>
                  <button onClick={() => setShowAccountDropdown(!showAccountDropdown)} style={{ background: "none", border: "none", cursor: "pointer" }} title="Account">
                    <MdAccountCircle size={22} />
                  </button>
                  {showAccountDropdown && (
                    <div style={{position: "absolute", top: "35px", right: 0, background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.15)", borderRadius: "8px", padding: "1rem", minWidth: "180px", zIndex: 1000}}>
                      <Link to="/profile" style={{display: "block", marginBottom: "1.2rem", color: "#007bff", textDecoration: "none"}}>Account</Link>
                      <Link to="/order-tracker" style={{display: "block", marginBottom: "1.2rem", color: "#007bff", textDecoration: "none"}}>Order Tracker</Link>
                      <span onClick={handleSignOut} style={{ display: "block", color: "#007bff", textDecoration: "none", cursor: "pointer" }}>Sign Out</span>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", color: "#000" }}
                  title="Login"
                >
                  <MdPersonAdd size={22} />
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "100%" }}>
            <div style={{ display: "flex", flex: 1, border: "1px solid #ccc", borderRadius: "25px", overflow: "hidden", backgroundColor: "#fff" }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1, padding: "0.5rem 1rem", border: "none", outline: "none", fontSize: "0.95rem" }}
              />
              <button style={{ backgroundColor: "#007bff", border: "none", color: "#fff", padding: "0 1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Search">
                <MdSearch size={20} />
              </button>
            </div>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", marginLeft: "8px", cursor: "pointer", color: "#000" }} title="Clear">
                <MdClear size={20} />
              </button>
            )}
          </div>

          {/* Hamburger Menu (Direct links) */}
          {showHamburgerMenu && (
            <div className="hamburger-menu" style={{ position: "absolute", fontFamily: "sans-serif", top: "140px", left: 0, width: "100%", background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.15)", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem 0", gap: "1rem" }}>
              <Link to="/" className="nav-link" onClick={() => setShowHamburgerMenu(false)}>Home</Link>
              <Link to="/category/shirts-and-polos" className="nav-link" onClick={() => setShowHamburgerMenu(false)}>Shirts & Polos</Link>
              <Link to="/category/trousers" className="nav-link" onClick={() => setShowHamburgerMenu(false)}>Trousers</Link>
              <Link to="/category/caps" className="nav-link" onClick={() => setShowHamburgerMenu(false)}>Caps</Link>
              <Link to="/category/jewelries" className="nav-link" onClick={() => setShowHamburgerMenu(false)}>Jewelries</Link>
              <Link to="/category/shoes" className="nav-link" onClick={() => setShowHamburgerMenu(false)}>Shoes</Link>
              <Link to="/about" className="nav-link" onClick={() => setShowHamburgerMenu(false)}>About Us</Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* DESKTOP NAV */}
          <div className="navbar-left">
            <Link to="/"><img src={logo} alt="Logo" className="logo" /></Link>
          </div>

          <div className="navbar-right">
            <Link to="/" className="nav-link">Home</Link>
            <CategoryDropdown />
            <Link to="/about" className="nav-link">About Us</Link>

            {user ? (
              <div ref={accountRef} style={{ position: "relative" }}>
                <button onClick={() => setShowAccountDropdown(!showAccountDropdown)} style={{ background: "none", border: "none", cursor: "pointer" }} title="Account">
                  <MdAccountCircle size={24} />
                </button>
                {showAccountDropdown && (
                  <div style={{position: "absolute", top: "35px", right: 0, background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.15)", borderRadius: "8px", padding: "1rem", minWidth: "180px", zIndex: 1000}}>
                    <Link to="/profile" style={{display: "block", marginBottom: "1.2rem", color: "#007bff", textDecoration: "none"}}>Account</Link>
                    <Link to="/order-tracker" style={{display: "block", marginBottom: "1.2rem", color: "#007bff", textDecoration: "none"}}>Order Tracker</Link>
                    <span onClick={handleSignOut} style={{ display: "block", color: "#007bff", textDecoration: "none", cursor: "pointer" }}>Sign Out</span>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", color: "#000" }} title="Login">
                <MdPersonAdd size={24} />
              </Link>
            )}

            <div className="search-container">
              <input type="text" className="search-input" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className="search-btn" type="button"><MdSearch size={20} /></button>
              {searchTerm && <button className="clear-btn" type="button" onClick={() => setSearchTerm("")}><MdClear size={20} /></button>}
            </div>

            <Link to="/cart" className="cart-link" title="Cart">
              <MdShoppingCart size={22} />
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
