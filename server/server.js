import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { protect } from './middleware/authMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import petRoutes from "./routes/petRoutes.js";





dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Public routes: no authentication required
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);


//for user preferences 
app.use('/api/users', userRoutes);

//for adding pets
app.use("/api/pets", petRoutes);

// Protected routes: user must be authenticated
app.use('/api/applications', protect, applicationRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Furever Home Backend Running!');
});

// Connect to MongoDB and Start Server
const PORT = 5002 || process.env.PORT;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.log('❌ DB connection error:', err));
