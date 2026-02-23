const pool = require('../config/db.config');

// Model to create a new meter reading
const create = async (readingData) => {
  const { roomId, month, waterValue, electricityValue } = readingData;
  
  // Check for an existing reading for the same room and month to prevent duplicates
  const [existing] = await pool.execute(
    'SELECT readingId FROM MeterReading WHERE roomId = ? AND DATE_FORMAT(month, "%Y-%m") = ?',
    [roomId, month.substring(0, 7)] // Compare year and month
  );

  if (existing.length > 0) {
    throw new Error(`A meter reading for this room in ${month.substring(0, 7)} already exists.`);
  }

  const [result] = await pool.execute(
    'INSERT INTO MeterReading (roomId, month, waterValue, electricityValue) VALUES (?, ?, ?, ?)',
    [roomId, month, waterValue, electricityValue]
  );
  return { id: result.insertId, ...readingData };
};

// Model to get all readings for a specific room
const findByRoomId = async (roomId) => {
    const [rows] = await pool.execute(
      'SELECT * FROM MeterReading WHERE roomId = ? ORDER BY month DESC',
      [roomId]
    );
    return rows;
};

module.exports = {
  create,
  findByRoomId,
};
