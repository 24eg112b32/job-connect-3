import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DataService, User } from '../services/dataService.js';

export interface AuthRequest extends Request {
  user?: User;
}

const JWT_SECRET = process.env.JWT_SECRET || 'jobconnect_jwt_secret_production_key_2026_xyz';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication session. Please log in again.',
      });
      return;
    }

    if (!decoded || !decoded.id) {
      res.status(401).json({
        success: false,
        message: 'Malformed token payload',
      });
      return;
    }

    const user = await DataService.findUserById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User account associated with this token was not found',
      });
      return;
    }

    if (user.is_active !== 1) {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal authentication error',
    });
  }
};

export const requireRole = (...allowedRoles: Array<'job_seeker' | 'recruiter' | 'admin'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
