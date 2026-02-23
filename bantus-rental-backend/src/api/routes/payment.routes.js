const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

// All routes in this file are for landlords only
router.use(protect, isLandlord);

// POST /api/sessions/:sessionId/payments -> Record a new rent payment for a session
router.post('/:sessionId/payments', PaymentController.recordRentPayment);

// GET /api/sessions/:sessionId/payments -> Get all payments for a session
router.get('/:sessionId/payments', PaymentController.getPaymentsForSession);

router.get('/', PaymentController.getAllPaymentsForLandlord);

module.exports = router;
