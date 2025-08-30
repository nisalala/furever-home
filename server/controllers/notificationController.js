// controllers/notificationController.js
import Application from '../models/Application.js';
import Pet from '../models/Pet.js';

export const getApplicationsCount = async (req, res) => {
  try {
    // Find pets listed by current user
    const pets = await Pet.find({ listedBy: req.user._id });
    const petIds = pets.map(p => p._id);

    // Count all applications for those pets
    const count = await Application.countDocuments({
      pet: { $in: petIds },
      status: { $in: ["Pending", "Approved", "Rejected"] }
    });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
