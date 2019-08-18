const express = require('express');
const router = express.Router();
const controller = require('../controllers/import.controller');

router.get('/all', controller.all);
router.get('/allByUser', controller.allByUser);
router.get('/last', controller.last);
router.get('/today', controller.today);

module.exports = router;