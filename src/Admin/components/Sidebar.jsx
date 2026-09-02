import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/packages", label: "Packages"  },
  { to: "/admin/audit-log", label: "Audit Log" },
  { to: "/admin/admins", label: "Admins", superOnly: true },
  { to: "/admin/profile", label: "Profile"   },
];

function Sidebar({ admin }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  }

  const isSuperAdmin = admin?.role === "super_admin";

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">✦</span>
        <span className="sidebar-brand-text">Ceylon Admin</span>
      </div>

      {/* Admin info */}
      <div className="sidebar-admin-info">
        <div className="sidebar-avatar">
          {admin?.name?.charAt(0).toUpperCase() || "A"}
        </div>
        <div>
          <p className="sidebar-admin-name">{admin?.name || "Admin"}</p>
          <p className="sidebar-admin-role">
            {isSuperAdmin ? "Super Admin" : "Admin"}
          </p>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Nav links */}
      <nav className="sidebar-nav">
        {NAV.filter(n => !n.superOnly || isSuperAdmin).map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " sidebar-link-active" : "")
            }
          >
            {/* <span className="sidebar-link-icon">{n.icon}</span> */}
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button className="sidebar-logout" onClick={handleLogout}>
        <span>⇠</span> Logout
      </button>
    </aside>
  );
}

export default Sidebar;