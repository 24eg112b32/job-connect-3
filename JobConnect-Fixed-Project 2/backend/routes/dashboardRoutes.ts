import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public platform stats
router.get('/stats', DashboardController.getPlatformStats);

// Job Seeker dashboard
router.get('/seeker', authenticateToken, requireRole('job_seeker'), DashboardController.getSeekerDashboard);

// Recruiter dashboard
router.get('/recruiter', authenticateToken, requireRole('recruiter'), DashboardController.getRecruiterDashboard);

export default router;
