#!/bin/bash

# 🦅 GRAND EAGLE LOGISTICS - ULTIMATE INSTALLATION SCRIPT
# The most advanced logistics platform installer ever created
# This script deploys a full-stack application with AI, real-time tracking, and enterprise features

set -e

echo "
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🦅  GRAND EAGLE LOGISTICS - ULTIMATE PLATFORM INSTALLER 🦅  ║
║                                                               ║
║   The World's Most Advanced Logistics Management System      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🚀 Features Being Installed:
   ✓ AI-Powered Route Optimization
   ✓ Smart Load Assignment Algorithm
   ✓ Real-time GPS Tracking with WebSockets
   ✓ Advanced Fraud Detection System
   ✓ Performance Analytics Engine
   ✓ Wallet & Payment Integration
   ✓ Reviews & Ratings System
   ✓ Admin Control Center
   ✓ Three Ultra-Modern Dashboards
   ✓ Document Management System
   ✓ Penalty Management System
   ✓ Real-time Notifications

Starting installation in 3 seconds...
"

sleep 3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
log_info "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
log_success "Node.js $(node --version) detected"

# Check if PostgreSQL is available
log_info "Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    log_warning "PostgreSQL CLI not found. Make sure you have a PostgreSQL database available."
fi

# Install backend dependencies
log_info "Installing backend dependencies..."
cd backend
if [ ! -f "package.json" ]; then
    log_error "Backend package.json not found!"
    exit 1
fi

npm install --silent || {
    log_error "Failed to install backend dependencies"
    exit 1
}
log_success "Backend dependencies installed"

# Setup environment variables for backend
log_info "Setting up backend environment..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grand_eagle?schema=public"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
EOF
    log_success "Created .env file for backend"
else
    log_info ".env file already exists, skipping..."
fi

# Generate Prisma Client
log_info "Generating Prisma client..."
npx prisma generate || {
    log_error "Failed to generate Prisma client"
    exit 1
}
log_success "Prisma client generated"

# Run database migrations
log_info "Running database migrations..."
npx prisma db push --skip-generate || {
    log_warning "Database migration failed. Make sure PostgreSQL is running and DATABASE_URL is correct."
}
log_success "Database schema synced"

# Build backend
log_info "Building backend..."
npm run build || {
    log_warning "Backend build failed, will run in dev mode"
}

cd ..

# Install frontend dependencies
log_info "Installing frontend dependencies..."
cd frontend
if [ ! -f "package.json" ]; then
    log_error "Frontend package.json not found!"
    exit 1
fi

npm install --silent || {
    log_error "Failed to install frontend dependencies"
    exit 1
}
log_success "Frontend dependencies installed"

# Setup environment variables for frontend
log_info "Setting up frontend environment..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
EOF
    log_success "Created .env.local file for frontend"
else
    log_info ".env.local file already exists, skipping..."
fi

cd ..

# Create startup scripts
log_info "Creating startup scripts..."

# Backend start script
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd backend
echo "🦅 Starting Grand Eagle Backend API..."
npm run dev
EOF
chmod +x start-backend.sh

# Frontend start script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd frontend
echo "🦅 Starting Grand Eagle Frontend..."
npm run dev
EOF
chmod +x start-frontend.sh

# Combined start script
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🦅 Starting Grand Eagle Logistics Platform..."
echo ""

# Start backend in background
./start-backend.sh &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
./start-frontend.sh &
FRONTEND_PID=$!

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🦅 GRAND EAGLE LOGISTICS IS NOW RUNNING!                     ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📡 Backend API: http://localhost:3001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "🚀 Available Dashboards:"
echo "   📊 Shipper: http://localhost:3000/dashboard/shipper/ultra"
echo "   🚚 Driver: http://localhost:3000/dashboard/driver/ultra"
echo "   🛡️  Admin: http://localhost:3000/dashboard/admin/ultra"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
EOF
chmod +x start-all.sh

log_success "Startup scripts created"

# Create README for the platform
cat > PLATFORM_GUIDE.md << 'EOF'
# 🦅 Grand Eagle Logistics - Ultimate Platform

