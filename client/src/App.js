import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminLogin from "./AdminLogin";
import UserLogin from "./UserLogin";
import Profile from "./Profile";
import Footer from "./components/Footer";

const API_BASE = "http://localhost:5000/api";

// ── DECODE JWT ────────────────────────────────────────────────
function parseJwt(token) {
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch { return null; }
}

// ── ANIMATED COUNTER ──────────────────────────────────────────
const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    let frameId;
    const endValue = Number(value) || 0;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setDisplayValue(Math.floor(progress * endValue));
      if (progress < 1) frameId = window.requestAnimationFrame(step);
    };
    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [value, duration]);
  return <span>₹{displayValue.toLocaleString()}</span>;
};

// ── APP ───────────────────────────────────────────────────────
function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loginPage, setLoginPage] = useState("user"); // "user" | "admin"

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      const parsedUser = stored ? JSON.parse(stored) : null;
      if (parsedUser?.role) return parsedUser;
      // Fallback: decode role from token
      const storedToken = localStorage.getItem("token");
      if (storedToken && parsedUser) {
        const decoded = parseJwt(storedToken);
        if (decoded?.role) {
          const updated = { ...parsedUser, role: decoded.role };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        }
      }
      return parsedUser;
    } catch { return null; }
  });

  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [formData, setFormData] = useState({ title: "", description: "", targetAmount: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateAmount, setDonateAmount] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [popup, setPopup] = useState({ show: false, msg: "" });
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleSetUser = (userData) => {
    if (!userData) { setUser(null); return; }
    if (!userData.role) {
      const storedToken = localStorage.getItem("token");
      const decoded = parseJwt(storedToken);
      if (decoded?.role) userData = { ...userData, role: decoded.role };
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchCampaigns = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/campaign`);
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Fetch error:", err); }
  }, []);

  useEffect(() => {
    if (token) fetchCampaigns();
  }, [token, fetchCampaigns]);

  const triggerPopup = (msg) => setPopup({ show: true, msg });

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ── ADMIN: CREATE / UPDATE ────────────────────────────────
  const handleCampaignSubmit = async () => {
    const { title, description, targetAmount } = formData;
    if (!title || !description || !targetAmount) return triggerPopup("Fill all required fields! ⚠️");
    if (description.length < 10) return triggerPopup("Description must be at least 10 characters! ⚠️");
    if (Number(targetAmount) <= 0) return triggerPopup("Target amount must be greater than 0! ⚠️");

    const currentToken = localStorage.getItem("token");
    if (!currentToken) return triggerPopup("Session expired. Please login again.");

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetAmount: Number(formData.targetAmount),
        image: formData.image.trim(),
      };
      if (editingId) {
        await axios.put(`${API_BASE}/campaign/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        triggerPopup("Campaign Updated! ✅");
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/campaign/create`, payload, {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        triggerPopup("Campaign Launched! 🚀");
      }
      setFormData({ title: "", description: "", targetAmount: "", image: "" });
      fetchCampaigns();
    } catch (err) {
      triggerPopup(err?.response?.data?.message || "Error: Check your connection or login.");
    } finally {
      setLoading(false);
    }
  };

  // ── ADMIN: DELETE ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    const currentToken = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE}/campaign/${id}`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      triggerPopup("Campaign Deleted 🗑️");
      fetchCampaigns();
    } catch { triggerPopup("Failed to delete campaign."); }
  };

  // ── ADMIN: EDIT ───────────────────────────────────────────
  const handleEdit = (campaign) => {
    setEditingId(campaign._id);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      targetAmount: campaign.targetAmount,
      image: campaign.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── USER: DONATE ──────────────────────────────────────────
  const handleDonation = async () => {
    if (!donateAmount || donateAmount <= 0) return triggerPopup("Enter a valid amount.");
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return triggerPopup("Please login to donate.");
    try {
      const { data } = await axios.post(
        `${API_BASE}/payment/create-order`,
        { amount: donateAmount },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_dsKI83R4G2Fq8X",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "FundRise",
        order_id: data.order.id,
        handler: async () => {
          await axios.post(
            `${API_BASE}/campaign/donate/${selectedCampaign}`,
            { amount: donateAmount },
            { headers: { Authorization: `Bearer ${currentToken}` } }
          );
          fetchCampaigns();
          setShowDonateModal(false);
          setDonateAmount("");
          triggerPopup("Donation Successful! ❤️");
        },
      };
      new window.Razorpay(options).open();
    } catch { triggerPopup("Payment Initialization Failed ❌"); }
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  // ── GUARD: Show login pages if not authenticated ──────────
  if (!token || !user) {
    if (loginPage === "admin") {
      return (
        <AdminLogin
          setToken={setToken}
          setUser={handleSetUser}
          goToUserLogin={() => setLoginPage("user")}
        />
      );
    }
    return (
      <UserLogin
        setToken={setToken}
        setUser={handleSetUser}
        goToAdminLogin={() => setLoginPage("admin")}
      />
    );
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        body { margin: 0; font-family: 'DM Sans', sans-serif; }
        .app { min-height: 100vh; background: #f1f5f9; color: #1e293b; }
        .dark { background: #0f172a; color: #f8fafc; }

        .navbar { position: sticky; top: 0; z-index: 100; background: white; padding: 0.85rem 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .dark .navbar { background: #1e293b; border-bottom: 1px solid #334155; }
        .nav-content { max-width: 1200px; margin: auto; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #6366f1; }
        .nav-left { display: flex; align-items: center; gap: 14px; }
        .nav-right { display: flex; align-items: center; gap: 10px; }
        .role-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-admin { background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid rgba(236,72,153,0.25); }
        .badge-user  { background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.25); }
        .nav-email { font-size: 13px; color: #94a3b8; }
        .btn-icon { background: transparent; border: 1px solid #e2e8f0; color: #64748b; padding: 6px 10px; border-radius: 8px; cursor: pointer; font-size: 17px; }
        .btn-logout { background: rgba(239,68,68,0.08); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); padding: 6px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .btn-logout:hover { background: rgba(239,68,68,0.15); }

        .container { max-width: 1200px; margin: 2rem auto; display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; padding: 0 1rem; }
        .card { background: white; padding: 1.5rem; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .dark .card { background: #1e293b; border: 1px solid #334155; }

        /* ADMIN FORM */
        .admin-panel { border: 2px solid rgba(236,72,153,0.25); background: linear-gradient(135deg, rgba(236,72,153,0.03), rgba(168,85,247,0.03)); margin-bottom: 1.5rem; }
        .admin-panel-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #ec4899; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }

        /* USER BANNER */
        .user-banner { background: linear-gradient(135deg, rgba(99,102,241,0.07), rgba(16,185,129,0.04)); border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 14px 18px; margin-bottom: 1.5rem; font-size: 13px; color: #6366f1; font-weight: 500; display: flex; align-items: center; gap: 8px; }

        .input-field { width: 100%; padding: 0.8rem 1rem; margin-bottom: 1rem; border: 1px solid #e2e8f0; border-radius: 10px; box-sizing: border-box; background: inherit; color: inherit; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .dark .input-field { border-color: #334155; }
        .input-field:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

        .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; width: 100%; transition: 0.2s; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; }
        .btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-admin   { background: linear-gradient(135deg, #ec4899, #a855f7); color: white; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
        .btn-donate  { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .btn-cancel  { background: rgba(100,116,139,0.1); color: #64748b; border: 1px solid #e2e8f0; margin-top: 8px; }
        .btn-edit    { background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.2); padding: 7px 16px; width: auto; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-delete  { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); padding: 7px 16px; width: auto; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-edit:hover   { background: rgba(99,102,241,0.2); transform: translateY(-1px); }
        .btn-delete:hover { background: rgba(239,68,68,0.2); transform: translateY(-1px); }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
        .camp-card { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; display: flex; flex-direction: column; transition: 0.25s; }
        .camp-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.1); }
        .dark .camp-card { background: #1e293b; border: 1px solid #334155; }
        .camp-img { width: 100%; height: 160px; object-fit: cover; }
        .camp-body { padding: 1.2rem; flex: 1; display: flex; flex-direction: column; }
        .camp-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin: 0 0 6px 0; }
        .camp-desc { font-size: 13px; color: #64748b; flex: 1; margin-bottom: 10px; line-height: 1.5; }
        .progress-bg { height: 6px; background: #e2e8f0; border-radius: 4px; margin: 8px 0 12px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); transition: width 0.8s ease-out; }
        .camp-stats { font-size: 13px; margin-bottom: 14px; }
        .camp-actions { display: flex; gap: 8px; margin-top: auto; flex-wrap: wrap; }

        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 400px; text-align: center; }
        .dark .modal { background: #1e293b; border: 1px solid #334155; }

        @media (max-width: 850px) { .container { grid-template-columns: 1fr; } }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left">
            <span className="nav-brand">🚀 FundRise</span>
            <span className={`role-badge ${isAdmin ? "badge-admin" : "badge-user"}`}>
              {isAdmin ? "👑 Admin" : "👤 User"}
            </span>
          </div>
          <div className="nav-right">
            <span className="nav-email">{user?.email}</span>
            <button className="btn-icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container">
        <main>
          {/* ADMIN ONLY: FORM */}
          {isAdmin && (
            <section className="card admin-panel">
              <div className="admin-panel-title">
                {editingId ? "✏️ Edit Campaign" : "👑 Create New Campaign"}
              </div>
              <input className="input-field" placeholder="Campaign Title *" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              <textarea className="input-field" placeholder="Tell your story... (min 10 characters) *" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              <div style={{ display: "flex", gap: "10px" }}>
                <input className="input-field" type="number" placeholder="Target Amount ₹ *" value={formData.targetAmount} onChange={e => setFormData({ ...formData, targetAmount: e.target.value })} />
                <input className="input-field" placeholder="Image URL (Optional)" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
              </div>
              <button className="btn btn-admin" onClick={handleCampaignSubmit} disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update Campaign ✅" : "Launch Campaign 🚀"}
              </button>
              {editingId && (
                <button className="btn btn-cancel" onClick={() => { setEditingId(null); setFormData({ title: "", description: "", targetAmount: "", image: "" }); }}>
                  Cancel Edit
                </button>
              )}
            </section>
          )}

          {/* USER ONLY: BANNER */}
          {!isAdmin && (
            <div className="user-banner">
              👤 You are logged in as a <strong style={{ marginLeft: 4 }}>User</strong> — Browse campaigns and donate to support causes!
            </div>
          )}

          {/* SEARCH */}
          <input className="input-field" style={{ fontSize: "1rem", padding: "1rem", marginBottom: 0 }} placeholder="🔍 Search active campaigns..." value={search} onChange={e => setSearch(e.target.value)} />

          {/* CAMPAIGNS */}
          <div className="grid">
            {filteredCampaigns.length === 0 ? (
              <p style={{ color: "#94a3b8", gridColumn: "1/-1" }}>No campaigns found.</p>
            ) : (
              filteredCampaigns.map(c => {
                const pct = Math.min((c.collectedAmount / c.targetAmount) * 100, 100) || 0;
                return (
                  <article key={c._id} className="camp-card">
                    <img className="camp-img" src={c.image || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500"} alt={c.title} />
                    <div className="camp-body">
                      <h4 className="camp-title">{c.title}</h4>
                      <p className="camp-desc">{c.description?.slice(0, 90)}...</p>
                      <div className="progress-bg">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="camp-stats">
                        <strong style={{ color: "#10b981", fontSize: "15px" }}>
                          <AnimatedNumber value={c.collectedAmount} />
                        </strong>{" "}
                        raised of ₹{Number(c.targetAmount).toLocaleString()}
                        <span style={{ color: "#94a3b8", marginLeft: 6 }}>({Math.round(pct)}%)</span>
                      </div>
                      <div className="camp-actions">
                        {!isAdmin && (
                          <button className="btn btn-donate" onClick={() => { setSelectedCampaign(c._id); setShowDonateModal(true); }}>
                            Donate ❤️
                          </button>
                        )}
                        {isAdmin && (
                          <>
                            <button className="btn-edit" onClick={() => handleEdit(c)}>✏️ Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(c._id)}>🗑️ Delete</button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>

        <aside>
          <div className="card"><Profile token={token} /></div>
        </aside>
      </div>

      {/* POPUP */}
      {popup.show && (
        <div className="overlay" onClick={() => setPopup({ show: false, msg: "" })}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "12px" }}>Notice</h3>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>{popup.msg}</p>
            <button className="btn btn-primary" onClick={() => setPopup({ show: false, msg: "" })}>Got it!</button>
          </div>
        </div>
      )}

      {/* DONATE MODAL */}
      {showDonateModal && !isAdmin && (
        <div className="overlay">
          <div className="modal">
            <h3 style={{ marginBottom: "8px" }}>Support this Cause ❤️</h3>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>Enter the amount you wish to contribute</p>
            <input className="input-field" type="number" placeholder="₹ Amount" value={donateAmount} onChange={e => setDonateAmount(e.target.value)} style={{ textAlign: "center", fontSize: "2rem", margin: "0 0 16px" }} />
            <button className="btn btn-donate" onClick={handleDonation}>Confirm Payment</button>
            <button className="btn btn-cancel" onClick={() => { setShowDonateModal(false); setDonateAmount(""); }}>Cancel</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;