const express   = require('express');
const router    = express.Router();
const Tour      = require('../../models/Tour');
const auth      = require('../../middleware/auth');
const logAction = require('../../utils/auditLogger');

router.use(auth);

// GET /api/admin/packages
router.get('/', async (req, res) => {
    try {
        const { category, status, search } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (status)   filter.status   = status;
        if (search)   filter.name     = { $regex: search, $options: 'i' };

        const tours = await Tour.find(filter).sort({ createdAt: -1 });
        res.json(tours);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/packages/:id
router.get('/:id', async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) return res.status(404).json({ message: 'Package not found.' });
        res.json(tour);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/packages
router.post('/', async (req, res) => {
    try {
        const tour = await Tour.create(req.body);
        await logAction(req.admin, 'created', tour.name, tour._id);
        if (tour.status === 'published') {
            await logAction(req.admin, 'published', tour.name, tour._id);
        }
        res.status(201).json(tour);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/admin/packages/:id
router.put('/:id', async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!tour) return res.status(404).json({ message: 'Package not found.' });
        await logAction(req.admin, 'updated', tour.name, tour._id);
        res.json(tour);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/admin/packages/:id
router.delete('/:id', async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour) return res.status(404).json({ message: 'Package not found.' });
        await logAction(req.admin, 'deleted', tour.name, tour._id);
        res.json({ message: 'Package deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/admin/packages/:id/status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({ message: 'Status must be draft or published.' });
        }
        const tour = await Tour.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!tour) return res.status(404).json({ message: 'Package not found.' });
        const action = status === 'published' ? 'published' : 'drafted';
        await logAction(req.admin, action, tour.name, tour._id);
        res.json(tour);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/admin/packages/:id/popular
router.patch('/:id/popular', async (req, res) => {
    try {
        const { isPopular } = req.body;
        const tour = await Tour.findByIdAndUpdate(
            req.params.id,
            { isPopular },
            { new: true }
        );
        if (!tour) return res.status(404).json({ message: 'Package not found.' });
        await logAction(req.admin, 'updated', tour.name, tour._id, `isPopular set to ${isPopular}`);
        res.json(tour);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/packages/:id/duplicate
router.post('/:id/duplicate', async (req, res) => {
    try {
        const original = await Tour.findById(req.params.id).lean();
        if (!original) return res.status(404).json({ message: 'Package not found.' });

        const { _id, createdAt, updatedAt, __v, ...rest } = original;
        const copy = await Tour.create({
            ...rest,
            name:   `${rest.name} (Copy)`,
            slug:   `${rest.slug}-copy-${Date.now()}`,
            status: 'draft',
        });

        await logAction(req.admin, 'duplicated', copy.name, copy._id, `Duplicated from: ${original.name}`);
        res.status(201).json(copy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;