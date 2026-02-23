const pool = require('../config/db.config');

// Model to create a new tenant session
const create = async (sessionData) => {
  const { tenantId, roomId, entryDate, contractImage } = sessionData;
  
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Insert the new session
    const [result] = await connection.execute(
      'INSERT INTO TenantSession (tenantId, roomId, entryDate, contractImage, status) VALUES (?, ?, ?, ?, ?)',
      [tenantId, roomId, entryDate, contractImage, 'active']
    );

    // 2. Update the room's status to 'occupied'
    await connection.execute(
      'UPDATE Room SET status = ? WHERE roomId = ?',
      ['occupied', roomId]
    );

    await connection.commit();
    return { id: result.insertId, ...sessionData };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// ... (keep the existing 'create' function)

// Model to find the currently active session for a tenant
const findActiveByTenantId = async (tenantId) => {
  const [rows] = await pool.execute(
    `SELECT 
        ts.sessionId, ts.entryDate, ts.contractImage,
        r.roomId, r.annualRent,
        m.name as miniciteName, m.location as miniciteLocation,
        l.fullName as landlordName, l.phone as landlordPhone
     FROM TenantSession ts
     JOIN Room r ON ts.roomId = r.roomId
     JOIN Minicite m ON r.miniciteId = m.miniciteId
     JOIN Landlord l ON m.landlordId = l.landlordId
     WHERE ts.tenantId = ? AND ts.status = 'active'`,
    [tenantId]
  );
  return rows[0]; // A tenant should only have one active session
};

module.exports = {
  create,
  findActiveByTenantId, // <-- Add this
};

