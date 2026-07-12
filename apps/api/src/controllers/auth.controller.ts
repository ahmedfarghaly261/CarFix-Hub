import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);

    generateToken(res, (user as any)._id.toString());

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      workshopId: user.workshopId,
      phone: user.phone,
      profileImage: user.profileImage,
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.login(req.body);

    generateToken(res, (user as any)._id.toString());

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      workshopId: user.workshopId,
      phone: user.phone,
      profileImage: user.profileImage,
    });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ message: 'Logged out successfully' });
  });
}
