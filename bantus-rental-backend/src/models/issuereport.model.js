const pool = require('../config/db.config');

// Model to create a new issue report
const create = async (issueData) => {
  const { sessionId, description, image } = issueData;
  const [result] = await pool.execute(
    'INSERT INTO IssueReport (sessionId, description, image, status) VALUES (?, ?, ?, ?)',
    [sessionId, description, image, 'open'] // Default status is 'open'
  );
  return { id: result.insertId, ...issueData };
};

// Model for a tenant to find their own issue reports
const findBySessionId = async (sessionId) => {
    const [rows] = await pool.execute(
      'SELECT * FROM IssueReport WHERE sessionId = ? ORDER BY createdAt DESC',
      [sessionId]
    );
    return rows;
};

// Model for a landlord to find all issue reports in their properties
const findByLandlordId = async (landlordId) => {
    const [rows] = await pool.execute(`
        SELECT i.*, r.roomId, m.name as miniciteName
        FROM IssueReport i
        JOIN TenantSession ts ON i.sessionId = ts.sessionId
        JOIN Room r ON ts.roomId = r.roomId
        JOIN Minicite m ON r.miniciteId = m.miniciteId
        WHERE m.landlordId = ?
        ORDER BY i.createdAt DESC
    `, [landlordId]);
    return rows;
};

// Model to update the status of an issue report
const updateStatusById = async (issueId, status) => {
    const [result] = await pool.execute(
      'UPDATE IssueReport SET status = ? WHERE issueId = ?',
      [status, issueId]
    );
    return result.affectedRows;
};

// Model to find a single issue by its ID
const findById = async (issueId) => {
    const [rows] = await pool.execute('SELECT * FROM IssueReport WHERE issueId = ?', [issueId]);
    return rows[0];
};

module.exports = {
  create,
  findBySessionId,
  findByLandlordId,
  updateStatusById,
  findById,
};
