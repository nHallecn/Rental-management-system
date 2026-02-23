const pool = require('../config/db.config');

// Model to create a new minicité
const create = async (miniciteData) => {
  const { landlordId, name, location } = miniciteData;
  const [result] = await pool.execute(
    'INSERT INTO Minicite (landlordId, name, location) VALUES (?, ?, ?)',
    [landlordId, name, location]
  );
  return { id: result.insertId, ...miniciteData };
};

// Model to find all minicités for a specific landlord
const findByLandlordId = async (landlordId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM Minicite WHERE landlordId = ?',
    [landlordId]
  );
  return rows;
};

// Model to find a single minicité by its ID
const findById = async (miniciteId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM Minicite WHERE miniciteId = ?',
    [miniciteId]
  );
  return rows[0];
};

// Model to update a minicité
const updateById = async (miniciteId, miniciteData) => {
  const { name, location } = miniciteData;
  const [result] = await pool.execute(
    'UPDATE Minicite SET name = ?, location = ? WHERE miniciteId = ?',
    [name, location, miniciteId]
  );
  return result.affectedRows;
};

// Model to delete a minicité
const deleteById = async (miniciteId) => {
  const [result] = await pool.execute(
    'DELETE FROM Minicite WHERE miniciteId = ?',
    [miniciteId]
  );
  return result.affectedRows;
};


module.exports = {
  create,
  findByLandlordId,
  findById,
  updateById,
  deleteById,
};
