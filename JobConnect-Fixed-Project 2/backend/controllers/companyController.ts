import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { DataService } from '../services/dataService.js';

export class CompanyController {
  static async getCompanies(_req: Request, res: Response): Promise<void> {
    try {
      const companies = await DataService.getCompanies();
      res.status(200).json({
        success: true,
        data: companies,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve companies' });
    }
  }

  static async getCompanyById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid company ID' });
        return;
      }

      const company = await DataService.getCompanyById(id);
      if (!company) {
        res.status(404).json({ success: false, message: 'Company not found' });
        return;
      }

      // Fetch active jobs from this company
      const jobsResult = await DataService.getJobs({ company_id: id, status: 'active', limit: 20 });

      res.status(200).json({
        success: true,
        data: {
          company,
          jobs: jobsResult.jobs,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch company details' });
    }
  }

  static async getMyCompany(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recruiterId = req.user!.id;
      const company = await DataService.getCompanyByRecruiterId(recruiterId);
      res.status(200).json({
        success: true,
        data: company || null,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch company' });
    }
  }

  static async upsertMyCompany(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recruiterId = req.user!.id;
      const {
        company_name,
        description,
        industry,
        company_size,
        website,
        location,
        logo_url,
      } = req.body;

      if (!company_name || !company_name.trim()) {
        res.status(400).json({ success: false, message: 'Company name is required' });
        return;
      }

      const updated = await DataService.upsertCompany(recruiterId, {
        company_name,
        description,
        industry,
        company_size,
        website,
        location,
        logo_url,
      });

      res.status(200).json({
        success: true,
        message: 'Company profile updated successfully',
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to save company profile' });
    }
  }
}
