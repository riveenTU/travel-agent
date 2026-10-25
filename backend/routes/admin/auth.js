const express   = require('express');
const router    = express.Router();
const jwt       = require('jsonwebtoken');
const Admin     = require('../../models/Admin');
const logAction = require('../../utils/auditLogger');

function signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
}

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const admin = await Admin.findOne({ email, isActive: true });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = signToken(admin._id);
        await logAction(admin, 'login', 'Admin Panel');

        res.json({
            token,
            admin: {
                _id:   admin._id,
                name:  admin.name,
                email: admin.email,
                role:  admin.role,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/auth/seed
// ONE TIME USE — creates the first super admin then never call again
router.post('/seed', async (req, res) => {
    try {
        const existing = await Admin.findOne({ role: 'super_admin' });
        if (existing) {
            return res.status(400).json({ message: 'Super admin already exists.' });
        }

        const superAdmin = await Admin.create({
            name:     'Super Admin',
            email:    'super@ceylontours.com',
            password: 'super1234',
            role:     'super_admin',
        });

        res.status(201).json({
            message: 'Super admin created. Do not call this route again.',
            email:   superAdmin.email,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;