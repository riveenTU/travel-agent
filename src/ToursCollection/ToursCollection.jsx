import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBarComponent/NavigationBar";
import "./ToursCollection.css";

const CATEGORIES = [
  { label: "All",               value: ""                  },
  { label: "Cultural Triangle", value: "cultural-triangle" },
  { label: "Coastal & Beaches", value: "coast-beaches"     },
  { label: "Hill Country",      value: "hill-country"      },
  { label: "Wildlife & Nature", value: "wildlife-nature"   },
];

function ToursCollection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = searchParams.get("category") || "";
  const searchParam   = searchParams.get("search")   || "";

  const [tours,    setTours]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState(searchParam);

  // Fetch from backend whenever category changes
  useEffect(() => {
    async function fetchTours() {
      setLoading(true);
      setError(null);
      try {
        const url = categoryParam
          ? `http://localhost:4000/api/tours?category=${categoryParam}`
          : `http://localhost:4000/api/tours`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch tours");
        const data = await res.json();
        setTours(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, [categoryParam]);

  // Client-side search filter on top of category results
  const filtered = tours.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleCategoryClick(value) {
    const params = {};
    if (value)  params.category = value;
    if (search) params.search   = search;
    setSearchParams(params);
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearch(val);
    const params = {};
    if (categoryParam) params.category = categoryParam;
    if (val)           params.search   = val;
    setSearchParams(params);
  }

  function clearFilters() {
    setSearch("");
    setSearchParams({});
  }

  const activeLabel =
    CATEGORIES.find((c) => c.value === categoryParam)?.label || "All Packages";

  return (
    <div>
      <NavigationBar />

      <div className="tc-page">
        {/* Header */}
        <div className="tc-header">
          <h1 className="tc-title">Our Packages</h1>
          <p className="tc-subtitle">Explore Sri Lanka — find the journey that suits you</p>
        </div>

        {/* Search bar */}
        <div className="tc-search-row">
          <div className="tc-search-wrap">
            {/* <span className="tc-search-icon">&#128269;</span> */}
            <input
              type="text"
              className="tc-search-input"
              placeholder="Search packages..."
              value={search}
              onChange={handleSearchChange}
            />
            {(search || categoryParam) && (
              <button className="tc-clear-btn" onClick={clearFilters}>✕ Clear</button>
            )}
          </div>
        </div>

        {/* Category filter pills */}
        <div className="tc-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`tc-pill ${categoryParam === cat.value ? "tc-pill-active" : ""}`}
              onClick={() => handleCategoryClick(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="tc-count">
          {loading ? "Loading..." : `${filtered.length} package${filtered.length !== 1 ? "s" : ""} found`}
          {categoryParam && !loading && (
            <span className="tc-count-tag"> in <strong>{activeLabel}</strong></span>
          )}
        </p>

        {/* Error state */}
        {error && (
          <div className="tc-error">
            <p>Could not load packages. Make sure the server is running.</p>
            <p className="tc-error-detail">{error}</p>
          </div>
        )}

        {/* Tour cards grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="tc-empty">
                <p>No packages match your search.</p>
                <button className="tc-pill tc-pill-active" onClick={clearFilters}>Show all</button>
              </div>
            ) : (
              <div className="tc-grid">
                {filtered.map((tour) => (
                  <div
                    key={tour._id}
                    className="tc-card"
                    onClick={() => navigate(`/tour/${tour._id}`)}
                  >
                    <div className="tc-card-img-wrap">
                      <img src={tour.coverImage} alt={tour.name} className="tc-card-img" />
                      {tour.isPopular && <span className="tc-badge">Popular</span>}
                    </div>
                    <div className="tc-card-body">
                      <span className="tc-card-category">{tour.category}</span>
                      <h2 className="tc-card-title">{tour.name}</h2>
                      <p className="tc-card-duration">{tour.duration}</p>
                      <div className="tc-card-footer">
                        <span className="tc-card-price">
                          {tour.currency || "USD"} {tour.price?.toLocaleString()}
                        </span>
                        <button className="tc-book-btn">View Tour</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ToursCollection;