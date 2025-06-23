import express from 'express';
import { 
  submitApplication, 
  getMyApplications, 
  getApplicationsForPet, 
  approveApplication, 
  rejectApplication 
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Submit a new adoption application
router.post('/', protect, submitApplication);

// Get all applications submitted by logged-in user
router.get('/my', protect, getMyApplications);

// Get all applications for a specific pet (for pet owner)
router.get('/pet/:petId', protect, getApplicationsForPet);

// Approve an application (for pet owner)
router.put('/:id/approve', protect, approveApplication);

// Reject an application (for pet owner)
router.put('/:id/reject', protect, rejectApplication);

export default router;
