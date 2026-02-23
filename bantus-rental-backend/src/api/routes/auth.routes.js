const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');

/**
 * AUTH ROUTES
 * Base path: /api/auth
 */

// Register a landlord
// POST /api/auth/register/landlord
router.post('/register/landlord', AuthController.registerLandlord);

// Login (landlord / tenant / admin – depending on controller logic)
// POST /api/auth/login
router.post('/login', AuthController.login);

module.exports = router;
