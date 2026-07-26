import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../AdminApp.css";
import "./PackageForm.css";

const CATEGORIES  = ["Cultural Triangle","Coast Beaches","Hill Country","Wildlife Nature"];
const DIFFICULTIES = ["Easy","Moderate","Challenging"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const EMPTY_FORM = {
  name: "", slug: "", category: "Cultural Triangle",
  duration: "", price: "", currency: "USD",
  maxGroupSize: "", difficulty: "Moderate",
  suitableFor: "", highlights: "", includes: "",
  notIncluded: "", whatToBring: "", availableMonths: [],
  status: "draft", isPopular: false, coverImage: "",
};

function PackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit   = Boolean(id);
  const token    = localStorage.getItem("adminToken");
  const headers  = { Authorization: `Bearer ${token}` };

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  // Load existing data if editing
  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      try {
        const res  = await fetch(`http://localhost:4000/api/admin/packages/${id}`, { headers });
        const data = await res.json();
        setForm({
          ...EMPTY_FORM,
          ...data,
          highlights:   (data.highlights   || []).join(", "),
          includes:     (data.includes     || []).join(", "),
          notIncluded:  (data.notIncluded  || []).join(", "),
          whatToBring:  (data.whatToBring  || []).join(", "),
          availableMonths: data.availableMonths || [],
        });
        setPreview(data.coverImage || "");
      } catch { setError("Could not load package."); }
    }
    load();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    // Auto-generate slug from name
    if (name === "name") {
      setForm(f => ({ ...f, name: value, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }));
    }
  }

  function handleMonthToggle(month) {
    setForm(f => ({
      ...f,
      availableMonths: f.availableMonths.includes(month)
        ? f.availableMonths.filter(m => m !== month)
        : [...f.availableMonths, month],
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function csvToArray(str) {
    return str.split(",").map(s => s.trim()).filter(Boolean);
  }

  async function handleSubmit(status) {
    setSaving(true); setError(""); setSuccess("");
    try {
      let coverImagePath = form.coverImage;

      // 1. Upload image if a new file was selected
      if (imgFile) {
        const fd = new FormData();
        fd.append("image", imgFile);
        // POST /api/admin/upload
        const upRes  = await fetch("http://localhost:4000/api/admin/upload", {
          method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd,
        });
        const upData = await upRes.json();
        coverImagePath = upData.path; // e.g. /images/ella.jpg
      }

      const payload = {
        ...form,
        status,
        price:        Number(form.price),
        maxGroupSize: Number(form.maxGroupSize),
        highlights:   csvToArray(form.highlights),
        includes:     csvToArray(form.includes),
        notIncluded:  csvToArray(form.notIncluded),
        whatToBring:  csvToArray(form.whatToBring),
        coverImage:   coverImagePath,
      };

      const url    = isEdit
        ? `http://localhost:4000/api/admin/packages/${id}`
        : "http://localhost:4000/api/admin/packages";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method, headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setSuccess(status === "published" ? "Package published!" : "Draft saved.");
      setTimeout(() => navigate("/admin/packages"), 1000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{isEdit ? "Edit Package" : "New Package"}</h1>
          <p className="admin-page-subtitle">
            {isEdit ? "Update the package details below." : "Fill in the details to create a new tour package."}
          </p>
        </div>
        <button className="btn-ghost" onClick={() => navigate("/admin/packages")}>← Back</button>
      </div>

      {error   && <div className="pf-alert pf-alert-error">{error}</div>}
      {success && <div className="pf-alert pf-alert-success">{success}</div>}

      <div className="pf-layout">
        {/* Left: main fields */}
        <div className="pf-main">

          {/* Basic info */}
          <div className="admin-card pf-section">
            <h2 className="pf-section-title">Basic Info</h2>
            <div className="pf-grid-2">
              <div className="pf-field">
                <label className="pf-label">Package Name *</label>
                <input className="admin-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ella Adventure" />
              </div>
              <div className="pf-field">
                <label className="pf-label">Slug</label>
                <input className="admin-input pf-slug" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated" />
              </div>
              <div className="pf-field">
                <label className="pf-label">Category *</label>
                <select className="admin-input" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="pf-field">
                <label className="pf-label">Duration</label>
                <input className="admin-input" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 nights / 4 days" />
              </div>
              <div className="pf-field">
                <label className="pf-label">Price (USD)</label>
                <input className="admin-input" name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 450" />
              </div>
              <div className="pf-field">
                <label className="pf-label">Max Group Size</label>
                <input className="admin-input" name="maxGroupSize" type="number" value={form.maxGroupSize} onChange={handleChange} placeholder="e.g. 12" />
              </div>
              <div className="pf-field">
                <label className="pf-label">Difficulty</label>
                <select className="admin-input" name="difficulty" value={form.difficulty} onChange={handleChange}>
                  {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="pf-field">
                <label className="pf-label">Suitable For</label>
                <input className="admin-input" name="suitableFor" value={form.suitableFor} onChange={handleChange} placeholder="e.g. All ages" />
              </div>
            </div>
          </div>

          {/* Details — comma-separated fields */}
          <div className="admin-card pf-section">
            <h2 className="pf-section-title">Details</h2>
            <p className="pf-hint">Separate items with commas.</p>
            <div className="pf-grid-1">
              <div className="pf-field">
                <label className="pf-label">Highlights</label>
                <input className="admin-input" name="highlights" value={form.highlights} onChange={handleChange} placeholder="Surfing, Lagoon safari, Snorkeling" />
              </div>
              <div className="pf-field">
                <label className="pf-label">Includes</label>
                <input className="admin-input" name="includes" value={form.includes} onChange={handleChange} placeholder="Hotel, Breakfast, Guide" />
              </div>
              <div className="pf-field">
                <label className="pf-label">Not Included</label>
                <input className="admin-input" name="notIncluded" value={form.notIncluded} onChange={handleChange} placeholder="Flights, Visa, Travel insurance" />
              </div>
              <div className="pf-field">
                <label className="pf-label">What to Bring</label>
                <input className="admin-input" name="whatToBring" value={form.whatToBring} onChange={handleChange} placeholder="Sunscreen, Swimwear, Camera" />
              </div>
            </div>
          </div>

          {/* Available months */}
          <div className="admin-card pf-section">
            <h2 className="pf-section-title">Available Months</h2>
            <div className="pf-months">
              {MONTHS.map(m => (
                <button
                  key={m}
                  type="button"
                  className={`pf-month-btn ${form.availableMonths.includes(m) ? "pf-month-active" : ""}`}
                  onClick={() => handleMonthToggle(m)}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: sidebar — image + status */}
        <div className="pf-sidebar">

          {/* Cover image */}
          <div className="admin-card pf-section">
            <h2 className="pf-section-title">Cover Image</h2>
            {preview && (
              <img src={preview} alt="Preview" className="pf-img-preview" />
            )}
            <label className="pf-upload-label">
              <input type="file" accept="image/*" onChange={handleImageChange} className="pf-upload-input" />
              {imgFile ? "Change image" : preview ? "Replace image" : "Upload image"}
            </label>
            <p className="pf-hint">Or paste a URL:</p>
            <input
              className="admin-input"
              name="coverImage"
              value={imgFile ? "(file selected)" : form.coverImage}
              onChange={handleChange}
              placeholder="https://..."
              disabled={Boolean(imgFile)}
            />
          </div>

          {/* Status & flags */}
          <div className="admin-card pf-section">
            <h2 className="pf-section-title">Status</h2>
            <div className="pf-status-row">
              <span className={`badge ${form.status === "published" ? "badge-published" : "badge-draft"}`}>
                {form.status}
              </span>
            </div>
            <label className="pf-checkbox-row">
              <input type="checkbox" name="isPopular" checked={form.isPopular} onChange={handleChange} />
              <span>Mark as Popular</span>
            </label>
          </div>

          {/* Save actions */}
          <div className="admin-card pf-section pf-actions">
            <button className="btn-ghost pf-action-btn" onClick={() => handleSubmit("draft")} disabled={saving}>
              Save as Draft
            </button>
            <button className="btn-primary pf-action-btn" onClick={() => handleSubmit("published")} disabled={saving}>
              {saving ? "Saving…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageForm;