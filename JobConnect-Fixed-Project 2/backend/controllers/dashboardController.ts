import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { DataService } from '../services/dataService.js';

export class DashboardController {
  static async getSeekerDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const applicantId = req.user!.id;
      const data = await DataService.getSeekerDashboard(applicantId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch job seeker metrics' });
    }
  }

  static async getRecruiterDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recruiterId = req.user!.id;
      const data = await DataService.getRecruiterDashboard(recruiterId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch recruiter metrics' });
    }
  }

  static async getPlatformStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await DataService.getPlatformStatistics();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to load platform statistics' });
    }
  }
}
