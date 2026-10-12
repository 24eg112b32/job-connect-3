import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Job Seeker: Apply for job
router.post('/', authenticateToken, requireRole('job_seeker'), ApplicationController.applyForJob);

// Job Seeker: Get own applications
router.get('/my', authenticateToken, requireRole('job_seeker'), ApplicationController.getMyApplications);

// Recruiter: Get applications for a specific job
router.get('/job/:jobId', authenticateToken, requireRole('recruiter', 'admin'), ApplicationController.getJobApplications);

// Recruiter: Update application status
router.patch('/:id/status', authenticateToken, requireRole('recruiter', 'admin'), ApplicationController.updateStatus);

export default router;
