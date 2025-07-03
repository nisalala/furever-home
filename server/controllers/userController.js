import User from "../models/User.js";
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
      return app.pet.listedBy.toString() === userId;
    });

    res.status(200).json({ user, applicationsReceived });
  } catch (err) {
    console.error("Failed to get user profile:", err);
    res.status(500).json({ message: "Error getting profile" });
  }
};
