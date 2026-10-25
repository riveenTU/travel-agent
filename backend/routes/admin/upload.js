const express = require('express');
const router  = express.Router();
const auth    = require('../../middleware/auth');
const upload  = require('../../middleware/upload');

router.use(auth);

// POST /api/admin/upload
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        const publicPath = `http://localhost:4000/images/${req.file.filename}`;
        res.json({ path: publicPath });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
