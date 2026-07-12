import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';

const router = Router();

router.get('/unread', NotificationController.getUnreadCount);
router.put('/read-all', NotificationController.markAllAsRead);
router.get('/', NotificationController.getNotifications);
router.put('/:id', NotificationController.markAsRead);
router.delete('/:id', NotificationController.deleteNotification);
router.post('/create', NotificationController.createAdminNotification);

export default router;
