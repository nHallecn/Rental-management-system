const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for nested routes
const PaymentController = require('../controllers/payment.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

router.use(protect, isLandlord);

// POST /api/sessions/:sessionId/payments -> Record a new rent payment
// GET  /api/sessions/:sessionId/payments -> Get all payments for a session
router.route('/')
    .post(PaymentController.recordRentPayment)
    .get(PaymentController.getPaymentsForSession);

module.exports = router;
