const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: String,
    image: String,
    name: String,
    index: String
});

module.exports = mongoose.model('Comments', commentSchema);