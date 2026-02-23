const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');

// This function will handle the creation of a new landlord
const createLandlord = async (landlordData) => {
  const { fullName, phone, username, password } = landlordData;

  // Start a transaction to ensure both inserts succeed or fail together
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Insert into the User table
    const [userResult] = await connection.execute(
      'INSERT INTO User (username, passwordHash, role) VALUES (?, ?, ?)',
      [username, passwordHash, 'landlord']
    );
    const newUserId = userResult.insertId;

    // 3. Insert into the Landlord table
    await connection.execute(
      'INSERT INTO Landlord (userId, fullName, phone) VALUES (?, ?, ?)',
      [newUserId, fullName, phone]
    );

    // If everything is successful, commit the transaction
    await connection.commit();
    
    // Return the new user's ID, but exclude sensitive data
    return { id: newUserId, username, fullName };

  } catch (error) {
    // If any error occurs, roll back the transaction
    await connection.rollback();
    
    // Check for a duplicate username error
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Username already exists.');
    }
    
    // For other errors, re-throw them to be handled by the controller
    throw error;
  } finally {
    // Always release the connection back to the pool
    connection.release();
  }
};

// ... (keep the existing createLandlord function)

// This function will find a user by their username
const findUserByUsername = async (username) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM User WHERE username = ?',
      [username]
    );
    // rows is an array, we want the first element if it exists
    return rows[0];
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  } finally {
    connection.release();
  }
};

// Add findUserByUsername to the exports
// ... (keep existing functions)

// This function will handle the creation of a new tenant user account
const createTenantUser = async (tenantUserData) => {
  const { username, password, fullName } = tenantUserData;
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Insert into the User table
    const [userResult] = await connection.execute(
      'INSERT INTO User (username, passwordHash, role) VALUES (?, ?, ?)',
      [username, passwordHash, 'tenant']
    );
    const newUserId = userResult.insertId;

    // 3. Insert into the Tenant table
    await connection.execute(
      'INSERT INTO Tenant (userId, fullName) VALUES (?, ?)',
      [newUserId, fullName]
    );

    await connection.commit();
    
    // Return the new tenant's ID and user ID
    const [tenantRows] = await connection.execute('SELECT tenantId FROM Tenant WHERE userId = ?', [newUserId]);
    return { userId: newUserId, tenantId: tenantRows[0].tenantId, username, fullName };

  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Username already exists.');
    }
    throw error;
  } finally {
    connection.release();
  }
};


module.exports = {
  createLandlord,
  findUserByUsername,
  createTenantUser, // <-- Add this
};


