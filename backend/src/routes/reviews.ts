import express from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../config/db';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { shipmentId, driverId, shipperId, rating, comment } = req.body;

    if (!shipmentId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid review data' });
    }

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment || shipment.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed shipments' });
    }

    const review = await prisma.review.create({
      data: {
        shipmentId,
        driverId,
        shipperId,
        reviewerId: req.user!.id,
        rating,
        comment,
      },
    });

    if (driverId) {
      const driverReviews = await prisma.review.findMany({
        where: { driverId },
      });

      const avgRating =
        driverReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / driverReviews.length;

      await prisma.driver.update({
        where: { id: driverId },
        data: { rating: avgRating },
      });
    }

    if (shipperId) {
      const shipperReviews = await prisma.review.findMany({
        where: { shipperId },
      });

      const avgRating =
        shipperReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / shipperReviews.length;

      await prisma.shipper.update({
        where: { id: shipperId },
        data: { rating: avgRating },
      });
    }

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/driver/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { limit = 20 } = req.query;

    const reviews = await prisma.review.findMany({
      where: { driverId, isPublic: true },
      include: {
        shipment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/shipper/:shipperId', async (req, res) => {
  try {
    const { shipperId } = req.params;
    const { limit = 20 } = req.query;

    const reviews = await prisma.review.findMany({
      where: { shipperId, isPublic: true },
      include: {
        shipment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/shipment/:shipmentId', authenticate, async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { shipmentId },
      include: {
        driver: { include: { user: true } },
        shipper: { include: { user: true } },
      },
    });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
