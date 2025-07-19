const express = require('express');
const router = express.Router();
// const { loginUser } = require('../controllers/authController');
const { loginSalesUser } = require('../controllers/authController');
const { loginEstimationUser } = require('../controllers/authController');
const { loginSalesOrderUser } = require('../controllers/authController');
const { loginManagementUser } = require('../controllers/authController');

router.post('/login/sales', loginSalesUser);
router.post('/login/estimation', loginEstimationUser);
router.post('/login/salesOrder', loginSalesOrderUser);
router.post('/login/management', loginManagementUser);

module.exports = router;
