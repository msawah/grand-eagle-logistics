import prisma from '../config/db';

interface UpdateLocationData {
  driverId: string;
  gpsLat: number;
  gpsLng: number;
}

export class DriverService {
  async getDriverProfile(userId: string) {
    const driver = await prisma.driver.findUnique({
      where: { userId },
      include: {
        user: true,
        shipments: {
          where: {
            status: {
              in: ['assigned', 'en_route'],
            },
          },
          include: {
            shipper: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!driver) {
      throw new Error('Driver not found');
    }

    return driver;
  }

  async updateLocation(data: UpdateLocationData) {
    const { driverId, gpsLat, gpsLng } = data;

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new Error('Driver not found');
    }

    // Guardar ubicación en histórico
    const location = await prisma.vehicleLocation.create({
      data: {
        driverId,
        gpsLat,
        gpsLng,
      },
    });

    return location;
  }

  async getDriverLocations() {
    // Obtener la última ubicación de cada driver
    const drivers = await prisma.driver.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        vehicleLocations: {
          orderBy: { capturedAt: 'desc' },
          take: 1,
        },
        shipments: {
          where: {
            status: {
              in: ['assigned', 'en_route'],
            },
          },
          select: {
            id: true,
            status: true,
            pickupAddress: true,
            dropoffAddress: true,
          },
        },
      },
    });

    return drivers.map((driver) => ({
      id: driver.id,
      name: driver.user.name,
      email: driver.user.email,
      fullName: driver.fullName,
      phone: driver.phone,
      truckType: driver.truckType,
      currentLocation: driver.vehicleLocations[0] || null,
      activeShipments: driver.shipments,
    }));
  }

  async getDriverLocationHistory(driverId: string, limit: number = 50) {
    const locations = await prisma.vehicleLocation.findMany({
      where: { driverId },
      orderBy: { capturedAt: 'desc' },
      take: limit,
    });

    return locations;
  }

  async getAllDrivers() {
    const drivers = await prisma.driver.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        shipments: {
          where: {
            status: {
              in: ['assigned', 'en_route'],
            },
          },
        },
        vehicleLocations: {
          orderBy: { capturedAt: 'desc' },
          take: 1,
        },
      },
    });

    return drivers;
  }

  async updateDriverProfile(driverId: string, data: any) {
    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        truckType: data.truckType,
        mcNumber: data.mcNumber,
        dotNumber: data.dotNumber,
      },
      include: {
        user: true,
      },
    });

    return driver;
  }
}
