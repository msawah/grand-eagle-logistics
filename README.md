# 🦅 Grand Eagle Logistics

**Professional Logistics Management Platform**

A complete full-stack logistics platform with real-time GPS tracking, AI-powered fraud detection, and carrier verification.

---

## 🌟 Features

### Core Functionality
- ✅ **User Authentication** - JWT-based auth with role-based access control (Shipper, Driver, Admin)
- 📦 **Shipment Management** - Create, assign, and track shipments
- 🚛 **Real-Time GPS Tracking** - Live driver location updates
- 🤖 **AI Fraud Detection** - OpenAI Vision API analyzes POD photos
- 🔍 **Carrier Verification** - Automatic MC/DOT verification via FMCSA
- 📸 **Proof of Delivery** - Secure POD upload with GPS validation

### Tech Stack

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- OpenAI Vision API
- FMCSA Integration

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Axios

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd grand-eagle-logistics

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (.env):**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/grand_eagle_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# OpenAI (optional, for POD fraud detection)
OPENAI_API_KEY="your-openai-api-key"

# FMCSA (optional, for carrier verification)
FMCSA_API_URL="https://mobile.fmcsa.dot.gov/qc/services/carriers"
FMCSA_API_KEY="your-fmcsa-api-key"
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 3. Setup Database

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App will open on `http://localhost:3000`

---

## 📱 Usage

### 1. Register an Account
- Go to `http://localhost:3000/register`
- Choose **Shipper** or **Driver**
- Fill in your details

### 2. As a Shipper
- Create new shipments with pickup/dropoff locations
- Assign drivers to shipments
- Track shipment status in real-time
- View POD submissions

### 3. As a Driver
- View available shipments
- Accept assigned shipments
- Enable GPS tracking
- Upload POD when delivery is complete

---

## 🗂️ Project Structure

```
grand-eagle-logistics/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts            # Environment config
│   │   │   └── db.ts             # Database connection
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.ts           # Auth endpoints
│   │   │   ├── shipments.ts      # Shipment & POD endpoints
│   │   │   └── drivers.ts        # Driver & carrier endpoints
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── shipmentService.ts
│   │   │   ├── driverService.ts
│   │   │   ├── podService.ts
│   │   │   └── carrierVerificationService.ts
│   │   ├── utils/
│   │   │   └── aiVision.ts       # OpenAI Vision integration
│   │   └── index.ts              # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           # Landing page
    │   │   ├── login/page.tsx
    │   │   ├── register/page.tsx
    │   │   └── dashboard/
    │   │       ├── shipper/page.tsx
    │   │       └── driver/page.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx    # Auth state management
    │   └── lib/
    │       └── api.ts             # API client
    ├── package.json
    └── next.config.mjs
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/profile` - Get user profile

### Shipments
- `GET /api/v1/shipments` - Get all shipments (filtered by role)
- `GET /api/v1/shipments/available` - Get available shipments (driver)
- `GET /api/v1/shipments/:id` - Get shipment details
- `POST /api/v1/shipments` - Create shipment (shipper)
- `POST /api/v1/shipments/:id/assign` - Assign driver (shipper)
- `PATCH /api/v1/shipments/:id/status` - Update status
- `POST /api/v1/shipments/:id/pod` - Upload POD (driver)
- `GET /api/v1/shipments/:id/pod-events` - Get POD events

### Drivers
- `GET /api/v1/drivers` - Get all drivers (admin/shipper)
- `GET /api/v1/drivers/profile` - Get driver profile
- `POST /api/v1/drivers/location` - Update GPS location (driver)
- `GET /api/v1/drivers/locations` - Get all driver locations
- `POST /api/v1/drivers/:id/verify-carrier` - Verify carrier MC/DOT

---

## 🚢 Deployment

### Deploy to Railway

1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Deploy backend:
   - Connect GitHub repo
   - Set environment variables
   - Build command: `cd backend && npm install && npm run prisma:generate && npm run build`
   - Start command: `cd backend && npm run prisma:deploy && npm start`
5. Deploy frontend:
   - Connect GitHub repo
   - Set `NEXT_PUBLIC_API_URL` to backend URL
   - Auto-deploys

### Deploy to Render

1. Create account at [render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service for backend:
   - Root directory: `backend`
   - Build: `npm install && npm run prisma:generate && npm run build`
   - Start: `npm run prisma:deploy && npm start`
4. Create Web Service for frontend:
   - Root directory: `frontend`
   - Build: `npm install && npm run build`
   - Start: `npm start`

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ GPS location validation for POD
- ✅ AI fraud detection for POD photos
- ✅ Carrier verification via FMCSA

---

## 🤝 Contributing

This is a complete production-ready logistics platform. Feel free to customize for your specific needs!

---

## 📄 License

MIT License - Feel free to use for commercial or personal projects

---

## 🆘 Support

For issues or questions, please check:
1. Backend logs: Check console output
2. Database: Use `npm run prisma:studio`
3. API health: `GET /api/v1/health`

---

## 🎯 Next Steps

1. **Add OpenAI API Key** - Enable real AI fraud detection
2. **Add FMCSA API Key** - Enable real carrier verification
3. **Configure Cloud Storage** - For POD image uploads (AWS S3, Cloudinary)
4. **Add Email Notifications** - Notify users of shipment updates
5. **Add SMS Notifications** - Real-time alerts via Twilio
6. **Add Mobile Apps** - React Native for iOS/Android

---

**Built with ❤️ for Grand Eagle Logistics**

🦅 **Soar High, Deliver Fast!**
