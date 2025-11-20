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
} from "react-icons/md";
import { sendPasswordResetEmail, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import logo from "../assets/logo.png";
import CategoryDropdown from "./CategoryDropdown"; // ✅ restored
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { auth } from "../firebase";
import GoogleLogin from "../components/GoogleLogin";

const Navbar = () => {
  const { cart } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [user, setUser] = useState(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const loginRef = useRef(null);
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
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setShowLoginDropdown(false);
      }
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setShowLoginDropdown(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch {
      setLoginError("Wrong email or password");
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      setLoginError("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, loginEmail);
      alert("Password reset email sent! Check your inbox.");
      setLoginError("");
    } catch (err) {
      setLoginError(err.message);
    }
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
                {showHamburgerMenu ? <MdClear size={26} /> : <MdMenu size={26} />}
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
                    <div style={{position: "absolute", top: "35px", right: 0, background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.15)", borderRadius: "8px", padding: "1rem", minWidth: "180px", zIndex: 1000, fontFamily: "sans-serif", fontSize: "14px"}}>
                      <Link to="/profile" style={{display: "block", marginBottom: "1.2rem", color: "#007bff", textDecoration: "none"}}>Account</Link>
                      <Link to="/order-tracker" style={{display: "block", marginBottom: "1.2rem", color: "#007bff", textDecoration: "none"}}>Order Tracker</Link>
                     <span 
                      onClick={handleSignOut} 
                        style={{ display: "block", marginBottom: "0", color: "#007bff", textDecoration: "none", cursor: "pointer" }}> 
                        Sign Out
                    </span>
                    </div>
                  )}
                </div>
              ) : (
                <div ref={loginRef} style={{ position: "relative" }}>
                  <button onClick={() => setShowLoginDropdown(!showLoginDropdown)} style={{ background: "none", border: "none", cursor: "pointer" }} title="Login/Sign Up">
                    <MdPersonAdd size={22} />
                  </button>
                  {showLoginDropdown && (
                    <div style={{ position: "fixed", top: "60px", left: "50%", transform: "translateX(-50%)", background: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", borderRadius: "10px", padding: "1rem", width: "90%", maxWidth: "360px", zIndex: 2000 }}>
                      <div>
                        <img
                        src={logo}
                        alt="v6ixcollection Logo"
                          style={{width: "90px", height: "40px", objectFit: "contain", borderRadius: "10px", justifyContent: "center",
                                }}/>
                        </div>
                      <div style={{ marginBottom: "1rem" }}>
                          <GoogleLogin />
                      </div>
                      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" }} required />
                        <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" }} required />
                        <button style={{ padding: "0.5rem", border: "none", borderRadius: "6px", background: "#007bff", fontSize: "0.9rem", color: "#fff", cursor: "pointer" }}>Login</button>
                      </form>
                      {loginError && <p style={{ color: "red", marginTop: "0.5rem" }}>{loginError}</p>}
                      <button onClick={handleForgotPassword} style={{ display: "block",  fontFamily: "Arial, sans-serif", background: "none", border: "none", color: "#007bff", textAlign: "center", marginTop: "0.5rem", cursor: "pointer", width: "100%", fontSize: "0.9rem" }}>Forgot Password?</button>
                        <p style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "1rem", fontSize: "0.9rem" }}>
                          New to V6ix Collection?{" "}
                            <Link to="/signup"
                              style={{ color: "#007bff", textDecoration: "none", marginLeft: "0.2rem" }}> Sign Up</Link></p>
                              </div>)}
                             </div>
                             )}
                          </div>
                      </div>

          {/* Search Bar */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "100%" }}>
            <div style={{
              display: "flex",
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "25px",
              overflow: "hidden",
              backgroundColor: "#fff",
                }}>
         <input
            type="text"
            placeholder="Search products..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           style={{
           flex: 1,
           padding: "0.5rem 1rem",
           border: "none",
           outline: "none",
           fontSize: "0.95rem",
              }}
          />
         <button
          onClick={() => {}}
            style={{
            backgroundColor: "#007bff",
            border: "none",
            color: "#fff",
            padding: "0 1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
             }}
          title="Search"
    >
         <MdSearch size={20} />
          </button>
      </div>
          {searchTerm && (
         <button
           onClick={() => setSearchTerm("")}
           style={{
           background: "none",
           border: "none",
           marginLeft: "8px",
           cursor: "pointer",
           color: "#000",
            }}
         title="Clear"
          >
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
            <CategoryDropdown /> {/* ✅ Desktop category dropdown */}
            <Link to="/about" className="nav-link">About Us</Link>

            {user ? (
              <div ref={accountRef} style={{ position: "relative" }}>
                <button onClick={() => setShowAccountDropdown(!showAccountDropdown)} style={{ background: "none", border: "none", cursor: "pointer" }} title="Account">
                  <MdAccountCircle size={24} />
                </button>
                {showAccountDropdown && (
                   <div style={{position: "absolute", top: "35px", right: 0, background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.15)", borderRadius: "8px", padding: "1rem", minWidth: "180px", zIndex: 1000, fontFamily: "sans-serif", fontSize: "14px"}}>
                      <Link to="/profile" style={{display: "block", marginBottom: "1.2rem", color: "#007bff", textDecoration: "none"}}>Account</Link>
                      <Link to="/order-tracker" style={{display: "block", marginBottom: "1.2rem", color: "#007bff", textDecoration: "none"}}>Order Tracker</Link>
                       <span 
                         onClick={handleSignOut} 
                          style={{ display: "block", marginBottom: "0", color: "#007bff", textDecoration: "none", cursor: "pointer" }}> 
                            Sign Out
                        </span>
                    </div>
                )}
              </div>
            ) : (
              <div ref={loginRef} style={{ position: "relative" }}>
                <button onClick={() => setShowLoginDropdown(!showLoginDropdown)} style={{ background: "none", border: "none", cursor: "pointer" }} title="Login/Sign Up">
                  <MdPersonAdd size={24} />
                </button>

                {showLoginDropdown && (
                  <div style={{ position: "absolute", top: "40px", right: 0, background: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", borderRadius: "8px", padding: "1.8rem", minWidth: "350px", zIndex: 1000 }}>
                    <div>
                        <img
                        src={logo}
                        alt="v6ixcollection Logo"
                          style={{width: "90px", height: "40px", objectFit: "contain", borderRadius: "10px", justifyContent: "center",
                                }}/>
                        </div>
                    <div style={{ marginBottom: "1rem" }}>
                          <GoogleLogin />
                      </div>
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" }} required />
                      <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" }} required />
                      <button type="submit" style={{ padding: "0.5rem", border: "none", fontSize: "0.9rem", borderRadius: "6px", background: "#007bff", color: "#fff", cursor: "pointer" }}>Login</button>
                    </form>
                    {loginError && <p style={{ color: "red", marginTop: "0.5rem" }}>{loginError}</p>}
                    <button onClick={handleForgotPassword} style={{ display: "block",  fontFamily: "Arial, sans-serif", width: "100%", background: "none", border: "none", color: "#007bff", textAlign: "center", marginTop: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>Forgot Password?</button>
                     <p style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "1rem", fontSize: "0.9rem" }}>
                      New to V6ix Collection?{" "}
                      <Link to="/signup"
                      style={{ color: "#007bff", textDecoration: "none", marginLeft: "0.2rem" }}> Sign Up</Link></p>
                  </div>
                )}
              </div>
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
