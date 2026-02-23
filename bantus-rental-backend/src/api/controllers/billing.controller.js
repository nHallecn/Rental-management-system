const pool = require('../../config/db.config');
const UtilityBillModel = require('../../models/utilitybill.model');

// Controller to generate a utility bill from a meter reading
const generateBillFromReading = async (req, res) => {
    const { readingId } = req.params;
    const { waterRate, electricityRate, deadline } = req.body;

    if (!waterRate || !electricityRate || !deadline) {
        return res.status(400).json({ message: 'Water rate, electricity rate, and deadline are required.' });
    }

    try {
        // 1. Get the current reading
        const [currentReadings] = await pool.execute('SELECT * FROM MeterReading WHERE readingId = ?', [readingId]);
        if (currentReadings.length === 0) {
            return res.status(404).json({ message: 'Meter reading not found.' });
        }
        const currentReading = currentReadings[0];
        const { roomId, month, waterValue, electricityValue } = currentReading;

        // 2. Find the active session for this room at the time of the reading
        const [activeSessions] = await pool.execute(
            `SELECT * FROM TenantSession WHERE roomId = ? AND status = 'active' AND entryDate <= ?`,
            [roomId, month]
        );
        if (activeSessions.length === 0) {
            return res.status(404).json({ message: 'No active tenant session found for this room and period.' });
        }
        const activeSession = activeSessions[0];

        // 3. Get the previous month's reading for the same room
        const [prevReadings] = await pool.execute(
            `SELECT * FROM MeterReading WHERE roomId = ? AND month < ? ORDER BY month DESC LIMIT 1`,
            [roomId, month]
        );
        
        const prevWaterValue = prevReadings.length > 0 ? prevReadings[0].waterValue : 0;
        const prevElectricityValue = prevReadings.length > 0 ? prevReadings[0].electricityValue : 0;

        // 4. Calculate consumption
        const waterConsumed = waterValue - prevWaterValue;
        const electricityConsumed = electricityValue - prevElectricityValue;

        // 5. Calculate cost
        const waterCost = waterConsumed * parseFloat(waterRate);
        const electricityCost = electricityConsumed * parseFloat(electricityRate);

        // 6. Create bill records in the database (as a transaction)
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
            // Create water bill
            await UtilityBillModel.create({
                sessionId: activeSession.sessionId,
                readingId: readingId,
                type: 'water',
                unitsConsumed: waterConsumed,
                amount: waterCost,
                deadline: deadline,
            });
            // Create electricity bill
            await UtilityBillModel.create({
                sessionId: activeSession.sessionId,
                readingId: readingId,
                type: 'electricity',
                unitsConsumed: electricityConsumed,
                amount: electricityCost,
                deadline: deadline,
            });
            await connection.commit();
        } catch (dbError) {
            await connection.rollback();
            throw dbError;
        } finally {
            connection.release();
        }

        res.status(201).json({
            message: 'Utility bills generated successfully!',
            data: {
                water: { consumed: waterConsumed, cost: waterCost },
                electricity: { consumed: electricityConsumed, cost: electricityCost },
                total: waterCost + electricityCost,
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred during bill generation.' });
    }
};

// ... (keep 'generateBillFromReading' function)
const TenantModel = require('../../models/tenant.model'); // Make sure this is imported

// Controller for a tenant to get their own bills
const getMyBills = async (req, res) => {
    const tenantUserId = req.user.userId;
    try {
        const tenant = await TenantModel.findByUserId(tenantUserId);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant profile not found.' });
        }
        const bills = await UtilityBillModel.findByTenantId(tenant.tenantId);
        res.status(200).json({ message: 'Bills fetched successfully.', data: bills });
    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while fetching bills.' });
    }
};

module.exports = {
    generateBillFromReading,
    getMyBills, // <-- Add this
};

