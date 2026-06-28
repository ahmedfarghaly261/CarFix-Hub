import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class NotificationController {
  static getNotifications = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const notifications = await NotificationService.getUserNotifications(req.user._id.toString());
    res.json(notifications);
  });

  static getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const count = await NotificationService.getUnreadCount(req.user._id.toString());
    res.json({ count });
  });

  static markAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const notification = await NotificationService.markAsRead(req.params.id as string, req.user._id.toString(), req.body.read);
    res.json(notification);
  });

  static markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    await NotificationService.markAllAsRead(req.user._id.toString());
    res.json({ message: 'All notifications marked as read' });
  });

  static deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    await NotificationService.deleteNotification(req.params.id as string, req.user._id.toString());
    res.json({ message: 'Notification deleted' });
  });

  static createAdminNotification = asyncHandler(async (req: Request, res: Response) => {
    const notification = await NotificationService.createAdminNotification(req.body);
    res.status(201).json(notification);
  });
}
