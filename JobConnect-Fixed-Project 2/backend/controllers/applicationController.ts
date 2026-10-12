import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { DataService } from '../services/dataService.js';

export class ApplicationController {
  static async applyForJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const applicantId = req.user!.id;
      const { job_id, resume_path, cover_letter } = req.body;

      if (!job_id) {
        res.status(400).json({ success: false, message: 'Job ID is required' });
        return;
      }

      const jobIdNum = parseInt(job_id, 10);
      if (isNaN(jobIdNum)) {
        res.status(400).json({ success: false, message: 'Invalid job ID format' });
        return;
      }

      // If resume_path not sent, check user's profile resume
      let finalResumePath = resume_path;
      if (!finalResumePath) {
        const profile = await DataService.getSeekerProfile(applicantId);
        finalResumePath = profile?.resume_path || null;
      }

      const application = await DataService.applyForJob({
        job_id: jobIdNum,
        applicant_id: applicantId,
        resume_path: finalResumePath,
        cover_letter: cover_letter || null, // Cover letter is explicitly optional
      });

      res.status(201).json({
        success: true,
        message: 'Your job application has been submitted successfully!',
        data: application,
      });
    } catch (error: any) {
      if (error.message.includes('already applied')) {
        res.status(409).json({ success: false, message: error.message });
      } else if (error.message.includes('deadline has expired') || error.message.includes('inactive')) {
        res.status(400).json({ success: false, message: error.message });
      } else if (error.message.includes('not found')) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message || 'Failed to submit job application' });
      }
    }
  }

  static async getMyApplications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const applicantId = req.user!.id;
      const applications = await DataService.getSeekerApplications(applicantId);

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve applications' });
    }
  }

  static async getJobApplications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const jobId = parseInt(req.params.jobId, 10);
      if (isNaN(jobId)) {
        res.status(400).json({ success: false, message: 'Invalid job ID' });
        return;
      }

      const recruiterId = req.user!.id;
      const isAdmin = req.user!.role === 'admin';

      const applications = await DataService.getJobApplications(jobId, recruiterId, isAdmin);

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({ success: false, message: error.message });
      } else if (error.message.includes('not found')) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message || 'Failed to fetch job applications' });
      }
    }
  }

  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.id, 10);
      if (isNaN(applicationId)) {
        res.status(400).json({ success: false, message: 'Invalid application ID' });
        return;
      }

      const { status } = req.body;
      const validStatuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'SELECTED'];
      if (!status || !validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: `Status must be one of: ${validStatuses.join(', ')}`,
        });
        return;
      }

      const recruiterId = req.user!.id;
      const isAdmin = req.user!.role === 'admin';

      const updated = await DataService.updateApplicationStatus(applicationId, recruiterId, status, isAdmin);

      res.status(200).json({
        success: true,
        message: `Application status updated to ${status}`,
        data: updated,
      });
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({ success: false, message: error.message });
      } else if (error.message.includes('not found')) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message || 'Failed to update application status' });
      }
    }
  }
}
