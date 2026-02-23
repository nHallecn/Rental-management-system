const express = require('express');
const router = express.Router();
const LandlordController = require('../controllers/landlord.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

// Define the protected profile route
// GET /api/landlord/profile
// This route is now protected. A user must be logged in (protect) and have the 'landlord' role (isLandlord).
router.get('/profile', protect, isLandlord, LandlordController.getMyProfile);

module.exports = router;
