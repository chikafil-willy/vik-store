import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import GoogleLogin from "../components/GoogleLogin";
import logo from "../assets/logo.png";
import backgroundImg from "../assets/signup-bg.jpg"; // your background image

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        createdAt: new Date(),
      });

      setSuccess("Account created successfully!");
      setFormData({
        name: "",
        phone: "",
        address: "",
        email: "",
        password: "",
      });

      navigate("/"); // redirect after signup
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        {/* Logo aligned left */}
        <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
          <img
            src={logo}
            alt="v6ixcollection Logo"
            style={{
              width: "90px",
              height: "40px",
              objectFit: "contain",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* Heading */}
        <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
          Create Your Account
        </h2>

        {/* Signup Form */}
        <form
          onSubmit={handleSignup}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#007bff",
              color: "#fff",
              padding: "0.75rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#0056b3")}
            onMouseOut={(e) => (e.target.style.background = "#007bff")}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <GoogleLogin />

        {/* Error / Success */}
        {error && (
          <p
            style={{
              color: "#ff4d4d",
              marginTop: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}
        {success && (
          <p
            style={{
              color: "#28a745",
              marginTop: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {success}
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
