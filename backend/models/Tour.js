const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
    day: Number,
    city: String,
    description: String,
    image: String
});

const tourSchema = new mongoose.Schema({
    slug: String,
    name: String,
    duration: String,
    coverImage: String,
    link: String,
    gallery: [String],
    highlights: [String],
    whatToBring: [String],
    suitableFor: String,
    includes: [String],
    itinerary: [ItinerarySchema],
    isPopular: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tour', tourSchema);