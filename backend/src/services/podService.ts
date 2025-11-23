import prisma from '../config/db';
import { analyzeImageForFraud } from '../utils/aiVision';

interface CreatePodData {
  shipmentId: string;
  driverId: string;
  imageUrl: string;
  gpsLat: number;
  gpsLng: number;
  deviceTime: Date;
}

export class PodService {
  async createPod(data: CreatePodData) {
    const { shipmentId, driverId, imageUrl, gpsLat, gpsLng, deviceTime } = data;

    // Verificar que el shipment existe y pertenece al driver
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        driver: true,
      },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    if (shipment.driverId !== driverId) {
      throw new Error('Driver not assigned to this shipment');
    }

    // Analizar imagen con AI Vision
    let fraudScore = 0;
    let fraudReason = 'Analysis pending';
    let ocrText = '';
    let isApproved = true;

    try {
      const aiResult = await analyzeImageForFraud(imageUrl);
      fraudScore = aiResult.aiFraudScore;
      fraudReason = aiResult.aiReason;
      ocrText = aiResult.ocrText;

      // Si el fraud score es alto, marcar como no aprobado
      isApproved = fraudScore < 50;
    } catch (error) {
      console.error('AI Vision analysis failed:', error);
      // En caso de error, usar valores por defecto
      fraudScore = 0;
      fraudReason = 'AI analysis failed, manual review required';
      isApproved = false;
    }

    // Verificar distancia GPS (debe estar cerca de la dirección de entrega)
    const distance = this.calculateDistance(
      gpsLat,
      gpsLng,
      shipment.dropoffLat,
      shipment.dropoffLng
    );

    // Si está a más de 1km, aumentar fraud score
    if (distance > 1.0) {
      fraudScore += 30;
      fraudReason += ` | GPS location ${distance.toFixed(2)}km from delivery address`;
      isApproved = false;
    }

    // Crear POD event
    const podEvent = await prisma.podEvent.create({
      data: {
        shipmentId,
        driverId,
        imageUrl,
        gpsLat,
        gpsLng,
        deviceTime,
        fraudScore: Math.min(fraudScore, 100),
        fraudReason,
        ocrText,
        isApproved,
      },
      include: {
        shipment: {
          include: {
            shipper: {
              include: {
                user: true,
              },
            },
          },
        },
        driver: {
          include: {
            user: true,
          },
        },
      },
    });

    // Si el POD es aprobado automáticamente, actualizar status del shipment
    if (isApproved) {
      await prisma.shipment.update({
        where: { id: shipmentId },
        data: { status: 'delivered' },
      });
    }

    return podEvent;
  }

  async getPodEvents(shipmentId: string) {
    const podEvents = await prisma.podEvent.findMany({
      where: { shipmentId },
      include: {
        driver: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return podEvents;
  }

  async approvePod(podEventId: string) {
    const podEvent = await prisma.podEvent.update({
      where: { id: podEventId },
      data: { isApproved: true },
      include: {
        shipment: true,
      },
    });

    // Actualizar status del shipment a delivered
    await prisma.shipment.update({
      where: { id: podEvent.shipmentId },
      data: { status: 'delivered' },
    });

    return podEvent;
  }

  async rejectPod(podEventId: string, reason: string) {
    const podEvent = await prisma.podEvent.update({
      where: { id: podEventId },
      data: {
        isApproved: false,
        fraudReason: reason,
      },
    });

    return podEvent;
  }

  async getSuspiciousPods() {
    const suspiciousPods = await prisma.podEvent.findMany({
      where: {
        OR: [
          { fraudScore: { gte: 50 } },
          { isApproved: false },
        ],
      },
      include: {
        shipment: {
          include: {
            shipper: {
              include: {
                user: true,
              },
            },
          },
        },
        driver: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { fraudScore: 'desc' },
    });

    return suspiciousPods;
  }

  // Haversine formula para calcular distancia entre dos puntos GPS
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
