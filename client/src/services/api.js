const BASE_URL = "http://localhost:5000/api";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// ─── AUTH ───────────────────────────────────────────
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// ─── CAMPAIGNS ──────────────────────────────────────
export const createCampaign = async (title, description, targetAmount, image) => {
  const res = await fetch(`${BASE_URL}/campaign/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,  // ← sends auth token
    },
    body: JSON.stringify({ title, description, targetAmount, image }),
  });
  return res.json();
};

export const getAllCampaigns = async () => {
  const res = await fetch(`${BASE_URL}/campaign/`);
  return res.json();
};

export const getMyCampaigns = async () => {
  const res = await fetch(`${BASE_URL}/campaign/my-campaigns`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const donateToCampaign = async (id, amount) => {
  const res = await fetch(`${BASE_URL}/campaign/donate/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ amount }),
  });
  return res.json();
};