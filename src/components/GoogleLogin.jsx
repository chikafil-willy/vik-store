import React from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import GoogleLogo from "../assets/google.png";

const GoogleLogin = () => {
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create or update Firestore profile
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "",
          phone: "",
          address: "",
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });
      } else {
        await setDoc(
          userRef,
          {
            name: user.displayName || "",
            email: user.email,
            photoURL: user.photoURL || "",
          },
          { merge: true }
        );
      }

      console.log("Google login & profile saved");
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
