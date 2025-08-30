import express from "express";
import multer from "multer";
import axios from "axios";
import mongoose from "mongoose";
import Pet from "../models/Pet.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { getEmergencyPets } from "../controllers/petController.js";

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// --------------------
// POST /api/pets
// Add a new pet
// --------------------
router.post("/", protect, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.user.isVerified) {
      return res.status(403).json({ message: "Only verified users can add pets." });
    }

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
    } = req.body;

    // Parse JSON fields if sent as strings
    const parsedAge = age ? JSON.parse(age) : { years: 0, months: 0 };
    const parsedTraits = traits ? JSON.parse(traits) : [];

    const images = req.files.map((file) => file.path);

    // Default coordinates (Kathmandu) if geocoding fails
    let coordinates = [85.324, 27.7172];
    if (location) {
      try {
        const geoRes = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        if (geoRes.data.length > 0) {
          coordinates = [
            parseFloat(geoRes.data[0].lon),
            parseFloat(geoRes.data[0].lat),
          ];
        }
      } catch (err) {
        console.warn("Failed to fetch coordinates, using default:", err.message);
      }
    }

    const newPet = new Pet({
      name,
      species,
      breed,
      age: parsedAge,
      gender,
      size,
      description,
      vaccinated,
      neutered,
      traits: parsedTraits,
      location,
      coordinates,
      status: status || "Available",
      images,
      listedBy: req.user._id,
    });

    await newPet.save();

    // Update user's addedPets array
    const user = await User.findById(req.user._id);
    if (user) {
      user.addedPets = user.addedPets || [];
      user.addedPets.push(newPet._id);
      await user.save();
    }

    res.status(201).json({ msg: "Pet listed successfully", pet: newPet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// --------------------
// GET /api/pets
// Fetch all pets (exclude adopted)
// --------------------
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find({ status: { $ne: "Adopted" } }).populate(
      "listedBy",
      "name email"
    );
    res.status(200).json(pets);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all emergency pets
router.get("/emergency", async (req, res) => {
  try {
    const emergencyPets = await Pet.find({ status: "Emergency" }).sort({ createdAt: -1 }); // <-- Capital E
    res.status(200).json(emergencyPets);
  } catch (error) {
    console.error("Error fetching emergency pets:", error);
    res.status(500).json({ message: "Server error fetching emergency pets" });
  }
});
// --------------------
// GET /api/pets/:id
// Fetch a single pet by ID
// --------------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid pet ID format" });
    }

    const pet = await Pet.findById(id).populate("listedBy", "name email");
    if (!pet) return res.status(404).json({ msg: "Pet not found" });

    res.status(200).json(pet);
  } catch (err) {
    console.error("Error fetching pet details:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// --------------------
// PUT /api/pets/:id/request-emergency
// Request emergency adoption for a pet
// --------------------
router.put("/:id/request-emergency", protect, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim() === "") {
      return res.status(400).json({ message: "Reason is required for emergency adoption" });
    }

    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Only the owner can request emergency
    if (pet.listedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to request emergency for this pet" });
    }

    if (pet.status === "Adopted" || pet.status === "Emergency") {
      return res.status(400).json({ message: "Pet cannot be marked for emergency" });
    }

    pet.emergencyRequested = true;
    pet.emergencyReason = reason;
    await pet.save();

    res.json({ message: "Emergency request sent successfully", pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error requesting emergency" });
  }
});




export default router;
