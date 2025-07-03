import express from "express";
import multer from "multer";
import Pet from "../models/Pet.js";
import User from "../models/User.js";  // <-- Import User model here
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", protect, upload.array("images", 5), async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

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

    // parse JSON fields if sent as strings
    const parsedAge = age ? JSON.parse(age) : { years: 0, months: 0 };
    const parsedTraits = traits ? JSON.parse(traits) : [];

    const images = req.files.map((file) => file.path);

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
      status,
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
