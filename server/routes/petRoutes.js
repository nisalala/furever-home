import express from "express";
import Pet from "../models/Pet.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/pets
// @desc    Add a new pet for adoption
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      size,
      description,
      vaccinated,
      neutered,
      traits,
      location,
      status,
      images,
    } = req.body;

    const newPet = new Pet({
      name,
      species,
      breed,
      age,
      gender,
      size,
      description,
      vaccinated,
      neutered,
      traits,
      location,
      status,
      images,
      listedBy: req.user._id,
    });

    await newPet.save();
    res.status(201).json({ msg: "Pet listed successfully", pet: newPet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().populate("listedBy", "name email");
    res.status(200).json(pets);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
