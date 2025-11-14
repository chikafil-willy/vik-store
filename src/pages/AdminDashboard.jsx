// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase"; 
import supabase from "../supabaseClient";

const categories = ["caps", "trousers", "jewelries", "shoes", "shirts_and_polos"];

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState({ name: "", price: "", category: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>Please log in to access the admin dashboard.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");
    if (!product.category) return alert("Please select a category");

    setLoading(true);
    setMessage("");

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const bucket = "products";

      console.log("Uploading file:", fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      const { error: insertError } = await supabase
        .from(product.category)
        .insert([{ name: product.name, price: product.price, image_url: publicUrl }]);

      if (insertError) throw insertError;

      setMessage("✅ Product uploaded successfully!");
      setProduct({ name: "", price: "", category: "" });
      setFile(null);
    } catch (err) {
      console.error("FULL ERROR DETAILS:", err);
      setMessage("❌ Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "550px",
      margin: "50px auto",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      backgroundColor: "#f9f9f9",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>Admin Dashboard</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="text"
          placeholder="Product name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
        />

        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          required
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
        />

        <select
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          required
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            backgroundColor: "#fff"
          }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{
            padding: "6px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4a90e2",
            color: "#fff",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#357ABD"; }}
          onMouseOut={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#4a90e2"; }}
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>

      {message && (
        <p style={{
          marginTop: "20px",
          textAlign: "center",
          fontWeight: "500",
          color: message.startsWith("✅") ? "green" : "red"
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AdminDashboard;
