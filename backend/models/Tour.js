const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    day: Number,
    city: String,
    description: String,
    image2: String
});

const tourSchema = new mongoose.Schema({
    tourname: String,
    image1: String,
    highlights: [String],
    whatToBring: [String],
    suitableFor: String,
    includes: [String],
    activities: [ActivitySchema]
});

module.exports = mongoose.model('Tour', tourSchema);