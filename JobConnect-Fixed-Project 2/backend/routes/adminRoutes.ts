import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes with authentication and admin role check
router.use(authenticateToken, requireRole('admin'));

router.get('/overview', AdminController.getOverview);
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/status', AdminController.updateUserStatus);
router.patch('/jobs/:id/status', AdminController.updateJobStatus);

export default router;
