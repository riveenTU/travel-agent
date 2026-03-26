const { create } = require('@mui/material/styles/createTransitions');
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tourId: String,
    name: String,
    email: String,
    phone: String,
    startDate: Date,
    endDate: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);