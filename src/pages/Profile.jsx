import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { MdPerson } from "react-icons/md";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setFormData({
              name: data.name || "",
              phone: data.phone || "",
              address: data.address || "",
            });
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

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      setUserData({ ...userData, ...formData });
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Try again later.");
    }
    setSaving(false);
  };

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
        background: "linear-gradient(to bottom right, #f0f7ff, #fff9f3)",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Icon */}
      <div style={{ marginBottom: "1rem" }}>
        <MdPerson size={60} color="#4a90e2" />
      </div>

      <h2 style={{ marginBottom: "2rem", color: "#333" }}>My Profile</h2>

      <div style={{ textAlign: "left", lineHeight: "1.8", color: "#444" }}>
        {editing ? (
          <>
            <label style={{ display: "block", marginBottom: "10px" }}>
              <strong style={{ color: "#4a90e2" }}>Name:</strong>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "10px" }}>
              <strong style={{ color: "#4a90e2" }}>Phone:</strong>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "10px" }}>
              <strong style={{ color: "#4a90e2" }}>Address:</strong>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </label>
          </>
        ) : (
          <>
            <p>
              <strong style={{ color: "#4a90e2" }}>Name:</strong> {userData.name}
            </p>
            <p>
              <strong style={{ color: "#4a90e2" }}>Email:</strong> {userData.email}
            </p>
            <p>
              <strong style={{ color: "#4a90e2" }}>Phone:</strong> {userData.phone}
            </p>
            <p>
              <strong style={{ color: "#4a90e2" }}>Address:</strong> {userData.address}
            </p>
            <p>
              <strong style={{ color: "#4a90e2" }}>Joined:</strong>{" "}
              {userData.createdAt?.toDate
                ? userData.createdAt.toDate().toLocaleDateString()
                : new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </>
        )}
      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "10px", justifyContent: "center" }}>
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#4a90e2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#357abd")}
              onMouseOut={(e) => (e.target.style.background = "#4a90e2")}
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setEditing(false)}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#ccc",
                color: "#333",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#4a90e2",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#357abd")}
            onMouseOut={(e) => (e.target.style.background = "#4a90e2")}
          >
            Edit Profile
          </button>
        )}

        <button
          onClick={() => auth.signOut()}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#c0392b")}
          onMouseOut={(e) => (e.target.style.background = "#e74c3c")}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
