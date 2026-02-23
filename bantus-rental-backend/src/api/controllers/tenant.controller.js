const UserModel = require('../../models/user.model');
const TenantSessionModel = require('../../models/tenantsession.model');
const RoomModel = require('../../models/room.model');
const LandlordModel = require('../../models/landlord.model');

// Controller to register a new tenant (action by landlord)
const registerTenant = async (req, res) => {
  const { fullName, username, password } = req.body;

  if (!fullName || !username || !password) {
    return res.status(400).json({ message: 'Full name, username, and password are required.' });
  }

  try {
    // Any landlord can register a tenant, so no ownership check needed here
    const newTenant = await UserModel.createTenantUser({ fullName, username, password });
    res.status(201).json({
      message: 'Tenant registered successfully! You can now assign them to a room.',
      data: newTenant
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'An error occurred during tenant registration.' });
  }
};

// Controller to create a tenant session (assign a tenant to a room)
const createTenantSession = async (req, res) => {
    const { roomId } = req.params;
    const { tenantId, entryDate, contractImage } = req.body;
    const userId = req.user.userId; // Landlord's user ID

    if (!tenantId || !entryDate) {
        return res.status(400).json({ message: 'Tenant ID and entry date are required.' });
    }

    try {
        // 1. Verify the room exists and is vacant
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }
        if (room.status !== 'vacant') {
            return res.status(409).json({ message: 'Room is already occupied.' });
        }

        // 2. Verify the landlord owns the minicité this room belongs to
        const landlord = await LandlordModel.findByUserId(userId);
        const minicite = await MiniciteModel.findById(room.miniciteId);
        if (minicite.landlordId !== landlord.landlordId) {
            return res.status(403).json({ message: 'Access denied. You do not own the property this room belongs to.' });
        }

        // 3. Create the session
        const newSession = await TenantSessionModel.create({ tenantId, roomId, entryDate, contractImage });
        res.status(201).json({ message: 'Tenant session created successfully. The tenant is now assigned to the room.', data: newSession });

    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while creating the tenant session.' });
    }
};

// ... (keep existing registerTenant and createTenantSession functions)
const TenantModel = require('../../models/tenant.model'); // <-- Add this import

// Controller for a tenant to view their own rental details (dashboard)
const getMyDashboard = async (req, res) => {
    const userId = req.user.userId; // From 'protect' middleware

    try {
        // 1. Find the tenantId from the userId
        const tenant = await TenantModel.findByUserId(userId);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant profile not found.' });
        }

        // 2. Find the active session for this tenant
        const sessionDetails = await TenantSessionModel.findActiveByTenantId(tenant.tenantId);
        if (!sessionDetails) {
            return res.status(404).json({ message: 'No active rental session found.' });
        }

        res.status(200).json({
            message: 'Dashboard data fetched successfully.',
            data: sessionDetails
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while fetching dashboard data.' });
    }
};


// ... (keep existing functions)

// Controller for a landlord to get a list of all their tenants
const getAllTenantsForLandlord = async (req, res) => {
    const landlordUserId = req.user.userId;
    try {
        const landlord = await LandlordModel.findByUserId(landlordUserId);
        if (!landlord) {
            return res.status(404).json({ message: 'Landlord profile not found.' });
        }
        const tenants = await TenantModel.findByLandlordId(landlord.landlordId);
        res.status(200).json({ message: 'Tenants fetched successfully.', data: tenants });
    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while fetching tenants.' });
    }
};

module.exports = {
  registerTenant,
  createTenantSession,
  getMyDashboard,
  getAllTenantsForLandlord, // <-- Add this
};


