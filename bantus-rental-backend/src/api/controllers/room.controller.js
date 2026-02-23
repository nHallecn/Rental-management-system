const RoomModel = require('../../models/room.model');
const MiniciteModel = require('../../models/minicite.model');
const LandlordModel = require('../../models/landlord.model');

// A helper function to verify ownership
const verifyOwnership = async (userId, miniciteId) => {
    const landlord = await LandlordModel.findByUserId(userId);
    if (!landlord) throw new Error('Landlord profile not found.');

    const minicite = await MiniciteModel.findById(miniciteId);
    if (!minicite) throw new Error('Minicité not found.');

    if (minicite.landlordId !== landlord.landlordId) {
        throw new Error('Access denied. You do not own this minicité.');
    }
    return true;
};

// Controller to create a new room in a minicité
const createRoom = async (req, res) => {
    const { miniciteId } = req.params;
    const { annualRent, status, apartmentId } = req.body;
    const userId = req.user.userId;

    if (!annualRent) {
        return res.status(400).json({ message: 'Annual rent is required.' });
    }

    try {
        await verifyOwnership(userId, miniciteId);
        
        const newRoom = await RoomModel.create({ miniciteId, apartmentId, annualRent, status });
        res.status(201).json({ message: 'Room created successfully!', data: newRoom });
    } catch (error) {
        const statusCode = error.message.startsWith('Access denied') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// Controller to get all rooms in a specific minicité
const getRoomsInMinicite = async (req, res) => {
    const { miniciteId } = req.params;
    const userId = req.user.userId;

    try {
        await verifyOwnership(userId, miniciteId);

        const rooms = await RoomModel.findByMiniciteId(miniciteId);
        res.status(200).json({ message: 'Rooms fetched successfully.', data: rooms });
    } catch (error) {
        const statusCode = error.message.startsWith('Access denied') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// Controller to update a room
const updateRoom = async (req, res) => {
    const { roomId } = req.params;
    const { annualRent, status } = req.body;
    const userId = req.user.userId;

    if (annualRent === undefined || status === undefined) {
        return res.status(400).json({ message: 'Annual rent and status are required.' });
    }

    try {
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        await verifyOwnership(userId, room.miniciteId);

        await RoomModel.updateById(roomId, { annualRent, status });
        res.status(200).json({ message: 'Room updated successfully.' });
    } catch (error) {
        const statusCode = error.message.startsWith('Access denied') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// Controller to delete a room
const deleteRoom = async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user.userId;

    try {
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        await verifyOwnership(userId, room.miniciteId);

        await RoomModel.deleteById(roomId);
        res.status(200).json({ message: 'Room deleted successfully.' });
    } catch (error) {
        const statusCode = error.message.startsWith('Access denied') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// ... (keep existing functions: createRoom, getRoomsInMinicite, etc.)
const TenantSessionModel = require('../../models/tenantsession.model');
const RentPaymentModel = require('../../models/rentpayment.model');
const IssueReportModel = require('../../models/issuereport.model');

// Controller to get all aggregated details for a single room
const getRoomDetails = async (req, res) => {
    const { roomId } = req.params;
    const landlordUserId = req.user.userId;

    try {
        // 1. Verify ownership (we can reuse the logic from updateRoom)
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }
        const landlord = await LandlordModel.findByUserId(landlordUserId);
        const minicite = await MiniciteModel.findById(room.miniciteId);
        if (minicite.landlordId !== landlord.landlordId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // 2. Initialize the details object
        const details = {
            room: room,
            minicite: minicite,
            tenant: null,
            session: null,
            rentHistory: [],
            issues: [],
        };

        // 3. If the room is occupied, fetch tenant-related data
        if (room.status === 'occupied') {
            // Find the active session in this room
            const [activeSession] = await pool.execute(
                `SELECT * FROM TenantSession WHERE roomId = ? AND status = 'active'`,
                [roomId]
            );
            
            if (activeSession && activeSession.length > 0) {
                const session = activeSession[0];
                details.session = session;

                // Fetch tenant details, rent history, and issues in parallel
                const [tenantDetails, rentHistory, issues] = await Promise.all([
                    pool.execute('SELECT * FROM Tenant WHERE tenantId = ?', [session.tenantId]),
                    RentPaymentModel.findBySessionId(session.sessionId),
                    IssueReportModel.findBySessionId(session.sessionId)
                ]);

                if (tenantDetails[0].length > 0) {
                    details.tenant = tenantDetails[0][0];
                }
                details.rentHistory = rentHistory;
                details.issues = issues;
            }
        }

        res.status(200).json({ message: 'Room details fetched successfully.', data: details });

    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while fetching room details.' });
    }
};
const getRoomsByMinicite = async (req, res) => {
  const { miniciteId } = req.params;
  const landlordId = req.user.landlordId; // from protect middleware

  try {
    // This query joins Room with TenantSession to see if a room is occupied
    const [rooms] = await pool.execute(`
      SELECT 
        r.roomId, r.number, r.annualRent, r.status, r.miniciteId,
        ts.sessionId, t.fullName as tenantName
      FROM Room r
      LEFT JOIN TenantSession ts ON r.roomId = ts.roomId AND ts.status = 'ACTIVE'
      LEFT JOIN Tenant t ON ts.tenantId = t.tenantId
      WHERE r.miniciteId = ? AND r.landlordId = ?
      ORDER BY r.number ASC
    `, [miniciteId, landlordId]);

    // Also fetch the minicité's name for the page title
    const [[minicite]] = await pool.execute('SELECT name FROM Minicite WHERE miniciteId = ?', [miniciteId]);

    res.status(200).json({ 
      message: 'Rooms fetched successfully', 
      data: {
        miniciteName: minicite.name,
        rooms: rooms
      }
    });
  } catch (error) {
    console.error("Error fetching rooms by minicite:", error);
    res.status(500).json({ message: 'Failed to fetch rooms.' });
  }
};


module.exports = {
    createRoom,
    getRoomsInMinicite,
    updateRoom,
    deleteRoom,
    getRoomDetails,
    getRoomsByMinicite,
 // <-- Add this
};

