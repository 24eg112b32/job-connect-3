import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { DataService } from '../services/dataService.js';

export class JobController {
  static async getJobs(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        query,
        title,
        location,
        category,
        employment_type,
        work_arrangement,
        experience_level,
        company_id,
        recruiter_id,
        min_salary,
        max_salary,
        sort_by,
        page,
        limit,
        status,
      } = req.query;

      const result = await DataService.getJobs({
        query: (query || search) as string,
        title: title as string,
        location: location as string,
        category: category as string,
        employment_type: employment_type as string,
        work_arrangement: work_arrangement as string,
        experience_level: experience_level as string,
        company_id: company_id ? parseInt(company_id as string, 10) : undefined,
        recruiter_id: recruiter_id ? parseInt(recruiter_id as string, 10) : undefined,
        min_salary: min_salary ? parseFloat(min_salary as string) : undefined,
        max_salary: max_salary ? parseFloat(max_salary as string) : undefined,
        sort_by: sort_by as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
        status: status as string,
      });

      res.status(200).json({
        success: true,
        data: result.jobs,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('getJobs error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve jobs' });
    }
  }

  static async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid job ID' });
        return;
      }

      const job = await DataService.getJobById(id);
      if (!job) {
        res.status(404).json({ success: false, message: 'Job listing not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve job details' });
    }
  }

  static async getRecruiterJobs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recruiterId = req.user!.id;
      const result = await DataService.getJobs({
        recruiter_id: recruiterId,
        status: undefined, // return both active and inactive
        limit: 100,
      });

      res.status(200).json({
        success: true,
        data: result.jobs,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch recruiter jobs' });
    }
  }

  static async createJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recruiterId = req.user!.id;
      const {
        title,
        description,
        responsibilities,
        required_skills,
        qualifications,
        experience_level,
        employment_type,
        work_arrangement,
        location,
        salary_min,
        salary_max,
        application_deadline,
        status,
      } = req.body;

      if (!title || !title.trim()) {
        res.status(400).json({ success: false, message: 'Job title is required' });
        return;
      }
      if (!description || !description.trim()) {
        res.status(400).json({ success: false, message: 'Job description is required' });
        return;
      }
      if (!responsibilities || !responsibilities.trim()) {
        res.status(400).json({ success: false, message: 'Job responsibilities are required' });
        return;
      }
      if (!required_skills || !required_skills.trim()) {
        res.status(400).json({ success: false, message: 'Required skills are required' });
        return;
      }
      if (!qualifications || !qualifications.trim()) {
        res.status(400).json({ success: false, message: 'Job qualifications are required' });
        return;
      }
      if (!experience_level) {
        res.status(400).json({ success: false, message: 'Experience level is required' });
        return;
      }
      if (!employment_type) {
        res.status(400).json({ success: false, message: 'Employment type is required' });
        return;
      }
      if (!work_arrangement) {
        res.status(400).json({ success: false, message: 'Work arrangement is required' });
        return;
      }
      if (!location || !location.trim()) {
        res.status(400).json({ success: false, message: 'Location is required' });
        return;
      }

      const job = await DataService.createJob(recruiterId, {
        title,
        description,
        responsibilities,
        required_skills,
        qualifications,
        experience_level,
        employment_type,
        work_arrangement,
        location,
        salary_min,
        salary_max,
        application_deadline,
        status: status || 'active',
      });

      res.status(201).json({
        success: true,
        message: 'Job vacancy published successfully',
        data: job,
      });
    } catch (error: any) {
      console.error('createJob error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to create job posting' });
    }
  }

  static async updateJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        res.status(400).json({ success: false, message: 'Invalid job ID' });
        return;
      }

      const recruiterId = req.user!.id;
      const isAdmin = req.user!.role === 'admin';

      const updated = await DataService.updateJob(jobId, recruiterId, req.body, isAdmin);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Job listing not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job listing updated successfully',
        data: updated,
      });
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message || 'Failed to update job' });
      }
    }
  }

  static async deleteJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        res.status(400).json({ success: false, message: 'Invalid job ID' });
        return;
      }

      const recruiterId = req.user!.id;
      const isAdmin = req.user!.role === 'admin';

      const success = await DataService.deleteJob(jobId, recruiterId, isAdmin);
      if (!success) {
        res.status(404).json({ success: false, message: 'Job listing not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job listing deleted successfully',
      });
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message || 'Failed to delete job' });
      }
    }
  }

  static async toggleJobStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        res.status(400).json({ success: false, message: 'Invalid job ID' });
        return;
      }

      const { status } = req.body;
      if (!status || !['active', 'inactive'].includes(status)) {
        res.status(400).json({ success: false, message: 'Status must be active or inactive' });
        return;
      }

      const recruiterId = req.user!.id;
      const isAdmin = req.user!.role === 'admin';

      const updated = await DataService.updateJob(jobId, recruiterId, { status }, isAdmin);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Job listing not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Job listing status changed to ${status}`,
        data: updated,
      });
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message || 'Failed to update job status' });
      }
    }
  }
}
