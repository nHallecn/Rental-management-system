const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenant.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

router.use(protect, isLandlord);

// GET /api/landlord-tenants -> Get all tenants for the logged-in landlord
router.get('/', TenantController.getAllTenantsForLandlord);

module.exports = router;
