const express           = require('express');
const router            = express.Router();
const Admin             = require('../../models/Admin');
const auth              = require('../../middleware/auth');
const requireSuperAdmin = require('../../middleware/requireSuperAdmin');
const logAction         = require('../../utils/auditLogger');

router.use(auth, requireSuperAdmin);

// GET /api/admin/admins
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/admins
router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required.' });
        }

        const exists = await Admin.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'An admin with this email already exists.' });
        }

        const admin = await Admin.create({ name, email, password, role: 'admin' });
        await logAction(req.admin, 'created', admin.name, admin._id, 'New admin registered');

        res.status(201).json({
            _id:   admin._id,
            name:  admin.name,
            email: admin.email,
            role:  admin.role,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH /api/admin/admins/:id/deactivate
router.patch('/:id/deactivate', async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!admin) return res.status(404).json({ message: 'Admin not found.' });
        await logAction(req.admin, 'updated', admin.name, admin._id, 'Admin deactivated');
        res.json({ message: `${admin.name} has been deactivated.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/admins/:id
router.delete('/:id', async (req, res) => {
    try {
        if (req.params.id === req.admin._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own account.' });
        }
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found.' });
        await logAction(req.admin, 'deleted', admin.name, admin._id, 'Admin account deleted');
        res.json({ message: `${admin.name} has been deleted.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;