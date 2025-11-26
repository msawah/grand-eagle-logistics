import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config/env';
import { connectDatabase } from './config/db';
import authRoutes from './routes/auth';
import shipmentRoutes from './routes/shipments';
import driverRoutes from './routes/drivers';
import analyticsRoutes from './routes/analytics';
import walletRoutes from './routes/wallet';
import notificationRoutes from './routes/notifications';
import adminRoutes from './routes/admin';
import reviewRoutes from './routes/reviews';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
});

// Make io available globally
export { io };

// ---------- Middlewares ----------
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------- Health / Status ----------
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    apiVersion: 'v1',
    uptimeSeconds: Math.round(process.uptime()),
    message: '🦅 Grand Eagle Logistics API is running',
    timestamp: new Date().toISOString(),
    features: [
      'AI Route Optimization',
      'Smart Load Assignment',
      'Real-time Tracking',
      'Fraud Detection',
      'Performance Analytics',
      'Wallet System',
      'Reviews & Ratings',
      'WebSocket Support',
    ],
  });
});

app.get('/api/v1/status', (_req: Request, res: Response) => {
  res.json({
    apiVersion: 'v1',
    uptimeSeconds: Math.round(process.uptime()),
    message: 'Grand Eagle API base online',
  });
});

// ---------- API Routes ----------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/shipments', shipmentRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// ---------- WebSocket Connection ----------
io.on('connection', (socket) => {
  console.log(`✅ WebSocket client connected: ${socket.id}`);

  socket.on('join-room', (userId: string) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('join-shipment', (shipmentId: string) => {
    socket.join(`shipment-${shipmentId}`);
    console.log(`📦 Client joined shipment room: ${shipmentId}`);
  });

  socket.on('location-update', (data: { driverId: string; lat: number; lng: number }) => {
    io.emit('driver-location', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ WebSocket client disconnected: ${socket.id}`);
  });
});

// ---------- 404 Handler ----------
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
  });
});

// ---------- Error Handler ----------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong',
  });
});

// ---------- Server Startup ----------
async function main() {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar servidor
    httpServer.listen(config.port, () => {
      console.log('');
      console.log('🦅 ═══════════════════════════════════════════════════════');
      console.log('   GRAND EAGLE LOGISTICS - ULTIMATE PLATFORM');
      console.log('   ═══════════════════════════════════════════════════════');
      console.log(`   🚀 Server running on port ${config.port}`);
      console.log(`   🌍 Environment: ${config.nodeEnv}`);
      console.log(`   📡 Health check: http://localhost:${config.port}/api/v1/health`);
      console.log(`   🔌 WebSocket enabled`);
      console.log('   ═══════════════════════════════════════════════════════');
      console.log('   Features:');
      console.log('   ✓ AI Route Optimization');
      console.log('   ✓ Smart Load Assignment');
      console.log('   ✓ Real-time Tracking');
      console.log('   ✓ Fraud Detection');
      console.log('   ✓ Performance Analytics');
      console.log('   ✓ Wallet & Payments');
      console.log('   ✓ Reviews & Ratings');
      console.log('   ✓ Admin Dashboard');
      console.log('   ═══════════════════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ---------- Graceful Shutdown ----------
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// ---------- Start the Application ----------
main().catch((error) => {
  console.error('💥 Fatal error starting server:', error);
  process.exit(1);
});
