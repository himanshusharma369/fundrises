// import { useState } from "react";
// import axios from "axios";

// function Login({ setToken, setUser }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isRegister, setIsRegister] = useState(false);
//   const [role, setRole] = useState("user");

//   const handleSubmit = async () => {
//     if (!email || !password) return alert("Please fill all fields");
//     if (isRegister && !name) return alert("Please enter your name");

//     setLoading(true);
//     try {
//       const endpoint = isRegister
//         ? "http://localhost:5000/api/auth/register"
//         : "http://localhost:5000/api/auth/login";

//       const payload = isRegister
//         ? { name, email, password, role }
//         : { email, password };

//       const res = await axios.post(endpoint, payload);
//       console.log("AUTH RESPONSE:", res.data);

//       if (!res.data.token) {
//         alert("Auth failed: Token not received ❌");
//         return;
//       }

//       const token = res.data.token;
//       const userData = res.data.user;

//       // ✅ Set axios header immediately
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       // ✅ Save both token AND user to localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(userData));

//       // ✅ Update React state - BOTH token and user
//       setToken(token);
//       setUser(userData);

//       console.log("USER SAVED:", userData);
//     } catch (err) {
//       console.error("AUTH ERROR:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         .login-page { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; background: #060612; }

//         .login-left {
//           flex: 1; display: flex; flex-direction: column;
//           justify-content: center; padding: 60px; position: relative;
//           background: linear-gradient(135deg, #060612 0%, #0d0d2b 50%, #0a0a1f 100%);
//         }
//         .login-left::before {
//           content: ''; position: absolute; top: -200px; left: -200px;
//           width: 600px; height: 600px;
//           background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
//         }
//         .login-left::after {
//           content: ''; position: absolute; bottom: -100px; right: -100px;
//           width: 400px; height: 400px;
//           background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%);
//         }
//         .brand { display: flex; align-items: center; gap: 14px; margin-bottom: 60px; }
//         .brand-icon {
//           width: 48px; height: 48px;
//           background: linear-gradient(135deg, #6366f1, #ec4899);
//           border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px;
//         }
//         .brand-name { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: white; }
//         .hero-text {
//           font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800;
//           color: white; line-height: 1.1; letter-spacing: -2px; margin-bottom: 24px;
//         }
//         .hero-text span {
//           background: linear-gradient(90deg, #6366f1, #ec4899);
//           -webkit-background-clip: text; -webkit-text-fill-color: transparent;
//         }
//         .hero-sub { font-size: 16px; color: #64748b; line-height: 1.7; max-width: 380px; margin-bottom: 48px; }
//         .stats { display: flex; gap: 40px; }
//         .stat-num { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: white; }
//         .stat-label { font-size: 13px; color: #475569; margin-top: 2px; }

//         .login-right {
//           width: 480px; background: #0d0d1f;
//           border-left: 1px solid rgba(255,255,255,0.06);
//           display: flex; align-items: center; justify-content: center; padding: 48px 40px;
//         }
//         .login-card { width: 100%; }
//         .card-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: white; margin-bottom: 6px; }
//         .card-sub { font-size: 14px; color: #475569; margin-bottom: 32px; }

//         .role-toggle {
//           display: flex; background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.08);
//           border-radius: 12px; padding: 4px; margin-bottom: 24px; gap: 4px;
//         }
//         .role-btn {
//           flex: 1; padding: 10px; border: none; border-radius: 9px;
//           cursor: pointer; font-size: 14px; font-weight: 500;
//           transition: all 0.2s; background: transparent; color: #475569;
//           font-family: 'DM Sans', sans-serif;
//         }
//         .role-btn.active-user {
//           background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
//           box-shadow: 0 4px 12px rgba(99,102,241,0.3);
//         }
//         .role-btn.active-admin {
//           background: linear-gradient(135deg, #ec4899, #f43f5e); color: white;
//           box-shadow: 0 4px 12px rgba(236,72,153,0.3);
//         }

//         .admin-notice {
//           display: flex; align-items: center; gap: 8px;
//           background: rgba(236,72,153,0.08);
//           border: 1px solid rgba(236,72,153,0.2);
//           border-radius: 10px; padding: 10px 14px; margin-bottom: 20px;
//           font-size: 13px; color: #ec4899; font-weight: 500;
//         }

