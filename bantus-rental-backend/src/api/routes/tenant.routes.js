const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenant.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

// All routes in this file are for landlords only
router.use(protect, isLandlord);

// POST /api/tenants/register -> Register a new tenant user account
router.post('/register', TenantController.registerTenant);

// POST /api/rooms/:roomId/sessions -> Create a new tenant session in a room
router.post('/rooms/:roomId/sessions', TenantController.createTenantSession);

module.exports = router;
