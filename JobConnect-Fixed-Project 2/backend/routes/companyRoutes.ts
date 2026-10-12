import { Router } from 'express';
import { CompanyController } from '../controllers/companyController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public endpoints
router.get('/', CompanyController.getCompanies);
router.get('/:id', CompanyController.getCompanyById);

// Recruiter endpoints
router.get('/me/profile', authenticateToken, requireRole('recruiter'), CompanyController.getMyCompany);
router.post('/', authenticateToken, requireRole('recruiter'), CompanyController.upsertMyCompany);
router.put('/:id', authenticateToken, requireRole('recruiter'), CompanyController.upsertMyCompany);

export default router;