//         .input-group { margin-bottom: 16px; }
//         .input-label { display: block; font-size: 13px; color: #94a3b8; margin-bottom: 8px; font-weight: 500; }
//         .login-input {
//           width: 100%; padding: 13px 16px; border-radius: 10px;
//           border: 1px solid rgba(255,255,255,0.08); outline: none;
//           font-size: 15px; background: rgba(255,255,255,0.04); color: white;
//           transition: 0.2s; font-family: 'DM Sans', sans-serif;
//         }
//         .login-input::placeholder { color: #334155; }
//         .login-input:focus {
//           border-color: rgba(99,102,241,0.5);
//           background: rgba(99,102,241,0.05);
//           box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
//         }

//         .login-btn {
//           width: 100%; padding: 14px; border: none; border-radius: 10px;
//           color: white; font-size: 15px; font-weight: 600;
//           cursor: pointer; transition: 0.2s; margin-top: 8px;
//           font-family: 'DM Sans', sans-serif;
//         }
//         .login-btn.user-btn {
//           background: linear-gradient(135deg, #6366f1, #8b5cf6);
//           box-shadow: 0 4px 20px rgba(99,102,241,0.3);
//         }
//         .login-btn.admin-btn {
//           background: linear-gradient(135deg, #ec4899, #f43f5e);
//           box-shadow: 0 4px 20px rgba(236,72,153,0.3);
//         }
//         .login-btn:hover { transform: translateY(-2px); opacity: 0.92; }
//         .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

//         .bottom-text { text-align: center; margin-top: 20px; font-size: 13px; color: #475569; }
//         .bottom-text span { color: #6366f1; cursor: pointer; font-weight: 600; }

//         @media (max-width: 900px) { .login-left { display: none; } .login-right { width: 100%; } }
//       `}</style>

//       {/* LEFT HERO */}
//       <div className="login-left">
//         <div className="brand">
//           <div className="brand-icon">🚀</div>
//           <div className="brand-name">FundRise</div>
//         </div>
//         <div className="hero-text">
//           Fund the <span>future</span>,<br />one cause<br />at a time.
//         </div>
//         <p className="hero-sub">
//           A powerful platform to create, manage, and support fundraising campaigns.
//           Admins lead, users contribute.
//         </p>
//         <div className="stats">
//           <div><div className="stat-num">₹73K+</div><div className="stat-label">Total Raised</div></div>
//           <div><div className="stat-num">12+</div><div className="stat-label">Campaigns</div></div>
//           <div><div className="stat-num">50+</div><div className="stat-label">Donors</div></div>
//         </div>
//       </div>

//       {/* RIGHT FORM */}
//       <div className="login-right">
//         <div className="login-card">
//           <div className="card-title">{isRegister ? "Create Account" : "Welcome back"}</div>
//           <div className="card-sub">
//             {isRegister ? "Join FundRise and start making an impact" : "Sign in to your FundRise account"}
//           </div>

//           {/* ROLE SELECTOR */}
//           <div className="role-toggle">
//             <button className={`role-btn ${role === "user" ? "active-user" : ""}`} onClick={() => setRole("user")}>
//               👤 User
//             </button>
//             <button className={`role-btn ${role === "admin" ? "active-admin" : ""}`} onClick={() => setRole("admin")}>
//               👑 Admin
//             </button>
//           </div>

//           {role === "admin" && (
//             <div className="admin-notice">👑 Admin Access — Full control panel unlocked</div>
//           )}

//           {isRegister && (
//             <div className="input-group">
//               <label className="input-label">Full Name</label>
//               <input className="login-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
//             </div>
//           )}

//           <div className="input-group">
//             <label className="input-label">Email Address</label>
//             <input className="login-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
//           </div>

//           <div className="input-group">
//             <label className="input-label">Password</label>
//             <input
//               className="login-input" type="password" placeholder="••••••••"
//               value={password} onChange={e => setPassword(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && handleSubmit()}
//             />
//           </div>

//           <button
//             className={`login-btn ${role === "admin" ? "admin-btn" : "user-btn"}`}
//             onClick={handleSubmit} disabled={loading}
//           >
//             {loading ? "Please wait..." : isRegister
//               ? `Register as ${role === "admin" ? "Admin 👑" : "User 👤"}`
//               : `Login as ${role === "admin" ? "Admin 👑" : "User 👤"}`}
//           </button>

//           <div className="bottom-text">
//             {isRegister ? "Already have an account? " : "Don't have an account? "}
//             <span onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Login" : "Register"}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;