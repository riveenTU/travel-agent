const express   = require('express');
const router    = express.Router();
const Admin     = require('../../models/Admin');
const auth      = require('../../middleware/auth');
const logAction = require('../../utils/auditLogger');

router.use(auth);

// PATCH /api/admin/profile
router.patch('/', async (req, res) => {
    try {
        const { name, email } = req.body;
        const admin = await Admin.findByIdAndUpdate(
            req.admin._id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        await logAction(req.admin, 'updated', admin.name, admin._id, 'Profile updated');
        res.json(admin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH /api/admin/profile/password
router.patch('/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both fields are required.' });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters.' });
        }

        const admin = await Admin.findById(req.admin._id);
        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        admin.password = newPassword;
        await admin.save();

        await logAction(req.admin, 'updated', admin.name, admin._id, 'Password changed');
        res.json({ message: 'Password changed successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;