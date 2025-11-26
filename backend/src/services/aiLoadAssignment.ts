import OpenAI from 'openai';
import { config } from '../config/env';
import prisma from '../config/db';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

interface Driver {
  id: string;
  userId: string;
  fullName: string;
  rating: number;
  totalDeliveries: number;
  currentLat?: number;
  currentLng?: number;
  truckType?: string;
  truckCapacity?: number;
  isAvailable: boolean;
}

interface Shipment {
  id: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  cargoWeight?: number;
  cargoType?: string;
  price: number;
}

interface DriverScore {
  driverId: string;
  driver: Driver;
  score: number;
  distance: number;
  reasoning: string[];
}

export async function findBestDriverForShipment(
  shipmentId: string
): Promise<DriverScore | null> {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    const availableDrivers = await prisma.driver.findMany({
      where: {
        isAvailable: true,
        currentLat: { not: null },
        currentLng: { not: null },
      },
      include: {
        user: true,
      },
    });

    if (availableDrivers.length === 0) {
      return null;
    }

    const scoredDrivers: DriverScore[] = availableDrivers.map((driver: any) => {
      const distance = calculateDistance(
        driver.currentLat!,
        driver.currentLng!,
        shipment.pickupLat,
        shipment.pickupLng
      );

      const reasoning: string[] = [];
      let score = 100;

      if (distance <= 50) {
        score += 50;
        reasoning.push(`Very close to pickup (${distance.toFixed(1)} mi)`);
      } else if (distance <= 100) {
        score += 30;
        reasoning.push(`Moderate distance to pickup (${distance.toFixed(1)} mi)`);
      } else {
        score -= 10;
        reasoning.push(`Far from pickup (${distance.toFixed(1)} mi)`);
      }

      if (driver.rating >= 4.5) {
        score += 30;
        reasoning.push(`Excellent rating (${driver.rating.toFixed(1)})`);
      } else if (driver.rating >= 4.0) {
        score += 15;
        reasoning.push(`Good rating (${driver.rating.toFixed(1)})`);
      }

      if (driver.totalDeliveries > 100) {
        score += 20;
        reasoning.push(`Highly experienced (${driver.totalDeliveries} deliveries)`);
      } else if (driver.totalDeliveries > 50) {
        score += 10;
        reasoning.push(`Experienced (${driver.totalDeliveries} deliveries)`);
      }

      if (shipment.cargoWeight && driver.truckCapacity) {
        if (driver.truckCapacity >= shipment.cargoWeight) {
          score += 15;
          reasoning.push('Truck capacity sufficient for cargo');
        } else {
          score -= 50;
          reasoning.push('Truck capacity insufficient');
        }
      }

      return {
        driverId: driver.id,
        driver: driver as any,
        score,
        distance,
        reasoning,
      };
    });

    scoredDrivers.sort((a, b) => b.score - a.score);

    return scoredDrivers[0] || null;
  } catch (error) {
    console.error('Error finding best driver:', error);
    return null;
  }
}

export async function autoAssignShipment(shipmentId: string): Promise<boolean> {
  try {
    const bestMatch = await findBestDriverForShipment(shipmentId);

    if (!bestMatch || bestMatch.score < 80) {
      return false;
    }

    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        driverId: bestMatch.driverId,
        status: 'assigned',
        aiScoreData: {
          assignmentScore: bestMatch.score,
          reasoning: bestMatch.reasoning,
          distance: bestMatch.distance,
        },
      },
    });

    await prisma.driver.update({
      where: { id: bestMatch.driverId },
      data: { isAvailable: false },
    });

    return true;
  } catch (error) {
    console.error('Error auto-assigning shipment:', error);
    return false;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
