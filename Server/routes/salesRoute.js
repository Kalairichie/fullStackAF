const express = require('express');
const router = express.Router();

const { createSale, getAllSales, updateSale, updatePoStatus } = require('../controllers/salesController');

router.post('/', createSale);

router.get('/', getAllSales);

router.put('/po-status/:id', updatePoStatus);

router.put('/:id', updateSale);

module.exports = router;