import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../AdminApp.css";
import "./PackagesList.css";

const CATEGORIES = ["All","Cultural Triangle","Coast Beaches","Hill Country","Wildlife Nature"];
const SORT_OPTIONS = [
  { label: "Newest first",  value: "newest"    },
  { label: "Oldest first",  value: "oldest"    },
  { label: "Price: low–high", value: "price_asc" },
  { label: "Price: high–low", value: "price_desc"},
  { label: "Name A–Z",      value: "name_asc"  },
];

function PackagesList() {
  const navigate   = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [sort,     setSort]     = useState("newest");
  const [toDelete, setToDelete] = useState(null); // id of package pending delete confirm

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { fetchPackages(); }, []);

  async function fetchPackages() {
    setLoading(true);
    try {
      // GET /api/admin/packages
      const res  = await fetch("http://localhost:4000/api/admin/packages", { headers });
      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch {
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }

  // --- Actions ---
  async function toggleStatus(pkg) {
    const newStatus = pkg.status === "published" ? "draft" : "published";
    try {
      // PATCH /api/admin/packages/:id/status
      await fetch(`http://localhost:4000/api/admin/packages/${pkg._id}/status`, {
        method: "PATCH", headers,
        body: JSON.stringify({ status: newStatus }),
      });
      setPackages(prev => prev.map(p => p._id === pkg._id ? { ...p, status: newStatus } : p));
    } catch { alert("Could not update status."); }
  }

  async function togglePopular(pkg) {
    try {
      // PATCH /api/admin/packages/:id/popular
      await fetch(`http://localhost:4000/api/admin/packages/${pkg._id}/popular`, {
        method: "PATCH", headers,
        body: JSON.stringify({ isPopular: !pkg.isPopular }),
      });
      setPackages(prev => prev.map(p => p._id === pkg._id ? { ...p, isPopular: !p.isPopular } : p));
    } catch { alert("Could not update."); }
  }

  async function duplicatePackage(pkg) {
    try {
      // POST /api/admin/packages/:id/duplicate
      const res  = await fetch(`http://localhost:4000/api/admin/packages/${pkg._id}/duplicate`, {
        method: "POST", headers,
      });
      const copy = await res.json();
      setPackages(prev => [copy, ...prev]);
    } catch { alert("Could not duplicate."); }
  }

  async function confirmDelete() {
    try {
      // DELETE /api/admin/packages/:id
      await fetch(`http://localhost:4000/api/admin/packages/${toDelete}`, {
        method: "DELETE", headers,
      });
      setPackages(prev => prev.filter(p => p._id !== toDelete));
      setToDelete(null);
    } catch { alert("Could not delete."); }
  }

  // --- Filter + sort ---
  const displayed = packages
    .filter(p => {
      const catOk    = category === "All" || p.category === category;
      const searchOk = p.name.toLowerCase().includes(search.toLowerCase());
      return catOk && searchOk;
    })
    .sort((a, b) => {
      if (sort === "newest")    return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest")    return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc")return b.price - a.price;
      if (sort === "name_asc")  return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Packages</h1>
          <p className="admin-page-subtitle">{packages.length} total packages</p>
        </div>
        <Link to="/admin/packages/new" className="btn-primary">+ New Package</Link>
      </div>

      {/* Filters row */}
      <div className="admin-card pkg-filters">
        <input
          className="admin-input pkg-search"
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="admin-input pkg-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="admin-input pkg-select" value={sort} onChange={e => setSort(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {(search || category !== "All") && (
          <button className="btn-ghost" onClick={() => { setSearch(""); setCategory("All"); }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <p className="pkg-loading">Loading packages…</p>
      ) : displayed.length === 0 ? (
        <div className="pkg-empty">
          <p>No packages found.</p>
          <Link to="/admin/packages/new" className="btn-primary">Add your first package</Link>
        </div>
      ) : (
        <div className="admin-card pkg-table-wrap">
          <table className="pkg-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Popular</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(pkg => (
                <tr key={pkg._id}>
                  <td className="pkg-name-cell">
                    <span className="pkg-name">{pkg.name}</span>
                    <span className="pkg-duration">{pkg.duration}</span>
                  </td>
                  <td><span className="pkg-category">{pkg.category}</span></td>
                  <td className="pkg-price">{pkg.currency} {pkg.price?.toLocaleString()}</td>
                  <td>
                    <button
                      className={`pkg-toggle-btn ${pkg.status === "published" ? "toggle-published" : "toggle-draft"}`}
                      onClick={() => toggleStatus(pkg)}
                      title="Click to toggle"
                    >
                      {pkg.status === "published" ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`pkg-popular-btn ${pkg.isPopular ? "popular-on" : "popular-off"}`}
                      onClick={() => togglePopular(pkg)}
                      title={pkg.isPopular ? "Remove from popular" : "Mark as popular"}
                    >
                      {pkg.isPopular ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="pkg-actions">
                    <button className="pkg-action-btn" onClick={() => navigate(`/admin/packages/preview/${pkg._id}`)} title="Preview">👁</button>
                    <button className="pkg-action-btn" onClick={() => navigate(`/admin/packages/edit/${pkg._id}`)} title="Edit">✏️</button>
                    <button className="pkg-action-btn" onClick={() => duplicatePackage(pkg)} title="Duplicate">⧉</button>
                    <button className="pkg-action-btn pkg-action-delete" onClick={() => setToDelete(pkg._id)} title="Delete">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirm modal */}
      {toDelete && (
        <div className="modal-overlay" onClick={() => setToDelete(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Delete package?</h3>
            <p className="modal-body">This cannot be undone. The package will be permanently removed.</p>
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

export default PackagesList;