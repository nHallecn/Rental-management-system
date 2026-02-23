const pool = require('../config/db.config');

// Model to create a new room
const create = async (roomData) => {
  const { miniciteId, apartmentId, annualRent, status } = roomData;
  const [result] = await pool.execute(
    'INSERT INTO Room (miniciteId, apartmentId, annualRent, status) VALUES (?, ?, ?, ?)',
    [miniciteId, apartmentId, annualRent, status || 'vacant']
  );
  return { id: result.insertId, ...roomData };
};

// Model to find all rooms within a specific minicité
const findByMiniciteId = async (miniciteId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM Room WHERE miniciteId = ?',
    [miniciteId]
  );
  return rows;
};

// Model to find a single room by its ID
const findById = async (roomId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM Room WHERE roomId = ?',
    [roomId]
  );
  return rows[0];
};

// Model to update a room's details
const updateById = async (roomId, roomData) => {
  const { annualRent, status } = roomData;
  const [result] = await pool.execute(
    'UPDATE Room SET annualRent = ?, status = ? WHERE roomId = ?',
    [annualRent, status, roomId]
  );
  return result.affectedRows;
};

// Model to delete a room
const deleteById = async (roomId) => {
  const [result] = await pool.execute(
    'DELETE FROM Room WHERE roomId = ?',
    [roomId]
  );
  return result.affectedRows;
};

module.exports = {
  create,
  findByMiniciteId,
  findById,
  updateById,
  deleteById,
};

