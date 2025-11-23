import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { ShipmentService } from '../services/shipmentService';
import { PodService } from '../services/podService';
import prisma from '../config/db';

const router = Router();
const shipmentService = new ShipmentService();
const podService = new PodService();

// Get all shipments (filtered by role)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const shipments = await shipmentService.getShipments(req.user!.id, req.user!.role);
    res.json(shipments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get available shipments (for drivers)
router.get('/available', authenticate, authorize('driver'), async (req: AuthRequest, res: Response) => {
  try {
    const shipments = await shipmentService.getAvailableShipments();
    res.json(shipments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get shipment by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.user!.id,
      req.user!.role
    );
    res.json(shipment);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Create shipment (shipper only)
router.post(
  '/',
  authenticate,
  authorize('shipper', 'admin'),
  [
    body('pickupAddress').notEmpty().withMessage('Pickup address is required'),
    body('dropoffAddress').notEmpty().withMessage('Dropoff address is required'),
    body('pickupLat').isFloat().withMessage('Valid pickup latitude is required'),
    body('pickupLng').isFloat().withMessage('Valid pickup longitude is required'),
    body('dropoffLat').isFloat().withMessage('Valid dropoff latitude is required'),
    body('dropoffLng').isFloat().withMessage('Valid dropoff longitude is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get shipper ID
      const shipper = await prisma.shipper.findUnique({
        where: { userId: req.user!.id },
      });

      if (!shipper) {
        return res.status(404).json({ error: 'Shipper profile not found' });
      }

      const shipment = await shipmentService.createShipment({
        shipperId: shipper.id,
        ...req.body,
      });

      res.status(201).json(shipment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Assign driver to shipment (shipper/admin only)
router.post(
  '/:id/assign',
  authenticate,
  authorize('shipper', 'admin'),
  [body('driverId').notEmpty().withMessage('Driver ID is required')],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const shipment = await shipmentService.assignDriver({
        shipmentId: req.params.id,
        driverId: req.body.driverId,
      });

      res.json(shipment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Update shipment status
router.patch(
  '/:id/status',
  authenticate,
  [body('status').notEmpty().withMessage('Status is required')],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const shipment = await shipmentService.updateShipmentStatus(
        req.params.id,
        req.body.status,
        req.user!.id,
        req.user!.role
      );

      res.json(shipment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Upload POD (driver only)
router.post(
  '/:id/pod',
  authenticate,
  authorize('driver'),
  [
    body('imageUrl').isURL().withMessage('Valid image URL is required'),
    body('gpsLat').isFloat().withMessage('Valid GPS latitude is required'),
    body('gpsLng').isFloat().withMessage('Valid GPS longitude is required'),
    body('deviceTime').isISO8601().withMessage('Valid device time is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get driver ID
      const driver = await prisma.driver.findUnique({
        where: { userId: req.user!.id },
      });

      if (!driver) {
        return res.status(404).json({ error: 'Driver profile not found' });
      }

      const podEvent = await podService.createPod({
        shipmentId: req.params.id,
        driverId: driver.id,
        imageUrl: req.body.imageUrl,
        gpsLat: req.body.gpsLat,
        gpsLng: req.body.gpsLng,
        deviceTime: new Date(req.body.deviceTime),
      });

      res.status(201).json(podEvent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get POD events for shipment
router.get('/:id/pod-events', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const podEvents = await podService.getPodEvents(req.params.id);
    res.json(podEvents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Approve POD (shipper/admin only)
router.post(
  '/:id/pod/:podId/approve',
  authenticate,
  authorize('shipper', 'admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const podEvent = await podService.approvePod(req.params.podId);
      res.json(podEvent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Reject POD (shipper/admin only)
router.post(
  '/:id/pod/:podId/reject',
  authenticate,
  authorize('shipper', 'admin'),
  [body('reason').notEmpty().withMessage('Reason is required')],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const podEvent = await podService.rejectPod(req.params.podId, req.body.reason);
      res.json(podEvent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get suspicious PODs (admin only)
router.get('/admin/suspicious-pods', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const suspiciousPods = await podService.getSuspiciousPods();
    res.json(suspiciousPods);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
