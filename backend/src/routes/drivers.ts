import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { DriverService } from '../services/driverService';
import { CarrierVerificationService } from '../services/carrierVerificationService';
import prisma from '../config/db';

const router = Router();
const driverService = new DriverService();
const carrierService = new CarrierVerificationService();

// Get driver profile
router.get('/profile', authenticate, authorize('driver'), async (req: AuthRequest, res: Response) => {
  try {
    const profile = await driverService.getDriverProfile(req.user!.id);
    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Update driver profile
router.patch('/profile', authenticate, authorize('driver'), async (req: AuthRequest, res: Response) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { userId: req.user!.id },
    });

    if (!driver) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    const updatedDriver = await driverService.updateDriverProfile(driver.id, req.body);
    res.json(updatedDriver);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update GPS location (driver only)
router.post(
  '/location',
  authenticate,
  authorize('driver'),
  [
    body('gpsLat').isFloat().withMessage('Valid GPS latitude is required'),
    body('gpsLng').isFloat().withMessage('Valid GPS longitude is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const driver = await prisma.driver.findUnique({
        where: { userId: req.user!.id },
      });

      if (!driver) {
        return res.status(404).json({ error: 'Driver profile not found' });
      }

      const location = await driverService.updateLocation({
        driverId: driver.id,
        gpsLat: req.body.gpsLat,
        gpsLng: req.body.gpsLng,
      });

      res.json(location);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all driver locations (admin/shipper only)
router.get('/locations', authenticate, authorize('admin', 'shipper'), async (req: AuthRequest, res: Response) => {
  try {
    const locations = await driverService.getDriverLocations();
    res.json(locations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get driver location history
router.get('/:id/location-history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const history = await driverService.getDriverLocationHistory(req.params.id, limit);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all drivers (admin/shipper only)
router.get('/', authenticate, authorize('admin', 'shipper'), async (req: AuthRequest, res: Response) => {
  try {
    const drivers = await driverService.getAllDrivers();
    res.json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify carrier (admin/shipper only)
router.post(
  '/:id/verify-carrier',
  authenticate,
  authorize('admin', 'shipper'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { mcNumber, dotNumber } = req.body;

      if (!mcNumber && !dotNumber) {
        return res.status(400).json({ error: 'MC Number or DOT Number is required' });
      }

      const verification = await carrierService.verifyCarrier({
        driverId: req.params.id,
        mcNumber,
        dotNumber,
      });

      res.json(verification);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get carrier verification history
router.get('/:id/verifications', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const verifications = await carrierService.getVerificationHistory(req.params.id);
    res.json(verifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest carrier verification
router.get('/:id/verification/latest', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const verification = await carrierService.getLatestVerification(req.params.id);
    res.json(verification);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
