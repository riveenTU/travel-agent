const express = require('express');
const router  = express.Router();
const Tour    = require('../../models/Tour');
const auth    = require('../../middleware/auth');

router.use(auth);

// GET /api/admin/dashboard/stats
router.get('/stats', async (req, res) => {
    try {
        const [total, published, draft, popular, byCategory] = await Promise.all([
            Tour.countDocuments(),
            Tour.countDocuments({ status: 'published' }),
            Tour.countDocuments({ status: 'draft' }),
            Tour.countDocuments({ isPopular: true }),
            Tour.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ])
        ]);

        const byCategoryMap = {};
        byCategory.forEach(item => { byCategoryMap[item._id] = item.count; });

        res.json({ total, published, draft, popular, byCategory: byCategoryMap });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/dashboard/recent
router.get('/recent', async (req, res) => {
    try {
        const recent = await Tour.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name category status isPopular createdAt');
        res.json(recent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;