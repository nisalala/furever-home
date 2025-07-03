import express from 'express';
import axios from 'axios';

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

export default router;
