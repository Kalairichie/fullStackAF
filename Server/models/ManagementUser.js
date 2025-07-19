const mongoose = require('mongoose');

const managementUserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

module.exports = mongoose.model('ManagementUser', managementUserSchema);
