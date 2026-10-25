const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tourId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    name:      String,
    email:     String,
    phone:     String,
    startDate: Date,
    endDate:   Date,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);