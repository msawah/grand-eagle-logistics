import prisma from '../config/db';

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: any
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: type as any,
        title,
        message,
        data: data || {},
        isRead: false,
      },
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function getNotifications(userId: string, limit: number = 50) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
}

export async function markAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

export async function markAllAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
}

export async function notifyShipmentUpdate(
  shipmentId: string,
  status: string
) {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        shipper: { include: { user: true } },
        driver: { include: { user: true } },
      },
    });

    if (!shipment) return;

    const statusMessages: Record<string, string> = {
      assigned: 'A driver has been assigned to your shipment',
      en_route: 'Driver is en route to pickup location',
      picked_up: 'Cargo has been picked up',
      in_transit: 'Shipment is in transit',
      delivered: 'Shipment has been delivered',
      completed: 'Shipment completed successfully',
    };

    const message = statusMessages[status] || `Shipment status updated to ${status}`;

    await createNotification(
      shipment.shipper.userId,
      'shipment_update',
      'Shipment Update',
      message,
      { shipmentId, status }
    );

    if (shipment.driver) {
      await createNotification(
        shipment.driver.userId,
        'shipment_update',
        'Shipment Update',
        message,
        { shipmentId, status }
      );
    }
  } catch (error) {
    console.error('Error notifying shipment update:', error);
  }
}

export async function notifyPaymentReceived(userId: string, amount: number, shipmentId?: string) {
  try {
    await createNotification(
      userId,
      'payment_received',
      'Payment Received',
      `You received $${amount.toFixed(2)}`,
      { amount, shipmentId }
    );
  } catch (error) {
    console.error('Error notifying payment:', error);
  }
}

export async function notifyPenaltyApplied(
  userId: string,
  amount: number,
  reason: string
) {
  try {
    await createNotification(
      userId,
      'penalty_applied',
      'Penalty Applied',
      `A penalty of $${amount.toFixed(2)} has been applied: ${reason}`,
      { amount, reason }
    );
  } catch (error) {
    console.error('Error notifying penalty:', error);
  }
}
