const express = require('express');
const router = express.Router();
const BillingController = require('../controllers/billing.controller');
const { protect, isTenant } = require('../middleware/auth.middleware');

router.use(protect, isTenant);

// GET /api/my-billing/bills -> Get all bills for the logged-in tenant
router.get('/bills', BillingController.getMyBills);

module.exports = router;
