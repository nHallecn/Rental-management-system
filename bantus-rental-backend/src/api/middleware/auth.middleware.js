const jwt = require('jsonwebtoken');

// Middleware to verify JWT and protect routes
const protect = (req, res, next) => {
  let token;

  // Check if the token is in the Authorization header and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user payload to the request object
      // We can now access req.user in any protected route
      req.user = decoded;

      // Proceed to the next middleware or the route's controller
      next();
    } catch (error) {
      // Handle different JWT errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired.' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  // If no token is found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

// Middleware to check for a specific role (e.g., 'landlord')
// This middleware should be used *after* the protect middleware
const isLandlord = (req, res, next) => {
  if (req.user && req.user.role === 'landlord') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Landlord role required.' });
  }
};

const isTenant = (req, res, next) => {
  if (req.user && req.user.role === 'tenant') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Tenant role required.' });
  }
};

module.exports = { protect, isLandlord, isTenant };
