import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import logo from "../assets/logo.png";

const LocationPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [otherText, setOtherText] = useState("");

  const locations = ["Lagos", "Abuja", "Ibadan", "Port Harcourt", "Others"];

  // 🔥 Check if user has visited before
  useEffect(() => {
    const visitedBefore = localStorage.getItem("visited");
    if (!visitedBefore) {
      setShowPopup(true);
    }
  }, []);

  const saveLocationAndClose = async (locationToSave) => {
    setLoading(true);

    try {
      await supabase
        .from("visits")
        .insert([{ location: locationToSave, created_at: new Date() }]);
    } catch (error) {
      console.error("Supabase insert error:", error.message);
    }

    // Save in localStorage so it won't show again
    localStorage.setItem("visited", "true");

    setLoading(false);
    setShowPopup(false);
  };

  const handleSelect = async (loc) => {
    setSelectedLocation(loc);

    if (loc !== "Others") {
      await saveLocationAndClose(loc);
    }
  };

  const handleOtherInput = async (e) => {
    const value = e.target.value;
    setOtherText(value);

    if (value.length > 2) {
      await saveLocationAndClose(value);
    }
  };

  if (!showPopup) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
        }}
      >
        {/* LOGO */}
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "40px",
            marginBottom: "1rem",
          }}
        />

        <h2 style={{ marginBottom: "1rem" }}>Where are you visiting us from?</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {locations.map((loc) => (
            <li
              key={loc}
              onClick={() => handleSelect(loc)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.8rem 1rem",
                marginBottom: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                cursor: "pointer",
                background: selectedLocation === loc ? "#e7f1ff" : "#fff",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <span>{loc}</span>
              <input
                type="checkbox"
                checked={selectedLocation === loc}
                readOnly
                style={{ width: "18px", height: "18px" }}
              />
            </li>
          ))}
        </ul>

        {/* Show input only when 'Others' is selected */}
        {selectedLocation === "Others" && (
          <input
            type="text"
            placeholder="Enter your location"
            value={otherText}
            onChange={handleOtherInput}
            style={{
              width: "100%",
              padding: "0.8rem",
              marginTop: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LocationPopup;
