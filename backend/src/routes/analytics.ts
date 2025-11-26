import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getShipperDashboardStats,
  getDriverDashboardStats,
  getAdminDashboardStats,
  updatePerformanceMetrics,
} from '../services/analyticsService';

const router = express.Router();

router.get('/shipper/:shipperId', authenticate, async (req, res) => {
  try {
    const { shipperId } = req.params;
    const stats = await getShipperDashboardStats(shipperId);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/driver/:driverId', authenticate, async (req, res) => {
  try {
    const { driverId } = req.params;
    const stats = await getDriverDashboardStats(driverId);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin', authenticate, async (req, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const stats = await getAdminDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/performance/:driverId', authenticate, async (req, res) => {
  try {
    const { driverId } = req.params;
    await updatePerformanceMetrics(driverId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
