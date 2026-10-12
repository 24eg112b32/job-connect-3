import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { DataService } from '../services/dataService.js';

export class AdminController {
  static async getOverview(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await DataService.getAdminData();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch admin overview' });
    }
  }

  static async getUsers(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await DataService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
  }

  static async updateUserStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const { is_active } = req.body;

      if (isNaN(userId)) {
        res.status(400).json({ success: false, message: 'Invalid user ID' });
        return;
      }

      if (is_active !== 0 && is_active !== 1) {
        res.status(400).json({ success: false, message: 'is_active must be 0 or 1' });
        return;
      }

      // Prevent deactivating oneself
      if (req.user!.id === userId && is_active === 0) {
        res.status(400).json({ success: false, message: 'Administrators cannot deactivate their own account' });
        return;
      }

      const success = await DataService.updateUserStatus(userId, is_active);
      if (!success) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: `User account ${is_active === 1 ? 'activated' : 'suspended'} successfully`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to update user status' });
    }
  }

  static async updateJobStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const jobId = parseInt(req.params.id, 10);
      const { status } = req.body;

      if (isNaN(jobId)) {
        res.status(400).json({ success: false, message: 'Invalid job ID' });
        return;
      }

      if (!['active', 'inactive'].includes(status)) {
        res.status(400).json({ success: false, message: 'Status must be active or inactive' });
        return;
      }

      const updated = await DataService.updateJob(jobId, req.user!.id, { status }, true);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Job status updated to ${status}`,
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to update job status' });
    }
  }
}
