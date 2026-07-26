import React, { useState } from "react";
import "../../AdminApp.css";
import "./AdminProfile.css";

function AdminProfile({ admin, setAdmin }) {
  const token   = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [profile, setProfile] = useState({ name: admin?.name || "", email: admin?.email || "" });
  const [pwForm,  setPwForm]  = useState({ current: "", newPw: "", confirm: "" });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [pwMsg,      setPwMsg]      = useState({ type: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw,      setSavingPw]      = useState(false);

  async function handleProfileSave(e) {
    e.preventDefault();
    setSavingProfile(true); setProfileMsg({ type: "", text: "" });
    try {
      // PATCH /api/admin/profile
      const res  = await fetch("http://localhost:4000/api/admin/profile", {
        method: "PATCH", headers, body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const updated = { ...admin, ...profile };
      localStorage.setItem("adminUser", JSON.stringify(updated));
      setAdmin(updated);
      setProfileMsg({ type: "success", text: "Profile updated." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Update failed." });
    } finally { setSavingProfile(false); }
  }

  async function handlePasswordSave(e) {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });
    if (pwForm.newPw !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "New passwords don't match." }); return;
    }
    if (pwForm.newPw.length < 8) {
      setPwMsg({ type: "error", text: "Password must be at least 8 characters." }); return;
    }
    setSavingPw(true);
    try {
      // PATCH /api/admin/profile/password
      const res  = await fetch("http://localhost:4000/api/admin/profile/password", {
        method: "PATCH", headers,
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPwMsg({ type: "success", text: "Password changed successfully." });
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.message || "Failed to change password." });
    } finally { setSavingPw(false); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">My Profile</h1>
          <p className="admin-page-subtitle">Update your account details and password.</p>
        </div>
      </div>

      <div className="ap-layout">
        {/* Profile card */}
        <div className="admin-card ap-section">
          {/* Avatar */}
          <div className="ap-avatar-row">
            <div className="ap-avatar">{admin?.name?.charAt(0).toUpperCase() || "A"}</div>
            <div>
              <p className="ap-avatar-name">{admin?.name}</p>
              <p className="ap-avatar-role">{admin?.role === "super_admin" ? "Super Admin" : "Admin"}</p>
            </div>
          </div>

          <div className="ap-divider" />

          <h2 className="pf-section-title">Personal Info</h2>
          {profileMsg.text && (
            <div className={`pf-alert ${profileMsg.type === "error" ? "pf-alert-error" : "pf-alert-success"}`}>
              {profileMsg.text}
            </div>
          )}
          <form onSubmit={handleProfileSave} className="ap-form">
            <div className="pf-field">
              <label className="pf-label">Full Name</label>
              <input
                className="admin-input"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div className="pf-field">
              <label className="pf-label">Email Address</label>
              <input
                className="admin-input"
                type="email"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>
            <button className="btn-primary" type="submit" disabled={savingProfile}>
              {savingProfile ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Password card */}
        <div className="admin-card ap-section">
          <h2 className="pf-section-title">Change Password</h2>
          {pwMsg.text && (
            <div className={`pf-alert ${pwMsg.type === "error" ? "pf-alert-error" : "pf-alert-success"}`}>
              {pwMsg.text}
            </div>
          )}
          <form onSubmit={handlePasswordSave} className="ap-form">
            <div className="pf-field">
              <label className="pf-label">Current Password</label>
              <input
                className="admin-input"
                type="password"
                value={pwForm.current}
                onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
            <div className="pf-field">
              <label className="pf-label">New Password</label>
              <input
                className="admin-input"
                type="password"
                value={pwForm.newPw}
                onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))}
                placeholder="Min. 8 characters"
              />
            </div>
            <div className="pf-field">
              <label className="pf-label">Confirm New Password</label>
              <input
                className="admin-input"
                type="password"
                value={pwForm.confirm}
                onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password"
              />
            </div>
            <button className="btn-primary" type="submit" disabled={savingPw}>
              {savingPw ? "Changing…" : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;