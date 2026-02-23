const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

router.use(protect, isLandlord);

// GET /api/landlord-payments -> Get all payments for the landlord
router.get('/', PaymentController.getAllPaymentsForLandlord);

module.exports = router;
