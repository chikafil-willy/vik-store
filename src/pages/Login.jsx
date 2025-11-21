// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import GoogleLogin from "../components/GoogleLogin";
import logo from "../assets/logo.png";
import backgroundImg from "../assets/signup-bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // redirect after successful login
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: window.innerWidth > 768 ? "1rem" : "0.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: window.innerWidth > 768 ? "450px" : "99%",   // Desktop vs Mobile
          height: window.innerWidth > 768 ? "500px" : "499px",     // Desktop vs Mobile
          width: "100%",
          width: window.innerWidth > 768 ? "100%" : "100%",     // Mobile uses full width
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
          <img src={logo} alt="Logo" style={{ width: "34px", marginRight: "0.5rem" }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <h2>👋 Welcome to V6ixCollection</h2>
        </div>

        <GoogleLogin />

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1.4rem", marginTop: "1rem" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem" }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem" }}
            required
          />

          <button
            type="submit"
            style={{
              padding: "0.6rem",
              border: "none",
              borderRadius: "6px",
              background: "#007bff",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Login
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <button
          onClick={handleForgotPassword}
          style={{ marginTop: "1.0rem", background: "none", border: "none", fontSize: "15px", color: "#007bff", cursor: "pointer" }}
        >
          Forgot Password?
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          New to V6ix Collection? <Link to="/signup" style={{ color: "#007bff" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
