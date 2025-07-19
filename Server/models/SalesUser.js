const mongoose = require('mongoose');

const salesUserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

module.exports = mongoose.model('SalesUser', salesUserSchema);
