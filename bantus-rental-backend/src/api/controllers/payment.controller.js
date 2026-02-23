const RentPaymentModel = require('../../models/rentpayment.model');
const TenantSessionModel = require('../../models/tenantsession.model');
const LandlordModel = require('../../models/landlord.model');
const pool = require('../../config/db.config'); // We need the pool for a custom query

// A helper function to verify that the landlord owns the session
const verifySessionOwnership = async (landlordUserId, sessionId) => {
    const landlord = await LandlordModel.findByUserId(landlordUserId);
    if (!landlord) throw new Error('Landlord profile not found.');

    // This query checks if the session belongs to a room in a minicité owned by the landlord
    const [rows] = await pool.execute(`
        SELECT ts.sessionId
        FROM TenantSession ts
        JOIN Room r ON ts.roomId = r.roomId
        JOIN Minicite m ON r.miniciteId = m.miniciteId
        WHERE ts.sessionId = ? AND m.landlordId = ?
    `, [sessionId, landlord.landlordId]);

    if (rows.length === 0) {
        throw new Error('Access denied. You do not have permission for this tenant session.');
    }
    return true;
};

// Controller to record a new rent payment
const recordRentPayment = async (req, res) => {
    const { sessionId } = req.params;
    const { paymentDate, amount, note } = req.body;
    const landlordUserId = req.user.userId;

    if (!paymentDate || amount === undefined) {
        return res.status(400).json({ message: 'Payment date and amount are required.' });
    }
    if (parseFloat(amount) <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    try {
        // Verify the landlord owns the property related to this session
        await verifySessionOwnership(landlordUserId, sessionId);

        const newPayment = await RentPaymentModel.create({ sessionId, paymentDate, amount, note });
        res.status(201).json({ message: 'Rent payment recorded successfully!', data: newPayment });

    } catch (error) {
        const statusCode = error.message.startsWith('Access denied') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// Controller to get all payments for a session
const getPaymentsForSession = async (req, res) => {
    const { sessionId } = req.params;
    const landlordUserId = req.user.userId;

    try {
        // Verify ownership before showing payment history
        await verifySessionOwnership(landlordUserId, sessionId);

        const payments = await RentPaymentModel.findBySessionId(sessionId);
        res.status(200).json({ message: 'Payments fetched successfully.', data: payments });

    } catch (error) {
        const statusCode = error.message.startsWith('Access denied') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// ... (keep 'recordRentPayment' and 'getPaymentsForSession' functions)

// Controller to get all payments for a landlord
const getAllPaymentsForLandlord = async (req, res) => {
    const landlordUserId = req.user.userId;
    try {
        const landlord = await LandlordModel.findByUserId(landlordUserId);
        if (!landlord) {
            return res.status(404).json({ message: 'Landlord profile not found.' });
        }
        const payments = await RentPaymentModel.findByLandlordId(landlord.landlordId);
        res.status(200).json({ message: 'All payments fetched successfully.', data: payments });
    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while fetching payments.' });
    }
};

module.exports = {
    recordRentPayment,
    getPaymentsForSession,
    getAllPaymentsForLandlord, // <-- Add this
};

