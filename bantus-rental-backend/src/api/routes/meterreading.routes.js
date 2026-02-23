const express = require('express');
const router = express.Router();
const MeterReadingController = require('../controllers/meterreading.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

// All routes in this file are for landlords only
router.use(protect, isLandlord);

// POST /api/rooms/:roomId/readings -> Submit a new meter reading for a room
router.post('/:roomId/readings', MeterReadingController.submitReading);

// GET /api/rooms/:roomId/readings -> Get all readings for a room
router.get('/:roomId/readings', MeterReadingController.getReadingsForRoom);

module.exports = router;
