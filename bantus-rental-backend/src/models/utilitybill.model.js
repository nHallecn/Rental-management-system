const pool = require('../config/db.config');

// Model to create a new utility bill
const create = async (billData) => {
  const { sessionId, readingId, type, unitsConsumed, amount, deadline } = billData;
  const [result] = await pool.execute(
    'INSERT INTO UtilityBill (sessionId, readingId, type, unitsConsumed, amount, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [sessionId, readingId, type, unitsConsumed, amount, deadline, 'unpaid']
  );
  return { id: result.insertId, ...billData };
};

// ... (keep the 'create' function)

// Model for a tenant to find all their utility bills
const findByTenantId = async (tenantId) => {
    const [rows] = await pool.execute(`
        SELECT b.*, r.month 
        FROM UtilityBill b
        JOIN TenantSession ts ON b.sessionId = ts.sessionId
        JOIN MeterReading r ON b.readingId = r.readingId
        WHERE ts.tenantId = ?
        ORDER BY r.month DESC, b.type
    `, [tenantId]);
    return rows;
};

module.exports = {
  create,
  findByTenantId, // <-- Add this
};

