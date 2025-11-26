#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "🦅  GRAND EAGLE LOGISTICS - ULTIMATE PLATFORM"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Starting all services..."
echo ""

# Function to handle Ctrl+C
cleanup() {
  echo ""
  echo "🛑 Shutting down all services..."
  kill $(jobs -p) 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "🔧 Starting Backend (Port 3001)..."
cd backend
if [ ! -d "node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  npm install
fi
if [ ! -d "node_modules/.prisma" ]; then
  echo "🔧 Generating Prisma client..."
  npx prisma generate
fi
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo ""
echo "🎨 Starting Frontend (Port 3000)..."
cd frontend
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅  ALL SERVICES STARTED!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Frontend:  http://localhost:3000"
echo "🔌 Backend:   http://localhost:3001"
echo "📡 Health:    http://localhost:3001/api/v1/health"
echo ""
echo "📊 Dashboards:"
echo "   Shipper:   http://localhost:3000/dashboard/shipper/ultra"
echo "   Driver:    http://localhost:3000/dashboard/driver/ultra"
echo "   Admin:     http://localhost:3000/dashboard/admin/ultra"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "Press Ctrl+C to stop all services"
echo "════════════════════════════════════════════════════════════"
echo ""

# Wait for all background jobs
wait
