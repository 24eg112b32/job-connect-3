import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { DataService } from '../services/dataService.js';

export class ProfileController {
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await DataService.getSeekerProfile(userId);

      res.status(200).json({
        success: true,
        data: profile || {},
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const {
        headline,
        location,
        skills,
        education,
        experience,
        portfolio_url,
        linkedin_url,
        resume_path,
      } = req.body;

      const updated = await DataService.upsertSeekerProfile(userId, {
        headline,
        location,
        skills,
        education,
        experience,
        portfolio_url,
        linkedin_url,
        resume_path,
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update profile' });
    }
  }

  static async getPublicProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const targetUserId = parseInt(req.params.userId, 10);
      if (isNaN(targetUserId)) {
        res.status(400).json({ success: false, message: 'Invalid user ID' });
        return;
      }

      const user = await DataService.findUserById(targetUserId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const profile = await DataService.getSeekerProfile(targetUserId);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
          },
          profile: profile || {},
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
    }
  }
}
