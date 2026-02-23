const UserModel = require('../../models/user.model');
const jwt = require('jsonwebtoken'); // <-- Import jwt
const bcrypt = require('bcryptjs'); // <-- Import bcrypt

const registerLandlord = async (req, res) => {
  const { fullName, phone, username, password } = req.body;

  // Basic validation
  if (!fullName || !username || !password) {
    return res.status(400).json({ message: 'Full name, username, and password are required.' });
  }

  try {
    const newLandlord = await UserModel.createLandlord({ fullName, phone, username, password });
    res.status(201).json({
      message: 'Landlord registered successfully!',
      data: newLandlord
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'An error occurred during registration.' });
  }
};

module.exports = {
  registerLandlord,
};

// Controller for user login
const login = async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // 1. Find the user by username
    const user = await UserModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Use a generic message for security
    }

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Same generic message
    }

    // 3. If credentials are correct, create a JWT
    const payload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
    };

    // Sign the token with the secret key from your .env file
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 4. Send the token back to the client
    res.status(200).json({
      message: 'Logged in successfully!',
      token: token,
      user: { // Send back some non-sensitive user info
        userId: user.userId,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message || 'An error occurred during login.' });
  }
};

// Add login to the exports
module.exports = {
  registerLandlord,
  login, // <-- Add this
};
