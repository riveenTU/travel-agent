import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

// ─── DUMMY CREDENTIALS FOR TESTING ───────────────────────────────────────────
// Remove this block and uncomment the real API call once the backend is ready
const DUMMY_ADMINS = [
  {
    email: "super@ceylontours.com",
    password: "super1234",
    user: { _id: "dummy-001", name: "Super Admin",  email: "super@ceylontours.com", role: "super_admin" },
  },
  {
    email: "admin@ceylontours.com",
    password: "admin1234",
    user: { _id: "dummy-002", name: "Riveen Admin", email: "admin@ceylontours.com",  role: "admin" },
  },
];
// ─────────────────────────────────────────────────────────────────────────────

function AdminLogin({ setAdmin }) {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);

    // ── DUMMY LOGIN (remove this block when backend is ready) ────────────────
    await new Promise(r => setTimeout(r, 600)); // fake network delay
    const match = DUMMY_ADMINS.find(
      a => a.email === form.email && a.password === form.password
    );
    if (match) {
      localStorage.setItem("adminToken", "dummy-token-for-testing");
      localStorage.setItem("adminUser",  JSON.stringify(match.user));
      setAdmin(match.user);
      setLoading(false);
      navigate("/admin/dashboard");
      return;
    }
    // ── END DUMMY LOGIN ──────────────────────────────────────────────────────

    // ── REAL API LOGIN (uncomment when backend is ready) ─────────────────────
    // try {
    //   const res  = await fetch("http://localhost:4000/api/admin/auth/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(form),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.message || "Login failed");
    //   localStorage.setItem("adminToken", data.token);
    //   localStorage.setItem("adminUser",  JSON.stringify(data.admin));
    //   setAdmin(data.admin);
    //   navigate("/admin/dashboard");
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    // }
    // ─────────────────────────────────────────────────────────────────────────

    setError("Invalid email or password.");
    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-mark">✦</span>
        </div>
        <h1 className="login-title">Ceylon Admin</h1>
        <p className="login-sub">Sign in to manage your packages</p>

        {/* Test credentials hint */}
        <div className="login-hint">
          <p className="login-hint-title">Test credentials</p>
          <p><strong>Super Admin:</strong> super@ceylontours.com / super1234</p>
          <p><strong>Admin:</strong> admin@ceylontours.com / admin1234</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              className="login-input"
              type="email"
              name="email"
              placeholder="admin@ceylontours.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;