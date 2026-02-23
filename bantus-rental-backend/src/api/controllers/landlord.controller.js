const pool = require('../../config/db.config');

// Get the profile of the currently logged-in landlord
const getMyProfile = async (req, res) => {
  try {
    // The user's ID is available from the 'protect' middleware via req.user
    const userId = req.user.userId;

    const [rows] = await pool.execute(
      'SELECT l.landlordId, l.fullName, l.phone, u.username, u.createdAt FROM Landlord l JOIN User u ON l.userId = u.userId WHERE l.userId = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Landlord profile not found.' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully.',
      data: rows[0]
    });

  } catch (error) {
    res.status(500).json({ message: error.message || 'An error occurred while fetching the profile.' });
  }
};

module.exports = {
  getMyProfile,
};
