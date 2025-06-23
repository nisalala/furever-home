import Application from '../models/Application.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';

// Submit a new adoption application
export const submitApplication = async (req, res) => {
  try {
    const { pet, message } = req.body;
    if (!pet) {
      return res.status(400).json({ message: 'Pet ID is required' });
    }

    // Check if pet exists
    const petExists = await Pet.findById(pet);
    if (!petExists) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if user already applied for this pet
    const existingApplication = await Application.findOne({
      applicant: req.user._id,
      pet,
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'You already applied for this pet' });
    }

    const application = new Application({
      applicant: req.user._id,
      pet,
      message,
    });

    await application.save();

    // Optionally, add this application to user's applications array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { adoptionApplications: application._id }
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications submitted by the logged-in user
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('pet', 'name breed species location status')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications for a specific pet (for pet owner)
export const getApplicationsForPet = async (req, res) => {
  try {
    const petId = req.params.petId;

    // Confirm pet belongs to current user
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    if (pet.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applications for this pet' });
    }

    const applications = await Application.find({ pet: petId })
      .populate('applicant', 'name email location')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve an application (for pet owner)
export const approveApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId).populate('pet');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Check if current user owns the pet
    if (application.pet.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to approve this application' });
    }

    application.status = 'Approved';
    await application.save();

    // Update pet status to Adopted
    application.pet.status = 'Adopted';
    await application.pet.save();

    res.json({ message: 'Application approved', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject an application (for pet owner)
export const rejectApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId).populate('pet');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Check if current user owns the pet
    if (application.pet.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this application' });
    }

    application.status = 'Rejected';
    await application.save();

    res.json({ message: 'Application rejected', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
