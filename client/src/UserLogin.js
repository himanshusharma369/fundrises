import { useState } from "react";
import axios from "axios";

function UserLogin({ setToken, setUser, goToAdminLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return alert("Please fill all fields");
    if (isRegister && !name) return alert("Please enter your name");

    setLoading(true);
    try {
      const endpoint = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const payload = isRegister
        ? { name, email, password, role: "user" }
        : { email, password };

      const res = await axios.post(endpoint, payload);

      if (!res.data.token) return alert("Auth failed ❌");

      const userData = res.data.user;

      // If admin tries to login from user page, redirect them
      if (userData.role === "admin") {
        return alert("This is an Admin account. Please use Admin Login.");
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(res.data.token);
      setUser(userData);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .user-page { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; }

        /* LEFT */
        .user-left {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; padding: 64px;
          background: linear-gradient(145deg, #020d1f 0%, #051c3a 50%, #020d1f 100%);
          position: relative; overflow: hidden;
        }
        .user-left::before {
          content: ''; position: absolute;
          top: -150px; left: -150px; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%);
        }
        .user-left::after {
          content: ''; position: absolute;
          bottom: -100px; right: 50px; width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 65%);
        }
        .user-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 56px; position: relative; z-index: 1; }
        .user-logo-icon {
          width: 52px; height: 52px; border-radius: 16px;
          background: linear-gradient(135deg, #6366f1, #10b981);
          display: flex; align-items: center; justify-content: center; font-size: 26px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }
        .user-logo-text { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: white; }
        .user-hero { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; color: white; line-height: 1.1; letter-spacing: -2px; margin-bottom: 20px; position: relative; z-index: 1; }
        .user-hero span { background: linear-gradient(90deg, #6366f1, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .user-sub { font-size: 15px; color: #9ca3af; line-height: 1.7; max-width: 360px; margin-bottom: 48px; position: relative; z-index: 1; }

        .stats-row { display: flex; gap: 36px; position: relative; z-index: 1; }
        .stat-box { }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: white; }
        .stat-label { font-size: 13px; color: #6b7280; margin-top: 2px; }

        /* RIGHT */
        .user-right {
          width: 460px; background: #f0fdf4;
          display: flex; align-items: center; justify-content: center; padding: 48px 44px;
          border-left: 1px solid rgba(99,102,241,0.1);
        }
        .user-card { width: 100%; }
        .user-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(16,185,129,0.08));
          border: 1px solid rgba(99,102,241,0.2);
          color: #4338ca; padding: 6px 16px; border-radius: 20px;
          font-size: 12px; font-weight: 700; margin-bottom: 24px;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .user-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #1f2937; margin-bottom: 6px; }
        .user-subtitle { font-size: 14px; color: #6b7280; margin-bottom: 32px; }

        .u-input-group { margin-bottom: 18px; }
        .u-label { display: block; font-size: 13px; color: #374151; margin-bottom: 7px; font-weight: 600; }
        .u-input {
          width: 100%; padding: 13px 16px; border-radius: 10px;
          border: 1.5px solid #d1fae5; outline: none; font-size: 15px;
          background: white; color: #1f2937; transition: 0.2s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 1px 3px rgba(99,102,241,0.08);
        }
        .u-input::placeholder { color: #d1d5db; }
        .u-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

        .user-btn {
          width: 100%; padding: 14px; border: none; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #10b981);
          color: white; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: 0.2s; margin-top: 6px;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
        }
        .user-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.35); }
        .user-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .u-switch-link { text-align: center; margin-top: 20px; font-size: 13px; color: #6b7280; }
        .u-switch-link span { color: #6366f1; cursor: pointer; font-weight: 700; }
        .u-switch-link span:hover { text-decoration: underline; }

        .u-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .u-divider::before, .u-divider::after { content: ''; flex: 1; height: 1px; background: #d1fae5; }
        .u-divider-text { font-size: 12px; color: #9ca3af; }

        .go-admin-btn {
          width: 100%; padding: 12px; border: 1.5px solid #d1fae5;
          border-radius: 10px; background: white; color: #6b7280;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .go-admin-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

        @media (max-width: 900px) { .user-left { display: none; } .user-right { width: 100%; } }
      `}</style>

      {/* LEFT PANEL */}
      <div className="user-left">
        <div className="user-logo">
          <div className="user-logo-icon">🚀</div>
          <div className="user-logo-text">FundRise</div>
        </div>
        <div className="user-hero">
          Make a <span>Difference</span><br />Today.
        </div>
        <p className="user-sub">
          Browse active campaigns, support causes you believe in, and track the impact of your donations.
        </p>
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-num">₹73K+</div>
            <div className="stat-label">Total Raised</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">12+</div>
            <div className="stat-label">Campaigns</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">50+</div>
            <div className="stat-label">Donors</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="user-right">
        <div className="user-card">
          <div className="user-badge">👤 User Portal</div>
          <div className="user-title">{isRegister ? "Create Account" : "Welcome Back"}</div>
          <div className="user-subtitle">
            {isRegister ? "Join FundRise and start making an impact" : "Sign in to browse and donate to campaigns"}
          </div>

          {isRegister && (
            <div className="u-input-group">
              <label className="u-label">Full Name</label>
              <input className="u-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <div className="u-input-group">
            <label className="u-label">Email Address</label>
            <input className="u-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="u-input-group">
            <label className="u-label">Password</label>
            <input
              className="u-input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <button className="user-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create Account 🚀" : "Sign In 👤"}
          </button>

          <div className="u-switch-link" style={{ marginTop: 16 }}>
            {isRegister ? "Already have an account? " : "New here? "}
            <span onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Sign In" : "Register"}
            </span>
          </div>

          <div className="u-divider"><span className="u-divider-text">or</span></div>

          <button className="go-admin-btn" onClick={goToAdminLogin}>
            👑 Go to Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;