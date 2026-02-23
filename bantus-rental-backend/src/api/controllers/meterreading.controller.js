const MeterReadingModel = require('../../models/meterreading.model');
const RoomModel = require('../../models/room.model');
const LandlordModel = require('../../models/landlord.model');
const MiniciteModel = require('../../models/minicite.model');

// Controller to submit a new meter reading for a room
const submitReading = async (req, res) => {
    const { roomId } = req.params;
    const { month, waterValue, electricityValue } = req.body;
    const landlordUserId = req.user.userId;

    if (!month || waterValue === undefined || electricityValue === undefined) {
        return res.status(400).json({ message: 'Month, waterValue, and electricityValue are required.' });
    }

    try {
        // 1. Verify the room exists
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        // 2. Verify the landlord owns the property this room belongs to
        const landlord = await LandlordModel.findByUserId(landlordUserId);
        const minicite = await MiniciteModel.findById(room.miniciteId);
        if (minicite.landlordId !== landlord.landlordId) {
            return res.status(403).json({ message: 'Access denied. You do not own the property this room belongs to.' });
        }

        // 3. Create the meter reading
        const newReading = await MeterReadingModel.create({ roomId, month, waterValue, electricityValue });
        res.status(201).json({ message: 'Meter reading submitted successfully!', data: newReading });

    } catch (error) {
        // Handle the duplicate entry error from the model
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message });
        }
        const statusCode = error.message.startsWith('Access denied') ? 403 : 500;
        res.status(statusCode).json({ message: error.message || 'An error occurred while submitting the reading.' });
    }
};

// Controller to get all readings for a room
const getReadingsForRoom = async (req, res) => {
    const { roomId } = req.params;
    const landlordUserId = req.user.userId;

    try {
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        const landlord = await LandlordModel.findByUserId(landlordUserId);
        const minicite = await MiniciteModel.findById(room.miniciteId);
        if (minicite.landlordId !== landlord.landlordId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const readings = await MeterReadingModel.findByRoomId(roomId);
        res.status(200).json({ message: 'Readings fetched successfully.', data: readings });

    } catch (error) {
        const statusCode = error.message.startsWith('Access denied') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

module.exports = {
    submitReading,
    getReadingsForRoom,
};
