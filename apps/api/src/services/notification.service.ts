import { Notification, INotification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';

export class NotificationService {
  static async getUserNotifications(userId: string): Promise<INotification[]> {
    return Notification.find({ recipient: userId }).sort({ createdAt: -1 });
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({
      recipient: userId,
      read: false,
    });
  }

  static async markAsRead(notificationId: string, userId: string, read?: boolean): Promise<INotification> {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    notification.read = read !== undefined ? read : true;
    return notification.save();
  }

  static async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany({ recipient: userId, read: false }, { read: true });
  }

  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    await notification.deleteOne();
  }

  static async createAdminNotification(data: any): Promise<INotification> {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new ApiError(404, 'Admin not found');
    }

    const notification = await Notification.create({
      recipient: admin._id,
      title: data.title || 'New Repair Request',
      message: data.message || 'A new repair request has been submitted',
      type: data.type || 'repair_update',
      relatedTo: {
        model: 'RepairRequest',
        id: data.relatedId,
      },
      read: false,
    });

    return notification;
  }
}
