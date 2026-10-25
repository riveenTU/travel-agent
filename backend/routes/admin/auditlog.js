const express  = require('express');
const router   = express.Router();
const AuditLog = require('../../models/AuditLog');
const auth     = require('../../middleware/auth');

router.use(auth);

// GET /api/admin/audit-log
router.get('/', async (req, res) => {
    try {
        const { action, limit = 100 } = req.query;
        const filter = {};
        if (action && action !== 'all') filter.action = action;

        const logs = await AuditLog.find(filter)
            .sort({ createdAt: -1 })
            .limit(Number(limit));
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;