const pool = require('../config/db.config');

// Model to find a landlord by their user ID
const findByUserId = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM Landlord WHERE userId = ?',
    [userId]
  );
  return rows[0];
};

module.exports = {
  findByUserId,
};
