import { useState } from "react";
import axios from "axios";

function CreateCampaign() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // ✅ VALIDATION
    if (!title || !description || description.length < 10 || !targetAmount) {
      return alert("Description must be at least 10 characters ⚠️");
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/campaign/create`,
        {
          title,
          description,
          targetAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ IMPORTANT
          },
        }
      );

      console.log("Created:", res.data);
      alert("Campaign Created Successfully 🚀");

      // ✅ RESET FORM
      setTitle("");
      setDescription("");
      setTargetAmount("");

    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error creating campaign ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Campaign</h2>

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Enter Description (min 10 chars)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        {/* TARGET AMOUNT */}
        <input
          type="number"
          placeholder="Enter Target Amount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        <br /><br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateCampaign;