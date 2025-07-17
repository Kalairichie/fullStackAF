const Sale = require('../models/Sales');

const createSale = async (req, res) => {
    try {
        const latestSale = await Sale.findOne().sort({ sNo: -1 });
        const nextSNo = latestSale ? latestSale.sNo + 1 : 5001;

        const attachments = req.body.attachments || [];
        const estAttachments = req.body.estAttachments || [];

        const newSale = new Sale({
            ...req.body,
            sNo: nextSNo,
            attachments,
            estAttachments,
            soDate: req.body.soDate || '',
            poStatus: req.body.poStatus || 'pending',
            purchaseOrder: req.body.purchaseOrder || '',
        });

        await newSale.save();
        res.status(201).json(newSale);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create sale' });
    }
};

const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find().sort({ sNo: 1 });
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales' });
    }
};

const updateSale = async (req, res) => {
    try {
        const saleId = req.params.id;
        const updatedData = req.body;

        console.log('🟡 soDate received from frontend:', req.body.soDate);

        for (const key in req.body) {
            if (key === 'sNo') continue;
            if (key === 'amount') {
                updatedData[key] = Number(req.body[key]);
            } else {
                updatedData[key] = req.body[key];
            }
        }

        if (req.body.soDate) updatedData.soDate = req.body.soDate;
        if (req.body.poStatus) updatedData.poStatus = req.body.poStatus;
        if (req.body.purchaseOrder) updatedData.purchaseOrder = req.body.purchaseOrder;

        if (typeof req.body.soDate === 'string' && req.body.soDate.trim() !== '') {
            updatedData.soDate = req.body.soDate.trim();
        }
        
        updatedData.attachments = req.body.attachments || [];
        updatedData.estAttachments = req.body.estAttachments || [];

        const updatedSale = await Sale.findByIdAndUpdate(saleId, updatedData, {
            new: true,
            runValidators: true
        });

        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json(updatedSale);
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(500).json({ message: 'Error updating sale' });
    }
};

const updatePoStatus = async (req, res) => {
    console.log('Incoming body:', req.body);
    try {
        const { id } = req.params;
        const { poStatus } = req.body;

        if (!poStatus) {
            return res.status(400).json({ message: 'Missing poStatus' });
        }

        const updatedSale = await Sale.findByIdAndUpdate(
            id,
            { poStatus },
            { new: true }
        );

        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.json(updatedSale);
    } catch (error) {
        console.error('Error updating PO status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { createSale, getAllSales, updateSale, updatePoStatus, };
