const express = require('express');
const router = express.Router();
const BillingController = require('../controllers/billing.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

router.use(protect, isLandlord);

// POST /api/billing/generate-from-reading/:readingId -> Generate bills
router.post('/generate-from-reading/:readingId', BillingController.generateBillFromReading);

module.exports = router;
