import prisma from '../config/db';

interface CreateShipmentData {
  shipperId: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  price: number;
}

interface AssignDriverData {
  shipmentId: string;
  driverId: string;
}

export class ShipmentService {
  async createShipment(data: CreateShipmentData) {
    const shipment = await prisma.shipment.create({
      data: {
        shipperId: data.shipperId,
        pickupAddress: data.pickupAddress,
        dropoffAddress: data.dropoffAddress,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        dropoffLat: data.dropoffLat,
        dropoffLng: data.dropoffLng,
        price: data.price,
        status: 'created',
      },
      include: {
        shipper: {
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
    });

    return shipment;
  }

  async getShipments(userId: string, role: string) {
    if (role === 'shipper') {
      const shipper = await prisma.shipper.findUnique({
        where: { userId },
      });

      if (!shipper) {
        throw new Error('Shipper profile not found');
      }

      return prisma.shipment.findMany({
        where: { shipperId: shipper.id },
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
    }

    if (role === 'driver') {
      const driver = await prisma.driver.findUnique({
        where: { userId },
      });

      if (!driver) {
        throw new Error('Driver profile not found');
      }

      return prisma.shipment.findMany({
        where: { driverId: driver.id },
        include: {
          shipper: {
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
    }

    // Admin can see all
    return prisma.shipment.findMany({
      include: {
        shipper: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
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
  }

  async getShipmentById(shipmentId: string, userId: string, role: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        shipper: {
          include: {
            user: true,
          },
        },
        driver: {
          include: {
            user: true,
          },
        },
        podEvents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Verificar permisos
    if (role === 'shipper') {
      const shipper = await prisma.shipper.findUnique({
        where: { userId },
      });

      if (shipment.shipperId !== shipper?.id) {
        throw new Error('Unauthorized');
      }
    }

    if (role === 'driver') {
      const driver = await prisma.driver.findUnique({
        where: { userId },
      });

      if (shipment.driverId !== driver?.id) {
        throw new Error('Unauthorized');
      }
    }

    return shipment;
  }

  async assignDriver(data: AssignDriverData) {
    const { shipmentId, driverId } = data;

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    if (shipment.status !== 'created') {
      throw new Error('Shipment cannot be assigned');
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new Error('Driver not found');
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        driverId,
        status: 'assigned',
      },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        shipper: {
          include: {
            user: true,
          },
        },
      },
    });

    return updatedShipment;
  }

  async updateShipmentStatus(shipmentId: string, status: string, userId: string, role: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Verificar permisos
    if (role === 'driver') {
      const driver = await prisma.driver.findUnique({
        where: { userId },
      });

      if (shipment.driverId !== driver?.id) {
        throw new Error('Unauthorized');
      }
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: status as any },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        shipper: {
          include: {
            user: true,
          },
        },
      },
    });

    return updatedShipment;
  }

  async getAvailableShipments() {
    return prisma.shipment.findMany({
      where: {
        status: 'created',
        driverId: null,
      },
      include: {
        shipper: {
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
  }
}
