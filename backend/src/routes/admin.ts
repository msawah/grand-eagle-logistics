import express from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../config/db';
import { applyPenalty } from '../services/walletService';
import { notifyPenaltyApplied } from '../services/notificationService';

const router = express.Router();

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        shipper: true,
        driver: true,
        wallet: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/shipments', authenticate, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        shipper: { include: { user: true } },
        driver: { include: { user: true } },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.shipment.count({ where });

    res.json({
      shipments,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/penalties', authenticate, adminOnly, async (req, res) => {
  try {
    const { driverId, amount, reason, shipmentId } = req.body;

    if (!driverId || !amount || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const penalty = await applyPenalty(driverId, amount, reason, shipmentId);

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { user: true },
    });

    if (driver) {
      await notifyPenaltyApplied(driver.userId, amount, reason);
    }

    res.json(penalty);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/penalties', authenticate, adminOnly, async (req, res) => {
  try {
    const { isPaid, page = 1, limit = 50 } = req.query;

    const where: any = { isActive: true };

    if (isPaid !== undefined) {
      where.isPaid = isPaid === 'true';
    }

    const penalties = await prisma.penalty.findMany({
      where,
      include: {
        driver: { include: { user: true } },
        shipment: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.penalty.count({ where });

    res.json({
      penalties,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, isVerified } = req.body;

    const updateData: any = {};

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (isVerified !== undefined) {
      updateData.isVerified = isVerified;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/shipments/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.shipment.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Shipment deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/overview', authenticate, adminOnly, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });

    const totalShipments = await prisma.shipment.count();
    const activeShipments = await prisma.shipment.count({
      where: {
        status: { in: ['assigned', 'en_route', 'in_transit', 'picked_up'] },
      },
    });

    const completedToday = await prisma.shipment.count({
      where: {
        status: 'completed',
        updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });

    const revenue = await prisma.shipment.aggregate({
      where: { status: 'completed' },
      _sum: { price: true, platformFee: true },
    });

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      shipments: {
        total: totalShipments,
        active: activeShipments,
        completedToday,
      },
      revenue: {
        total: revenue._sum.price || 0,
        platformFees: revenue._sum.platformFee || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
