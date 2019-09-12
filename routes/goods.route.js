const express = require('express');
const router = express.Router();

const controller = require('../controllers/goods.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/update', controller.update);

module.exports = router;