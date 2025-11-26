import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
} from '../services/notificationService';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const notifications = await getNotifications(req.user!.id, limit);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await markAsRead(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/read-all', authenticate, async (req, res) => {
  try {
    await markAllAsRead(req.user!.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
