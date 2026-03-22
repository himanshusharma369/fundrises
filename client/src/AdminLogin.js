import { useState } from "react";
import axios from "axios";

function AdminLogin({ setToken, setUser, goToUserLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) return setError("Please fill all fields");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      if (!res.data.token) return setError("Auth failed ❌");

      const userData = res.data.user;

      if (userData.role !== "admin") {
        return setError("This account is not an Admin. Use User Login instead.");
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(res.data.token);
      setUser(userData);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .al-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Outfit', sans-serif;
          background: #fff;
        }

        /* ── LEFT DARK PANEL ── */
        .al-left {
          flex: 1;
          background: #0c0514;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 72px;
          position: relative;
          overflow: hidden;
        }

        /* Decorative circles */
        .al-left::before {
          content: '';
          position: absolute;
          top: -120px; left: -120px;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(219,39,119,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .al-left::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Decorative grid lines */
        .al-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .al-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 64px;
          position: relative;
          z-index: 1;
        }
        .al-brand-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #db2777, #9333ea);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 20px rgba(219,39,119,0.5);
        }
        .al-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: white; letter-spacing: 0.3px;
        }

        .al-tagline {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(219,39,119,0.12);
          border: 1px solid rgba(219,39,119,0.3);
          color: #f9a8d4;
          padding: 6px 16px; border-radius: 100px;
          font-size: 12px; font-weight: 500;
          letter-spacing: 1px; text-transform: uppercase;
          margin-bottom: 28px;
          position: relative; z-index: 1;
        }
        .al-tagline-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #db2777;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .al-headline {
          font-family: 'Playfair Display', serif;
          font-size: 52px; font-weight: 900;
          color: white; line-height: 1.05;
          letter-spacing: -1px;
          margin-bottom: 20px;
          position: relative; z-index: 1;
        }
        .al-headline em {
          font-style: italic;
          background: linear-gradient(90deg, #f472b6, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .al-desc {
          font-size: 15px; color: #6b7280;
          line-height: 1.8; max-width: 380px;
          margin-bottom: 48px;
          position: relative; z-index: 1;
        }

        .al-features {
          display: flex; flex-direction: column; gap: 14px;
          position: relative; z-index: 1;
        }
        .al-feature {
          display: flex; align-items: center; gap: 14px;
        }
        .al-feature-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: rgba(219,39,119,0.1);
          border: 1px solid rgba(219,39,119,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .al-feature-text {
          font-size: 14px; color: #9ca3af; font-weight: 400;
        }

        /* ── RIGHT LIGHT PANEL ── */
        .al-right {
          width: 520px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 52px;
          position: relative;
          border-left: 1px solid #f3e8ff;
          overflow-y: auto;
        }

        /* Top accent bar */
        .al-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #db2777, #9333ea, #db2777);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .al-form-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fdf2f8;
          border: 1px solid #fbcfe8;
          color: #9d174d;
          padding: 5px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          margin-bottom: 24px;
        }

        .al-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 700;
          color: #111827;
          margin-bottom: 6px;
          line-height: 1.2;
        }
        .al-form-sub {
          font-size: 14px; color: #6b7280;
          margin-bottom: 36px; line-height: 1.6;
        }

        .al-error {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-left: 3px solid #f43f5e;
          color: #be123c;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }

        .al-field { margin-bottom: 20px; }
        .al-label {
          display: block;
          font-size: 13px; font-weight: 600;
          color: #374151; margin-bottom: 8px;
        }
        .al-input {
          width: 100%; padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px; outline: none;
          font-size: 15px; color: #111827;
          background: #fafafa;
          transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .al-input::placeholder { color: #9ca3af; }
        .al-input:focus {
          border-color: #db2777;
          background: white;
          box-shadow: 0 0 0 4px rgba(219,39,119,0.08);
        }

        .al-submit {
          width: 100%; padding: 15px;
          border: none; border-radius: 12px;
          background: linear-gradient(135deg, #db2777 0%, #9333ea 100%);
          color: white; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.25s;
          margin-top: 8px;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.3px;
          position: relative; overflow: hidden;
          box-shadow: 0 4px 24px rgba(219,39,119,0.35);
        }
        .al-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%);
          opacity: 0; transition: opacity 0.2s;
        }
        .al-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(219,39,119,0.4); }
        .al-submit:hover::after { opacity: 1; }
        .al-submit:active { transform: translateY(0); }
        .al-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .al-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0; color: #d1d5db; font-size: 12px;
        }
        .al-divider::before, .al-divider::after {
          content: ''; flex: 1; height: 1px; background: #f3f4f6;
        }

        .al-user-btn {
          width: 100%; padding: 13px;
          border: 1.5px solid #f3f4f6; border-radius: 12px;
          background: white; color: #6b7280;
          font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .al-user-btn:hover {
          border-color: #db2777; color: #db2777;
          background: #fdf2f8;
        }

        @media (max-width: 900px) {
          .al-left { display: none; }
          .al-right { width: 100%; }
        }
      `}</style>

      {/* ── LEFT DARK PANEL ── */}
      <div className="al-left">
        <div className="al-grid" />

        <div className="al-brand">
          <div className="al-brand-icon">👑</div>
          <div className="al-brand-name">FundRise</div>
        </div>

        <div className="al-tagline">
          <div className="al-tagline-dot" />
          Admin Control Center
        </div>

        <h1 className="al-headline">
          Full Control.<br /><em>Total Power.</em>
        </h1>

        <p className="al-desc">
          Manage all campaigns, track donations, and control the platform from your secure admin dashboard.
        </p>

        <div className="al-features">
          <div className="al-feature">
            <div className="al-feature-icon">🚀</div>
            <span className="al-feature-text">Create & launch fundraising campaigns</span>
          </div>
          <div className="al-feature">
            <div className="al-feature-icon">✏️</div>
            <span className="al-feature-text">Edit and delete any campaign instantly</span>
          </div>
          <div className="al-feature">
            <div className="al-feature-icon">📊</div>
            <span className="al-feature-text">Monitor donations and track progress</span>
          </div>
          <div className="al-feature">
            <div className="al-feature-icon">🛡️</div>
            <span className="al-feature-text">Full dashboard control panel access</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT LIGHT PANEL ── */}
      <div className="al-right">
        <div className="al-form-badge">
          👑 Admin Portal
        </div>

        <h2 className="al-form-title">Admin Sign In</h2>
        <p className="al-form-sub">
          Welcome back! Sign in to access your admin dashboard.
        </p>

        {error && (
          <div className="al-error">
            ⚠️ {error}
          </div>
        )}

        <div className="al-field">
          <label className="al-label">Email Address</label>
          <input
            className="al-input"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="al-field">
          <label className="al-label">Password</label>
          <input
            className="al-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button className="al-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : "Sign In as Admin 👑"}
        </button>

        <div className="al-divider">or</div>

        <button className="al-user-btn" onClick={goToUserLogin}>
          👤 Go to User Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;