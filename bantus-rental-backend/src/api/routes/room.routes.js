const express = require('express');
const router = express.Router({ mergeParams: true }); 
const RoomController = require('../controllers/room.controller');
const MeterReadingController = require('../controllers/meterreading.controller');
const { protect, isLandlord } = require('../middleware/auth.middleware');

router.use(protect, isLandlord);


router.get('/by-minicite/:miniciteId', protect, isLandlord, RoomController.getRoomsByMinicite);
// Routes for creating/listing rooms within a minicité
router.route('/')
    .post(RoomController.createRoom)
    .get(RoomController.getRoomsInMinicite);

// NEW: Route for getting aggregated details of a specific room
router.get('/:roomId/details', RoomController.getRoomDetails); // <-- Add this line
router.get('/by-minicite/:miniciteId', protect, isLandlord, RoomController.getRoomsByMinicite);

// Routes for updating/deleting a specific room
router.route('/:roomId')
    .put(RoomController.updateRoom)
    .delete(RoomController.deleteRoom);

// Routes for meter readings for a specific room
router.route('/:roomId/readings')
    .post(MeterReadingController.submitReading)
    .get(MeterReadingController.getReadingsForRoom);



module.exports = router;
