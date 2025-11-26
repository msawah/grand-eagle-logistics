import { prisma } from '../config/db';

export async function getShipperDashboardStats(shipperId: string) {
  try {
    const totalShipments = await prisma.shipment.count({
      where: { shipperId },
    });

    const activeShipments = await prisma.shipment.count({
      where: {
        shipperId,
        status: { in: ['assigned', 'en_route', 'at_pickup', 'picked_up', 'in_transit'] },
      },
    });

    const completedShipments = await prisma.shipment.count({
      where: {
        shipperId,
        status: 'completed',
      },
    });

    const totalRevenue = await prisma.shipment.aggregate({
      where: { shipperId, status: 'completed' },
      _sum: { price: true },
    });

    const recentShipments = await prisma.shipment.findMany({
      where: { shipperId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        driver: {
          include: { user: true },
        },
      },
    });

    const shipmentsInTransit = await prisma.shipment.findMany({
      where: {
        shipperId,
        status: { in: ['en_route', 'in_transit', 'picked_up'] },
      },
      include: {
        driver: {
          include: {
            vehicleLocations: {
              orderBy: { capturedAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const monthlyStats = await getMonthlyShipmentStats(shipperId);

    return {
      totalShipments,
      activeShipments,
      completedShipments,
      totalRevenue: totalRevenue._sum.price || 0,
      recentShipments,
      shipmentsInTransit,
      monthlyStats,
    };
  } catch (error) {
    console.error('Error getting shipper stats:', error);
    throw error;
  }
}

export async function getDriverDashboardStats(driverId: string) {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        user: {
          include: { wallet: true },
        },
      },
    });

    const totalDeliveries = await prisma.shipment.count({
      where: { driverId, status: 'completed' },
    });

    const activeShipment = await prisma.shipment.findFirst({
      where: {
        driverId,
        status: { in: ['assigned', 'en_route', 'at_pickup', 'picked_up', 'in_transit'] },
      },
      include: {
        shipper: {
          include: { user: true },
        },
      },
    });

    const totalEarnings = await prisma.shipment.aggregate({
      where: { driverId, status: 'completed' },
      _sum: { driverPayout: true },
    });

    const pendingEarnings = await prisma.shipment.aggregate({
      where: {
        driverId,
        status: { in: ['delivered', 'completed'] },
      },
      _sum: { driverPayout: true },
    });

    const availableLoads = await prisma.shipment.findMany({
      where: {
        status: 'posted',
        driverId: null,
      },
      include: {
        shipper: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const recentReviews = await prisma.review.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        shipment: true,
      },
    });

    const penalties = await prisma.penalty.findMany({
      where: { driverId, isActive: true, isPaid: false },
      orderBy: { createdAt: 'desc' },
    });

    return {
      driver,
      totalDeliveries,
      activeShipment,
      totalEarnings: totalEarnings._sum.driverPayout || 0,
      pendingEarnings: pendingEarnings._sum.driverPayout || 0,
      availableLoads,
      recentReviews,
      penalties,
      walletBalance: driver?.user?.wallet?.balance || 0,
    };
  } catch (error) {
    console.error('Error getting driver stats:', error);
    throw error;
  }
}

export async function getAdminDashboardStats() {
  try {
    const totalUsers = await prisma.user.count();
    const totalShippers = await prisma.shipper.count();
    const totalDrivers = await prisma.driver.count();

    const activeShipments = await prisma.shipment.count({
      where: {
        status: { in: ['assigned', 'en_route', 'at_pickup', 'picked_up', 'in_transit'] },
      },
    });

    const completedToday = await prisma.shipment.count({
      where: {
        status: 'completed',
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const totalRevenue = await prisma.shipment.aggregate({
      where: { status: 'completed' },
      _sum: { price: true, platformFee: true },
    });

    const pendingPenalties = await prisma.penalty.count({
      where: { isActive: true, isPaid: false },
    });

    const recentShipments = await prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        shipper: { include: { user: true } },
        driver: { include: { user: true } },
      },
    });

    const topDrivers = await getTopPerformingDrivers();
    const topShippers = await getTopShippers();

    const platformStats = {
      totalUsers,
      totalShippers,
      totalDrivers,
      activeShipments,
      completedToday,
      totalRevenue: totalRevenue._sum.price || 0,
      platformFees: totalRevenue._sum.platformFee || 0,
      pendingPenalties,
    };

    return {
      platformStats,
      recentShipments,
      topDrivers,
      topShippers,
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw error;
  }
}

async function getMonthlyShipmentStats(shipperId: string) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const shipments = await prisma.shipment.findMany({
    where: {
      shipperId,
      createdAt: { gte: startOfMonth },
    },
  });

  const completed = shipments.filter((s) => s.status === 'completed').length;
  const inProgress = shipments.filter((s) =>
    ['assigned', 'en_route', 'in_transit', 'picked_up'].includes(s.status)
  ).length;

  return {
    total: shipments.length,
    completed,
    inProgress,
  };
}

async function getTopPerformingDrivers(limit: number = 10) {
  const drivers = await prisma.driver.findMany({
    orderBy: [
      { rating: 'desc' },
      { totalDeliveries: 'desc' },
    ],
    take: limit,
    include: {
      user: true,
    },
  });

  return drivers;
}

async function getTopShippers(limit: number = 10) {
  const shippers = await prisma.shipper.findMany({
    orderBy: [
      { totalShipments: 'desc' },
      { rating: 'desc' },
    ],
    take: limit,
    include: {
      user: true,
    },
  });

  return shippers;
}

export async function updatePerformanceMetrics(driverId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedShipments = await prisma.shipment.findMany({
      where: {
        driverId,
        status: 'completed',
        actualDeliveryTime: {
          gte: today,
        },
      },
    });

    const onTime = completedShipments.filter((s) => {
      if (!s.estimatedDeliveryTime || !s.actualDeliveryTime) return false;
      return s.actualDeliveryTime <= s.estimatedDeliveryTime;
    }).length;

    const totalEarnings = completedShipments.reduce((sum, s) => sum + (s.driverPayout || 0), 0);
    const totalMiles = completedShipments.reduce((sum, s) => sum + (s.distance || 0), 0);

    const reviews = await prisma.review.findMany({
      where: { driverId },
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const penalties = await prisma.penalty.findMany({
      where: {
        driverId,
        createdAt: { gte: today },
      },
    });

    const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);

    const efficiencyScore = completedShipments.length > 0
      ? (onTime / completedShipments.length) * 100
      : 0;

    await prisma.performanceMetric.upsert({
      where: {
        driverId_date: {
          driverId,
          date: today,
        },
      },
      update: {
        totalDeliveries: completedShipments.length,
        onTimeDeliveries: onTime,
        lateDeliveries: completedShipments.length - onTime,
        averageRating: avgRating,
        totalEarnings,
        totalMiles,
        totalPenalties,
        efficiencyScore,
        customerSatisfaction: avgRating * 20,
      },
      create: {
        driverId,
        date: today,
        totalDeliveries: completedShipments.length,
        onTimeDeliveries: onTime,
        lateDeliveries: completedShipments.length - onTime,
        averageRating: avgRating,
        totalEarnings,
        totalMiles,
        totalPenalties,
        efficiencyScore,
        customerSatisfaction: avgRating * 20,
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating performance metrics:', error);
    return false;
  }
}
