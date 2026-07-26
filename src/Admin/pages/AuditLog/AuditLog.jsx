import React, { useState, useEffect } from "react";
import "../../AdminApp.css";
import "./AuditLog.css";

const ACTION_COLORS = {
  created:    { bg: "#dcfce7", color: "#166534" },
  updated:    { bg: "#dbeafe", color: "#1e40af" },
  deleted:    { bg: "#fee2e2", color: "#991b1b" },
  published:  { bg: "#fce7f3", color: "#9d174d" },
  drafted:    { bg: "#fef9c3", color: "#854d0e" },
  duplicated: { bg: "#ede9fe", color: "#5b21b6" },
  login:      { bg: "#f3f4f6", color: "#374151" },
};

function AuditLog() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const token = localStorage.getItem("adminToken");
        // GET /api/admin/audit-log
        const res   = await fetch("http://localhost:4000/api/admin/audit-log", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data  = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filtered = filter === "all" ? logs : logs.filter(l => l.action === filter);
  const actions  = ["all", ...Object.keys(ACTION_COLORS)];

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Audit Log</h1>
          <p className="admin-page-subtitle">Every action taken by admins, in order.</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="al-filters">
        {actions.map(a => (
          <button
            key={a}
            className={`al-pill ${filter === a ? "al-pill-active" : ""}`}
            onClick={() => setFilter(a)}
          >
            {a.charAt(0).toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="al-loading">Loading log…</p>
      ) : filtered.length === 0 ? (
        <div className="admin-card al-empty">
          <p>No log entries yet. Actions taken by admins will appear here.</p>
        </div>
      ) : (
        <div className="admin-card al-table-wrap">
          <table className="al-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Target</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const style = ACTION_COLORS[log.action] || ACTION_COLORS.login;
                return (
                  <tr key={log._id || i}>
                    <td className="al-time">{formatDate(log.createdAt)}</td>
                    <td className="al-admin">
                      <span className="al-avatar">{log.adminName?.charAt(0) || "?"}</span>
                      {log.adminName || "Unknown"}
                    </td>
                    <td>
                      <span className="al-badge" style={{ background: style.bg, color: style.color }}>
                        {log.action}
                      </span>
                    </td>
                    <td className="al-target">{log.targetName || "—"}</td>
                    <td className="al-note">{log.note || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AuditLog;