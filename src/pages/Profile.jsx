import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { MdPerson } from "react-icons/md";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setError("User profile not found.");
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError("Failed to fetch profile. Check your connection.");
        }
      } else {
        setError("No user logged in.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p style={{ color: "#555" }}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "2rem",
        background: "linear-gradient(to bottom right, #e0f7fa, #fff3e0)",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Head icon */}
      <div style={{ marginBottom: "1rem" }}>
        <MdPerson size={60} color="#007bff" />
      </div>

      <h2 style={{ marginBottom: "2rem", color: "#333" }}>My Profile</h2>

      <div style={{ textAlign: "left", lineHeight: "1.8", color: "#444" }}>
        <p>
          <strong style={{ color: "#007bff" }}>Name:</strong> {userData.name}
        </p>
        <p>
          <strong style={{ color: "#007bff" }}>Email:</strong> {userData.email}
        </p>
        <p>
          <strong style={{ color: "#007bff" }}>Phone:</strong> {userData.phone}
        </p>
        <p>
          <strong style={{ color: "#007bff" }}>Address:</strong> {userData.address}
        </p>
        <p>
          <strong style={{ color: "#007bff" }}>Joined:</strong>{" "}
          {userData.createdAt?.toDate
            ? userData.createdAt.toDate().toLocaleDateString()
            : new Date(userData.createdAt).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={() => auth.signOut()}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 2rem",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.background = "#0056b3")}
        onMouseOut={(e) => (e.target.style.background = "#007bff")}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
