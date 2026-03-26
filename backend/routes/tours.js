const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Get all tours
 *     responses:
 *       200:
 *         description: List of tours
 */
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Create a new tour
 */

router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;