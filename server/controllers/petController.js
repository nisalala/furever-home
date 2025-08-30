import Pet from "../models/Pet.js";

export const getEmergencyPets = async (req, res) => {
  try {
    const emergencyPets = await Pet.find({ status: "emergency" }).limit(5); // fetch top 5
    res.status(200).json(emergencyPets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch emergency pets" });
  }
};
