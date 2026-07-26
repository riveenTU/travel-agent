import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../AdminApp.css";
import "./AdminManagement.css";

function AdminManagement({ admin }) {
  const navigate = useNavigate();
  const [admins,    setAdmins]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [toDelete,  setToDelete]  = useState(null);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [form,      setForm]      = useState({ name: "", email: "", password: "", role: "admin" });

  const token   = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  // Redirect non-super-admins
  useEffect(() => {
    if (admin && admin.role !== "super_admin") navigate("/admin/dashboard");
  }, [admin]);

  useEffect(() => { fetchAdmins(); }, []);

  async function fetchAdmins() {
    try {
      // GET /api/admin/admins
      const res  = await fetch("http://localhost:4000/api/admin/admins", { headers });
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch { setAdmins([]); }
    finally   { setLoading(false); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required."); return;
    }
    try {
      // POST /api/admin/admins
      const res  = await fetch("http://localhost:4000/api/admin/admins", {
        method: "POST", headers, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create admin");
      setAdmins(prev => [...prev, data]);
      setSuccess(`Admin "${data.name}" created successfully.`);
      setForm({ name: "", email: "", password: "", role: "admin" });
      setShowForm(false);
    } catch (err) { setError(err.message); }
  }

  async function handleDeactivate(id) {
    try {
      // PATCH /api/admin/admins/:id/deactivate
      await fetch(`http://localhost:4000/api/admin/admins/${id}/deactivate`, {
        method: "PATCH", headers,
      });
      setAdmins(prev => prev.map(a => a._id === id ? { ...a, isActive: false } : a));
    } catch { alert("Could not deactivate."); }
  }

  async function confirmDelete() {
    try {
      // DELETE /api/admin/admins/:id
      await fetch(`http://localhost:4000/api/admin/admins/${toDelete}`, {
        method: "DELETE", headers,
      });
      setAdmins(prev => prev.filter(a => a._id !== toDelete));
      setToDelete(null);
    } catch { alert("Could not delete."); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admins</h1>
          <p className="admin-page-subtitle">Manage who has access to this panel.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? "Cancel" : "+ New Admin"}
        </button>
      </div>

      {error   && <div className="am-alert am-alert-error">{error}</div>}
      {success && <div className="am-alert am-alert-success">{success}</div>}

      {/* Create form */}
      {showForm && (
        <div className="admin-card am-form">
          <h2 className="am-form-title">Register New Admin</h2>
          <form onSubmit={handleCreate} className="am-form-grid">
            <div className="pf-field">
              <label className="pf-label">Full Name</label>
              <input className="admin-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ayesha Fernando" />
            </div>
            <div className="pf-field">
              <label className="pf-label">Email</label>
              <input className="admin-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ayesha@ceylontours.com" />
            </div>
            <div className="pf-field">
              <label className="pf-label">Password</label>
              <input className="admin-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 characters" />
            </div>
            <div className="pf-field">
              <label className="pf-label">Role</label>
              <select className="admin-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="admin">Admin — can manage packages</option>
                {/* super_admin intentionally not listed here */}
              </select>
            </div>
            <div className="am-form-actions">
              <button type="submit" className="btn-primary">Create Admin</button>
            </div>
          </form>
        </div>
      )}

      {/* Admins table */}
      {loading ? (
        <p style={{ fontFamily: "Barlow, sans-serif", color: "#6b7280" }}>Loading…</p>
      ) : (
        <div className="admin-card am-table-wrap">
          <table className="al-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a._id}>
                  <td className="am-name">
                    <span className="al-avatar">{a.name?.charAt(0)}</span>
                    {a.name}
                  </td>
                  <td style={{ color: "#6b7280", fontSize: 13 }}>{a.email}</td>
                  <td>
                    <span className={`al-badge ${a.role === "super_admin" ? "am-badge-super" : "am-badge-admin"}`}>
                      {a.role === "super_admin" ? "Super Admin" : "Admin"}
                    </span>
                  </td>
                  <td>
                    <span className={`al-badge ${a.isActive !== false ? "badge-published" : "badge-draft"}`}>
                      {a.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ color: "#9ba4b5", fontSize: 13 }}>
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td>
                    {/* Can't delete yourself or other super admins */}
                    {a._id !== admin?._id && a.role !== "super_admin" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        {a.isActive !== false && (
                          <button className="pkg-action-btn" onClick={() => handleDeactivate(a._id)} title="Deactivate">⏸</button>
                        )}
                        <button className="pkg-action-btn pkg-action-delete" onClick={() => setToDelete(a._id)} title="Delete">🗑</button>
                      </div>
                    )}
                    {a._id === admin?._id && <span style={{ fontSize: 12, color: "#9ba4b5" }}>You</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete modal */}
      {toDelete && (
        <div className="modal-overlay" onClick={() => setToDelete(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Delete admin?</h3>
            <p className="modal-body">This will permanently remove their access. This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagement;