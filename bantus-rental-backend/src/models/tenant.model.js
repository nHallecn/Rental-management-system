const pool = require('../config/db.config');

// Model to find a tenant by their user ID
const findByUserId = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM Tenant WHERE userId = ?',
    [userId]
  );
  return rows[0];
};

// ... (keep the 'findByUserId' function)

// Model to find all tenants (active and former) for a landlord
const findByLandlordId = async (landlordId) => {
    const [rows] = await pool.execute(`
        SELECT 
            t.tenantId,
            t.fullName,
            u.username,
            ts.status,
            ts.entryDate,
            ts.exitDate,
            r.roomId,
            m.name as miniciteName
        FROM Tenant t
        JOIN User u ON t.userId = u.userId
        JOIN TenantSession ts ON t.tenantId = ts.tenantId
        JOIN Room r ON ts.roomId = r.roomId
        JOIN Minicite m ON r.miniciteId = m.miniciteId
        WHERE m.landlordId = ?
        ORDER BY ts.status, t.fullName
    `, [landlordId]);
    return rows;
};

module.exports = {
  findByUserId,
  findByLandlordId, // <-- Add this
};

