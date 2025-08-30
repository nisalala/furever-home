import User from "../models/User.js";
import Pet from '../models/Pet.js';
import Application from "../models/Application.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Get user with populated pets and favorites
    const user = await User.findById(userId)
      .populate("favoritePets")
      .populate("addedPets")
      .populate({
        path: "adoptionApplications",
        populate: { path: "pet" }
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Get received applications: apps where pet.listedBy == userId
    const receivedApplications = await Application.find()
      .populate("pet")
      .populate("applicant");

 const applicationsReceived = receivedApplications.filter(app => {
  return app.pet?.listedBy?.toString() === userId;
});


    res.status(200).json({ user, applicationsReceived });
  } catch (err) {
    console.error("Failed to get user profile:", err);
    res.status(500).json({ message: "Error getting profile" });
  }
};

// Add or remove pet from favorites
export const toggleFavoritePet = async (req, res) => {
  try {
    const userId = req.user._id;
    const petId = req.params.petId;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isFavorited = user.favoritePets.includes(petId);

    if (isFavorited) {
      // Remove from favorites
      user.favoritePets = user.favoritePets.filter(id => id.toString() !== petId);
    } else {
      // Add to favorites
      user.favoritePets.push(petId);
    }

    await user.save();

    res.json({ favoritePets: user.favoritePets, favorited: !isFavorited });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's favorite pets
export const getFavoritePets = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favoritePets');
    res.json(user.favoritePets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
