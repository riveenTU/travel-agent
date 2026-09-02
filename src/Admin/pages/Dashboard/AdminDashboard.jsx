import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../AdminApp.css";
import "./AdminDashboard.css";

const CATEGORIES = ["Cultural Triangle","Coast Beaches","Hill Country","Wildlife Nature"];

function StatCard({ label, value, sub, color }) {
  return (
    <div className="dash-stat-card" style={{ borderTopColor: color }}>
      <p className="dash-stat-label">{label}</p>
      <p className="dash-stat-value">{value}</p>
      {sub && <p className="dash-stat-sub">{sub}</p>}
    </div>
  );
}

function AdminDashboard({ admin }) {
  const [stats,   setStats]   = useState(null);
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("adminToken");
        const headers = { Authorization: `Bearer ${token}` };

        // GET /api/admin/dashboard/stats
        const [statsRes, recentRes] = await Promise.all([
          fetch("http://localhost:4000/api/admin/dashboard/stats", { headers }),
          fetch("http://localhost:4000/api/admin/dashboard/recent", { headers }),
        ]);
        const statsData  = await statsRes.json();
        const recentData = await recentRes.json();
        setStats(statsData);
        setRecent(recentData);
      } catch {
        // Backend not ready yet — use placeholder data
        setStats({
          total: 0, published: 0, draft: 0, popular: 0,
          byCategory: { "Cultural Triangle": 0, "Coast Beaches": 0, "Hill Country": 0, "Wildlife Nature": 0 }
        });
        setRecent([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="admin-page"><p className="dash-loading">Loading dashboard…</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            Good {getGreeting()}, {admin?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="admin-page-subtitle">Here's what's happening with your packages today.</p>
        </div>
        <Link to="/admin/packages/new" className="btn-primary">+ New Package</Link>
      </div>

      {/* Stat cards */}
      <div className="dash-stats">
        <StatCard label="Total Packages" value={stats?.total ?? "—"}      color="#A27B5C" />
        <StatCard label="Published"      value={stats?.published ?? "—"}  color="#22c55e" />
        <StatCard label="Drafts"         value={stats?.draft ?? "—"}      color="#eab308" />
        <StatCard label="Popular"        value={stats?.popular ?? "—"}    color="#3b82f6" />
      </div>

      {/* Category breakdown */}
      <div className="dash-row">
        <div className="admin-card dash-cat-card">
          <h2 className="dash-section-title">Packages by Category</h2>
          <div className="dash-cat-list">
            {CATEGORIES.map(cat => {
              const count = stats?.byCategory?.[cat] ?? 0;
              const pct   = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={cat} className="dash-cat-row">
                  <span className="dash-cat-name">{cat}</span>
                  <div className="dash-cat-bar-wrap">
                    <div className="dash-cat-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="dash-cat-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="admin-card dash-recent-card">
          <h2 className="dash-section-title">Recent Packages</h2>
          {recent.length === 0 ? (
            <p className="dash-empty">No packages yet. <Link to="/admin/packages/new">Add one →</Link></p>
          ) : (
            <ul className="dash-recent-list">
              {recent.map(pkg => (
                <li key={pkg._id} className="dash-recent-item">
                  <div>
                    <p className="dash-recent-name">{pkg.name}</p>
                    <p className="dash-recent-cat">{pkg.category}</p>
                  </div>
                  <span className={`badge ${pkg.status === "published" ? "badge-published" : "badge-draft"}`}>
                    {pkg.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/packages" className="dash-see-all">See all packages →</Link>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default AdminDashboard;