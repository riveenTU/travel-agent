const express = require('express');
const router  = express.Router();
const Tour    = require('../models/Tour');

const CATEGORY_MAP = {
    'cultural-triangle': 'Cultural Triangle',
    'coast-beaches':     'Coast Beaches',
    'hill-country':      'Hill Country',
    'wildlife-nature':   'Wildlife and Nature',  
};

// GET /api/tours
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = { status: 'published' }; // ← public only sees published

        if (category) {
            const mapped = CATEGORY_MAP[category.toLowerCase()];
            if (!mapped) {
                return res.status(400).json({
                    message: `Invalid category. Valid values: ${Object.keys(CATEGORY_MAP).join(', ')}`
                });
            }
            filter.category = mapped;
        }

        const tours = await Tour.find(filter).sort({ createdAt: -1 });
        res.json(tours);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/tours/popular
router.get('/popular', async (req, res) => {
    try {
        const tours = await Tour.find({ isPopular: true, status: 'published' })
            .sort({ rating: -1, reviewsCount: -1 })
            .limit(4);
        res.json(tours);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/tours/:id
router.get('/:id', async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) return res.status(404).json({ message: 'Tour not found.' });
        res.json(tour);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;