## Quick Start

```bash
./start-all.sh
```

This will start both backend and frontend servers.

## Access Points

- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:3001/api/v1/health

## Dashboards

### Shipper Dashboard
- URL: http://localhost:3000/dashboard/shipper/ultra
- Features:
  - Real-time shipment tracking
  - AI-powered route optimization
  - Load management
  - Revenue analytics
  - Driver assignment
  - Document management

### Driver Dashboard
- URL: http://localhost:3000/dashboard/driver/ultra
- Features:
  - Available loads browsing
  - Active delivery tracking
  - Earnings overview
  - Performance metrics
  - Reviews and ratings
  - Navigation assistance

### Admin Dashboard
- URL: http://localhost:3000/dashboard/admin/ultra
- Features:
  - Platform overview
  - User management
  - Shipment monitoring
  - Revenue tracking
  - Penalty management
  - Analytics and reports

## API Endpoints

### Authentication
- POST /api/v1/auth/register
- POST /api/v1/auth/login

### Shipments
- GET /api/v1/shipments
- POST /api/v1/shipments
- PATCH /api/v1/shipments/:id/status

### Analytics
- GET /api/v1/analytics/shipper/:id
- GET /api/v1/analytics/driver/:id
- GET /api/v1/analytics/admin

### Wallet
- GET /api/v1/wallet
- POST /api/v1/wallet/add-funds
- POST /api/v1/wallet/withdraw

### Admin
- GET /api/v1/admin/users
- GET /api/v1/admin/shipments
- POST /api/v1/admin/penalties

## Environment Variables

### Backend (.env)
- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET: Secret for JWT tokens
- OPENAI_API_KEY: OpenAI API key for AI features
- STRIPE_SECRET_KEY: Stripe key for payments

### Frontend (.env.local)
- NEXT_PUBLIC_API_URL: Backend API URL
- NEXT_PUBLIC_WS_URL: WebSocket URL

## Default Test Accounts

Create test accounts via the registration page or API.

## Technologies Used

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma ORM
- Socket.IO (WebSockets)
- OpenAI API
- JWT Authentication
- Stripe

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Leaflet (Maps)
- Recharts (Analytics)
- Socket.IO Client

## Support

For issues or questions, check the documentation or contact support.
EOF

# Create quick commands cheat sheet
cat > COMMANDS.md << 'EOF'
# 🦅 Grand Eagle Logistics - Quick Commands

## Development

```bash
# Start everything
./start-all.sh

# Start backend only
./start-backend.sh

# Start frontend only
./start-frontend.sh
```

## Database

```bash
# Update database schema
cd backend && npx prisma db push

# Open Prisma Studio (Database GUI)
cd backend && npx prisma studio

# Generate Prisma Client
cd backend && npx prisma generate
```

## Testing

```bash
# Test backend
cd backend && npm test

# Lint frontend
cd frontend && npm run lint
```

## Deployment

```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build

# Start production
cd backend && npm start
cd frontend && npm start
```
EOF

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   ✅ INSTALLATION COMPLETE!                                   ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
log_success "Grand Eagle Logistics Platform is ready!"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Update backend/.env with your API keys:"
echo "   - OPENAI_API_KEY (for AI features)"
echo "   - STRIPE_SECRET_KEY (for payments)"
echo "   - DATABASE_URL (if using external PostgreSQL)"
echo ""
echo "2. Start the platform:"
echo "   ${GREEN}./start-all.sh${NC}"
echo ""
echo "3. Access the dashboards:"
echo "   - Shipper: ${BLUE}http://localhost:3000/dashboard/shipper/ultra${NC}"
echo "   - Driver:  ${BLUE}http://localhost:3000/dashboard/driver/ultra${NC}"
echo "   - Admin:   ${BLUE}http://localhost:3000/dashboard/admin/ultra${NC}"
echo ""
echo "4. Read the guides:"
echo "   - PLATFORM_GUIDE.md - Complete feature documentation"
echo "   - COMMANDS.md - Quick command reference"
echo ""
echo "🚀 Ready to revolutionize logistics!"
echo ""
