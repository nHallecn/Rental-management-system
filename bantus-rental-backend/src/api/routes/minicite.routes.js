const express = require('express');
const router = express.Router();
const MiniciteController = require('../controllers/minicite.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

// All routes in this file are protected and require a landlord role
router.use(protect, isLandlord);

// POST /api/minicites -> Create a new minicité
router.post('/', MiniciteController.createMinicite);

// GET /api/minicites -> Get all minicités for the logged-in landlord
router.get('/', MiniciteController.getMyMinicites);

// PUT /api/minicites/:miniciteId -> Update a specific minicité
router.put('/:miniciteId', MiniciteController.updateMinicite);

// DELETE /api/minicites/:miniciteId -> Delete a specific minicité
router.delete('/:miniciteId', MiniciteController.deleteMinicite);

module.exports = router;
