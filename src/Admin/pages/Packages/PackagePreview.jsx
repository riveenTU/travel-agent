import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../AdminApp.css";
import "./PackagePreview.css";

function PackagePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg,     setPkg]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token  = localStorage.getItem("adminToken");
        const res    = await fetch(`http://localhost:4000/api/admin/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPkg(data);
      } catch { setPkg(null); }
      finally   { setLoading(false); }
    }
    load();
  }, [id]);

  if (loading) return <div className="admin-page"><p>Loading…</p></div>;
  if (!pkg)    return <div className="admin-page"><p>Package not found.</p></div>;

  return (
    <div className="admin-page">
      {/* Admin bar */}
      <div className="pv-admin-bar">
        <button className="btn-ghost" onClick={() => navigate(-1)}>← Back</button>
        <span className="pv-admin-bar-label">Preview — this is how guests see this package</span>
        <Link to={`/admin/packages/edit/${id}`} className="btn-primary">Edit Package</Link>
      </div>

      {/* Hero */}
      <div className="pv-hero">
        {pkg.coverImage && (
          <img src={pkg.coverImage} alt={pkg.name} className="pv-hero-img" />
        )}
        <div className="pv-hero-overlay">
          <span className="pv-category">{pkg.category}</span>
          <h1 className="pv-title">{pkg.name}</h1>
          <div className="pv-meta">
            <span>⏱ {pkg.duration}</span>
            <span>👥 Max {pkg.maxGroupSize}</span>
            <span>🏔 {pkg.difficulty}</span>
            {pkg.rating > 0 && <span>★ {pkg.rating} ({pkg.reviewsCount} reviews)</span>}
          </div>
        </div>
      </div>

      <div className="pv-body">
        {/* Left */}
        <div className="pv-left">

          {/* Highlights */}
          {pkg.highlights?.length > 0 && (
            <div className="admin-card pv-section">
              <h2 className="pv-section-title">Highlights</h2>
              <ul className="pv-list">
                {pkg.highlights.map((h, i) => <li key={i}><span className="pv-tick">✓</span>{h}</li>)}
              </ul>
            </div>
          )}

          {/* Itinerary */}
          {pkg.itinerary?.length > 0 && (
            <div className="admin-card pv-section">
              <h2 className="pv-section-title">Itinerary</h2>
              {pkg.itinerary.map((day) => (
                <div key={day.day} className="pv-day">
                  <div className="pv-day-badge">Day {day.day}</div>
                  <div>
                    <p className="pv-day-city">{day.city}</p>
                    <p className="pv-day-desc">{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Includes / Not included */}
          <div className="admin-card pv-section pv-two-col">
            {pkg.includes?.length > 0 && (
              <div>
                <h2 className="pv-section-title">Includes</h2>
                <ul className="pv-list">
                  {pkg.includes.map((i, idx) => <li key={idx}><span className="pv-tick pv-tick-green">✓</span>{i}</li>)}
                </ul>
              </div>
            )}
            {pkg.notIncluded?.length > 0 && (
              <div>
                <h2 className="pv-section-title">Not Included</h2>
                <ul className="pv-list">
                  {pkg.notIncluded.map((i, idx) => <li key={idx}><span className="pv-tick pv-tick-red">✕</span>{i}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="pv-right">
          <div className="admin-card pv-booking-card">
            <p className="pv-price">
              {pkg.currency} {pkg.price?.toLocaleString()}
              <span className="pv-price-sub"> / person</span>
            </p>
            <div className="pv-booking-meta">
              {pkg.availableMonths?.length > 0 && (
                <p className="pv-meta-row"><strong>Available:</strong> {pkg.availableMonths.join(", ")}</p>
              )}
              {pkg.suitableFor && (
                <p className="pv-meta-row"><strong>Suitable for:</strong> {pkg.suitableFor}</p>
              )}
            </div>
            <button className="btn-primary pv-book-btn" disabled>Book Now</button>
            <p className="pv-book-note">(Booking disabled in preview)</p>
          </div>

          {pkg.whatToBring?.length > 0 && (
            <div className="admin-card pv-section">
              <h2 className="pv-section-title">What to Bring</h2>
              <ul className="pv-list">
                {pkg.whatToBring.map((w, i) => <li key={i}><span className="pv-tick">→</span>{w}</li>)}
              </ul>
            </div>
          )}

          {/* Status badge */}
          <div className="admin-card pv-section">
            <h2 className="pv-section-title">Admin Status</h2>
            <span className={`badge ${pkg.status === "published" ? "badge-published" : "badge-draft"}`}>
              {pkg.status}
            </span>
            {pkg.isPopular && <span className="badge badge-popular" style={{ marginLeft: 8 }}>Popular</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackagePreview;