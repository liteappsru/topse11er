const express = require('express');
const router = express.Router();

const controller = require('../controllers/report.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/sales', controller.sales);
router.get('/profit', controller.profit);
router.get('/margin', controller.margin);
router.get('/orders', controller.orders);
router.get('/common', controller.common);

module.exports = router;