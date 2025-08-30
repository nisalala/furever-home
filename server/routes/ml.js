import express from 'express';
import axios from 'axios';
import Pet from '../models/Pet.js';

const router = express.Router();

// POST /api/ml/predict
router.post('/predict', async (req, res) => {
  try {
    const petData = req.body;

    const response = await axios.post('http://127.0.0.1:8000/predict', petData);

    res.json(response.data);
  } catch (error) {
    console.error('ML prediction error:', error.message);
    res.status(500).json({ error: 'Failed to get prediction from ML model' });
  }
});

// NEW: GET /api/ml/predict/:id
router.get('/predict/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // Prepare data for KNN API
    const petData = {
      PetType: pet.species,
      Breed: pet.breed,
      AgeMonths: pet.age.years * 12 + pet.age.months,
      Color: pet.color || 'Unknown',
      Size: pet.size,
      WeightKg: pet.weightKg || 0,
      Vaccinated: pet.vaccinated ? 1 : 0
    };

    // Call FastAPI KNN endpoint
    const response = await axios.post('http://127.0.0.1:8000/predict', petData);

    res.json({ pet, adoptionPrediction: response.data });
  } catch (error) {
    console.error('ML prediction by ID error:', error.message);
    res.status(500).json({ error: 'Failed to get prediction from ML model' });
  }
});

export default router;
