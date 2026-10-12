import { Router } from 'express';
import { ProfileController } from '../controllers/profileController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Current logged in seeker profile
router.get('/', authenticateToken, requireRole('job_seeker'), ProfileController.getProfile);
router.put('/', authenticateToken, requireRole('job_seeker'), ProfileController.updateProfile);

// Public / Recruiter view of applicant profile
router.get('/:userId', authenticateToken, ProfileController.getPublicProfile);

export default router;
