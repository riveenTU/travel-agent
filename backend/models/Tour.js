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
    category: {
        type: String,
        enum: ['Cultural Triangle', 'Coast Beaches', 'Hill Country', 'Wildlife Nature'],
        required: true
    },
    duration: String,
    price: Number,
    currency: { type: String, default: 'USD' },
    maxGroupSize: Number,
    difficulty: String,
    coverImage: String,
    gallery: [String],
    location: {
        startCity: String,
        endCity: String
    },
    highlights: [String],
    whatToBring: [String],
    suitableFor: String,
    includes: [String],
    notIncluded: [String],
    itinerary: [ItinerarySchema],
    availableMonths: [String],
    isPopular: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    link: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tour', tourSchema);