const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve uploaded images statically from backend/public/images/
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ── Public routes ─────────────────────────────────────────────────────────────
const tourRoutes = require('./routes/tours');
app.use('/api/tours', tourRoutes);

// ── Admin routes ──────────────────────────────────────────────────────────────
const adminAuthRoutes      = require('./routes/admin/auth');
const adminPackageRoutes   = require('./routes/admin/packages');
const adminDashboardRoutes = require('./routes/admin/dashboard');
const adminAuditLogRoutes  = require('./routes/admin/auditLog');
const adminAdminsRoutes    = require('./routes/admin/admins');
const adminProfileRoutes   = require('./routes/admin/profile');
const adminUploadRoutes    = require('./routes/admin/upload');

app.use('/api/admin/auth',      adminAuthRoutes);
app.use('/api/admin/packages',  adminPackageRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/audit-log', adminAuditLogRoutes);
app.use('/api/admin/admins',    adminAdminsRoutes);
app.use('/api/admin/profile',   adminProfileRoutes);
app.use('/api/admin/upload',    adminUploadRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('Ceylon Tours API is running.'));

module.exports = app;