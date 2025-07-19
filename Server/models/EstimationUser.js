const mongoose = require('mongoose');

const estimationUserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

module.exports = mongoose.model('EstimationUser', estimationUserSchema);
