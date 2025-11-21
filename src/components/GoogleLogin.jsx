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
      <button
        onClick={handleGoogleLogin}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#000",
          color: "#fff",
          padding: "0.7rem 1.2rem",
          border: "none",
          borderRadius: "19px",
          cursor: "pointer",
          fontSize: "0.95rem",
          fontWeight: "600",
        }}
      >
        <img
          src={GoogleLogo}
          alt="Google logo"
          style={{ width: "20px", height: "20px" }}
        />
        <span>Login with Google</span>
      </button>
    </div>
  );
};

export default GoogleLogin;
