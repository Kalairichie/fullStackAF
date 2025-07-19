const mongoose = require('mongoose');

const salesOrderUserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

module.exports = mongoose.model('SalesOrderUser', salesOrderUserSchema);