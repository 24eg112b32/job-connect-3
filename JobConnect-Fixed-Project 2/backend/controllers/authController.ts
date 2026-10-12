import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DataService } from '../services/dataService.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jobconnect_jwt_secret_production_key_2026_xyz';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '1d' });
};

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { full_name, email, password, confirm_password, phone, role } = req.body;

      if (!full_name || !full_name.trim()) {
        res.status(400).json({ success: false, message: 'Full name is required' });
        return;
      }
      if (!email || !email.trim()) {
        res.status(400).json({ success: false, message: 'Email address is required' });
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        return;
      }

      if (!password) {
        res.status(400).json({ success: false, message: 'Password is required' });
        return;
      }
      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        return;
      }

      if (password !== confirm_password) {
        res.status(400).json({ success: false, message: 'Passwords do not match' });
        return;
      }

      // Role check: only 'job_seeker' or 'recruiter' allowed during public registration
      if (!role || !['job_seeker', 'recruiter'].includes(role)) {
        res.status(400).json({ success: false, message: 'Please select a valid role (job_seeker or recruiter)' });
        return;
      }

      const existingUser = await DataService.findUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ success: false, message: 'An account with this email address already exists' });
        return;
      }

      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const newUser = await DataService.createUser({
        full_name,
        email,
        password_hash,
        role,
        phone,
      });

      const token = generateToken(newUser.id, newUser.role);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          token,
          user: {
            id: newUser.id,
            full_name: newUser.full_name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            created_at: newUser.created_at,
          },
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error occurred during registration' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      const user = await DataService.findUserByEmail(email);
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      if (user.is_active !== 1) {
        res.status(403).json({ success: false, message: 'Your account is deactivated. Contact support for assistance.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const token = generateToken(user.id, user.role);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            created_at: user.created_at,
          },
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error during login authentication' });
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const user = req.user;
      let extraData: any = {};

      if (user.role === 'job_seeker') {
        extraData.profile = await DataService.getSeekerProfile(user.id);
      } else if (user.role === 'recruiter') {
        extraData.company = await DataService.getCompanyByRecruiterId(user.id);
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            is_active: user.is_active,
            created_at: user.created_at,
          },
          ...extraData,
        },
      });
    } catch (error: any) {
      console.error('Me endpoint error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve user session' });
    }
  }
}
