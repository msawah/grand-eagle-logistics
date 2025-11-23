import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDatabase } from './config/db';
import authRoutes from './routes/auth';
import shipmentRoutes from './routes/shipments';
import driverRoutes from './routes/drivers';

const app = express();

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
    app.listen(config.port, () => {
      console.log('');
      console.log('🦅 ═══════════════════════════════════════════════════════');
      console.log('   GRAND EAGLE LOGISTICS API');
      console.log('   ═══════════════════════════════════════════════════════');
      console.log(`   🚀 Server running on port ${config.port}`);
      console.log(`   🌍 Environment: ${config.nodeEnv}`);
      console.log(`   📡 Health check: http://localhost:${config.port}/api/v1/health`);
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
