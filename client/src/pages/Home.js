import React, { useState, useEffect } from "react";
import { createCampaign, getAllCampaigns } from "../services/api";

const Home = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [image, setImage] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [message, setMessage] = useState("");

  // Load all campaigns on page load
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await getAllCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to load campaigns", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Error: Check your connection or login.");
      return;
    }

    try {
      const result = await createCampaign(title, description, targetAmount, image);

      if (result.success) {
        setMessage("Campaign launched successfully! ✅");
        setTitle("");
        setDescription("");
        setTargetAmount("");
        setImage("");
        fetchCampaigns(); // refresh list
      } else {
        setMessage("Error: " + result.message);
      }
    } catch (err) {
      setMessage("Error: Check your connection or login.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Campaign Form */}
      <h2>Start a Campaign</h2>

      {message && (
        <div style={{
          background: message.includes("Error") ? "#ffe0e0" : "#e0ffe0",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px"
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Description (min 10 characters)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ ...inputStyle, height: "80px" }}
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Image URL (Optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Launch Campaign
        </button>
      </form>

      {/* Campaign List */}
      <h2 style={{ marginTop: "40px" }}>Active Campaigns</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {campaigns.map((c) => (
          <div key={c._id} style={cardStyle}>
            {c.image && (
              <img src={c.image} alt={c.title}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
              />
            )}
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p>🎯 Target: ₹{c.targetAmount}</p>
            <p>💰 Raised: ₹{c.collectedAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  background: "#3b82f6",
  color: "white",
  padding: "12px 24px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  width: "100%",
};

const cardStyle = {
  background: "#f9f9f9",
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "16px",
  width: "280px",
};

export default Home;