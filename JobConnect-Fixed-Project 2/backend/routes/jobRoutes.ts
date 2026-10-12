import { Router } from 'express';
import { JobController } from '../controllers/jobController.js';
import { ApplicationController } from '../controllers/applicationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public: get jobs with filters, get single job
router.get('/', JobController.getJobs);
router.get('/:id', JobController.getJobById);

// Recruiter: get own jobs
router.get('/recruiter/my', authenticateToken, requireRole('recruiter', 'admin'), JobController.getRecruiterJobs);

// Recruiter/Admin: create, edit, delete, toggle status
router.post('/', authenticateToken, requireRole('recruiter', 'admin'), JobController.createJob);
router.put('/:id', authenticateToken, requireRole('recruiter', 'admin'), JobController.updateJob);
router.delete('/:id', authenticateToken, requireRole('recruiter', 'admin'), JobController.deleteJob);
router.patch('/:id/status', authenticateToken, requireRole('recruiter', 'admin'), JobController.toggleJobStatus);
router.get('/:jobId/applications', authenticateToken, requireRole('recruiter', 'admin'), ApplicationController.getJobApplications);

export default router;
