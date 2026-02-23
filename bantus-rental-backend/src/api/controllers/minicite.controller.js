const MiniciteModel = require('../../models/minicite.model');
const LandlordModel = require('../../models/landlord.model'); // We'll create this small model next

// Controller to create a new minicité
const createMinicite = async (req, res) => {
  const { name, location } = req.body;
  const userId = req.user.userId; // From 'protect' middleware

  if (!name) {
    return res.status(400).json({ message: 'Minicité name is required.' });
  }

  try {
    // We need the landlord's ID, not the user ID. Let's find it.
    const landlord = await LandlordModel.findByUserId(userId);
    if (!landlord) {
      return res.status(403).json({ message: 'Landlord profile not found for this user.' });
    }

    const newMinicite = await MiniciteModel.create({ landlordId: landlord.landlordId, name, location });
    res.status(201).json({ message: 'Minicité created successfully!', data: newMinicite });
  } catch (error) {
    res.status(500).json({ message: error.message || 'An error occurred while creating the minicité.' });
  }
};

// Controller to get all minicités for the logged-in landlord
const getMyMinicites = async (req, res) => {
  const userId = req.user.userId;

  try {
    const landlord = await LandlordModel.findByUserId(userId);
    if (!landlord) {
      return res.status(403).json({ message: 'Landlord profile not found for this user.' });
    }

    const minicites = await MiniciteModel.findByLandlordId(landlord.landlordId);
    res.status(200).json({ message: 'Minicités fetched successfully.', data: minicites });
  } catch (error) {
    res.status(500).json({ message: error.message || 'An error occurred while fetching minicités.' });
  }
};

// Controller to update a minicité
const updateMinicite = async (req, res) => {
    const { miniciteId } = req.params;
    const { name, location } = req.body;
    const userId = req.user.userId;

    if (!name) {
        return res.status(400).json({ message: 'Minicité name is required.' });
    }

    try {
        const landlord = await LandlordModel.findByUserId(userId);
        const minicite = await MiniciteModel.findById(miniciteId);

        if (!minicite) {
            return res.status(404).json({ message: 'Minicité not found.' });
        }

        // Security check: ensure the minicité belongs to the logged-in landlord
        if (minicite.landlordId !== landlord.landlordId) {
            return res.status(403).json({ message: 'Access denied. You do not own this minicité.' });
        }

        await MiniciteModel.updateById(miniciteId, { name, location });
        res.status(200).json({ message: 'Minicité updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while updating the minicité.' });
    }
};

// Controller to delete a minicité
const deleteMinicite = async (req, res) => {
    const { miniciteId } = req.params;
    const userId = req.user.userId;

    try {
        const landlord = await LandlordModel.findByUserId(userId);
        const minicite = await MiniciteModel.findById(miniciteId);

        if (!minicite) {
            return res.status(404).json({ message: 'Minicité not found.' });
        }

        // Security check
        if (minicite.landlordId !== landlord.landlordId) {
            return res.status(403).json({ message: 'Access denied. You do not own this minicité.' });
        }

        await MiniciteModel.deleteById(miniciteId);
        res.status(200).json({ message: 'Minicité deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while deleting the minicité.' });
    }
};


module.exports = {
  createMinicite,
  getMyMinicites,
  updateMinicite,
  deleteMinicite,
};
