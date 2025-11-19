import React from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleLogo from "../assets/google.png";

const GoogleLogin = () => {
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Logged in successfully");
    } catch (error) {
      console.log("Google Login Error:", error.message);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <a
        href="#"
        onClick={handleGoogleLogin}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          color: "#000",
          fontSize: "0.9rem",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        <img
          src={GoogleLogo}
          alt="Google logo"
          style={{ width: "20px", height: "20px" }}
        />
        <span>Login with Google</span>
      </a>
    </div>
  );
};

export default GoogleLogin;
