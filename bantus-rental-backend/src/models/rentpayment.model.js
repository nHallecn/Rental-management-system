const pool = require('../config/db.config');

// Model to create a new rent payment record
const create = async (paymentData) => {
  const { sessionId, paymentDate, amount, note } = paymentData;
  const [result] = await pool.execute(
    'INSERT INTO RentPayment (sessionId, paymentDate, amount, note) VALUES (?, ?, ?, ?)',
    [sessionId, paymentDate, amount, note]
  );
  return { id: result.insertId, ...paymentData };
};

// Model to get all payments for a specific session
const findBySessionId = async (sessionId) => {
    const [rows] = await pool.execute(
      'SELECT * FROM RentPayment WHERE sessionId = ? ORDER BY paymentDate DESC',
      [sessionId]
    );
    return rows;
};

const findByLandlordId = async (landlordId) => {
    const [rows] = await pool.execute(`
        SELECT p.*, t.fullName as tenantName, r.roomId, m.name as miniciteName
        FROM RentPayment p
        JOIN TenantSession ts ON p.sessionId = ts.sessionId
        JOIN Tenant t ON ts.tenantId = t.tenantId
        JOIN Room r ON ts.roomId = r.roomId
        JOIN Minicite m ON r.miniciteId = m.miniciteId
        WHERE m.landlordId = ?
        ORDER BY p.paymentDate DESC
    `, [landlordId]);
    return rows;
};

module.exports = {
  create,
  findBySessionId,
  findByLandlordId, // <-- Add this
};
