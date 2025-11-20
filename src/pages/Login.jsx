import React, { useState } from "react";
import { Link } from "react-router-dom";
import GoogleLogin from "../components/GoogleLogin";
import logo from "../assets/logo.png";

const Login = ({ handleLogin, loginError, handleForgotPassword }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img
            src={logo}
            alt="V6ix Collection Logo"
            style={{ width: "100px", objectFit: "contain" }}
          />
        </div>

        {/* GOOGLE LOGIN */}
        <div style={{ marginBottom: "1rem" }}>
          <GoogleLogin />
        </div>

        {/* NORMAL LOGIN */}
        <form
          onSubmit={(e) => handleLogin(e, loginEmail, loginPassword)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            style={{
              padding: "0.8rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            style={{
              padding: "0.8rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />

          <button
            style={{
              padding: "0.8rem",
              border: "none",
              borderRadius: "6px",
              background: "#007bff",
              fontSize: "1rem",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        {loginError && (
          <p style={{ color: "red", marginTop: "0.5rem", textAlign: "center" }}>
            {loginError}
          </p>
        )}

        {/* FORGOT PASSWORD */}
        <button
          onClick={handleForgotPassword}
          style={{
            display: "block",
            width: "100%",
            background: "none",
            border: "none",
            color: "#007bff",
            marginTop: "0.8rem",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Forgot Password?
        </button>

        {/* SIGNUP LINK */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.2rem",
            fontSize: "0.9rem",
          }}
        >
          New to V6ix Collection?
          <Link
            to="/signup"
            style={{
              color: "#007bff",
              marginLeft: "0.3rem",
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
