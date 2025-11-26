import prisma from '../config/db';

export async function createWallet(userId: string) {
  try {
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 0,
        pendingBalance: 0,
        totalEarnings: 0,
        totalSpent: 0,
      },
    });
    return wallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}

export async function getWallet(userId: string) {
  try {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!wallet) {
      await createWallet(userId);
      // Fetch again with transactions
      wallet = await prisma.wallet.findUnique({
        where: { userId },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
        },
      });
    }

    return wallet!
  } catch (error) {
    console.error('Error getting wallet:', error);
    throw error;
  }
}

export async function addFunds(
  userId: string,
  amount: number,
  description?: string,
  referenceId?: string
) {
  try {
    const wallet = await getWallet(userId);

    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'deposit',
        status: 'completed',
        amount,
        description: description || 'Funds added',
        referenceId,
        completedAt: new Date(),
      },
    });

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amount },
        totalEarnings: { increment: amount },
      },
    });

    return transaction;
  } catch (error) {
    console.error('Error adding funds:', error);
    throw error;
  }
}

export async function deductFunds(
  userId: string,
  amount: number,
  description?: string,
  referenceId?: string
) {
  try {
    const wallet = await getWallet(userId);

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'payment',
        status: 'completed',
        amount,
        description: description || 'Payment processed',
        referenceId,
        completedAt: new Date(),
      },
    });

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        totalSpent: { increment: amount },
      },
    });

    return transaction;
  } catch (error) {
    console.error('Error deducting funds:', error);
    throw error;
  }
}

export async function processShipmentPayment(
  shipmentId: string,
  shipperId: string,
  driverId: string
) {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    const platformFeeRate = 0.1;
    const platformFee = shipment.price * platformFeeRate;
    const driverPayout = shipment.price - platformFee;

    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        platformFee,
        driverPayout,
      },
    });

    const shipperUser = await prisma.shipper.findUnique({
      where: { id: shipperId },
      include: { user: true },
    });

    const driverUser = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { user: true },
    });

    if (!shipperUser || !driverUser) {
      throw new Error('User not found');
    }

    await deductFunds(
      shipperUser.userId,
      shipment.price,
      `Payment for shipment #${shipment.loadNumber || shipmentId.slice(0, 8)}`,
      shipmentId
    );

    await addFunds(
      driverUser.userId,
      driverPayout,
      `Earnings from shipment #${shipment.loadNumber || shipmentId.slice(0, 8)}`,
      shipmentId
    );

    return {
      success: true,
      amount: shipment.price,
      platformFee,
      driverPayout,
    };
  } catch (error) {
    console.error('Error processing shipment payment:', error);
    throw error;
  }
}

export async function applyPenalty(
  driverId: string,
  amount: number,
  reason: string,
  shipmentId?: string
) {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { user: true },
    });

    if (!driver) {
      throw new Error('Driver not found');
    }

    const penalty = await prisma.penalty.create({
      data: {
        driverId,
        shipmentId,
        type: 'policy_violation',
        amount,
        reason,
        description: reason,
        isActive: true,
        isPaid: false,
      },
    });

    const wallet = await getWallet(driver.userId);

    if (wallet.balance >= amount) {
      await deductFunds(driver.userId, amount, `Penalty: ${reason}`, penalty.id);

      await prisma.penalty.update({
        where: { id: penalty.id },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
      });
    }

    return penalty;
  } catch (error) {
    console.error('Error applying penalty:', error);
    throw error;
  }
}

export async function withdrawFunds(userId: string, amount: number) {
  try {
    const wallet = await getWallet(userId);

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'withdrawal',
        status: 'pending',
        amount,
        description: 'Withdrawal request',
      },
    });

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        pendingBalance: { increment: amount },
      },
    });

    setTimeout(async () => {
      try {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'completed',
            completedAt: new Date(),
          },
        });

        await prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            pendingBalance: { decrement: amount },
          },
        });
      } catch (err) {
        console.error('Error completing withdrawal:', err);
      }
    }, 5000);

    return transaction;
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    throw error;
  }
}
