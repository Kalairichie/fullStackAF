const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    date: String,
    sNo: Number,
    estDate: String,
    companyName: String,
    productName: String,
    addressLine1: String,
    addressLine2: String,
    contactPerson: String,
    phone: String,
    email: String,
    quotationNo: String,
    amount: Number,
    scope: String,
    source: String,
    note: String,
    estNote: String,
    SONote: String,
    followUp: String,
    purchaseOrder: String,
    status: String,
    soDate: String,
    attachments: [String],
    estAttachments: [String],
    poStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
})

module.exports = mongoose.model('Sale', salesSchema);