const express = require('express');
const router = express.Router();

const controlle = require('../controllers/import.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/all', controlle.all);
router.get('/allByUser', controlle.allByUser);
router.get('/last', controlle.last);
router.get('/today', controlle.today);

module.exports = router;