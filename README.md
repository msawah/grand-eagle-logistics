# 🦅 Grand Eagle Logistics

<div align="center">

**Professional AI-Powered Logistics Management Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

*Sistema completo de gestión logística con IA, tracking en tiempo real, detección de fraude, y verificación de transportistas*

[Características](#-características) • [Arquitectura](#-arquitectura) • [Quick Start](#-quick-start) • [Deploy](#-deployment)

</div>

---

## 📸 Dashboard Preview

```
┌─────────────────────────────────────────────────────────────────┐
│  🦅 Shipper Dashboard                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📊 Real-time Map          📈 Statistics         🤖 AI Chat      │
│  ├─ GPS Tracking           ├─ Total Revenue     ├─ Smart Assist │
│  ├─ Route Planning         ├─ In Transit        └─ Q&A System   │
│  └─ Live Updates           └─ Analytics                          │
│                                                                   │
│  📦 Available Loads        📜 Shipment History  🔐 Security      │
│  ├─ Posted                 ├─ Delivered         ├─ Driver        │
│  ├─ Assigned               ├─ Assigned          ├─ Shipper       │
│  ├─ En-route               ├─ Picked Up         ├─ Admin         │
│  └─ Delivered              └─ Created           └─ Auditor       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Características

### 🚀 Core Features
- ✅ **Real-Time GPS Tracking** - Seguimiento en vivo de conductores
- 🤖 **AI-Powered Features** - Asignación inteligente, detección de fraude, Q&A
- 📦 **Gestión de Envíos** - Crear, asignar, y rastrear shipments
- 🔐 **Sistema de Roles** - Shipper, Driver, Admin, Auditor
- 💰 **Wallet & Payments** - Sistema de billetera integrado
- 📸 **Proof of Delivery (POD)** - Validación con GPS + AI Vision
- 🔍 **Carrier Verification** - Verificación automática MC/DOT via FMCSA
- 📊 **Analytics Dashboard** - Métricas en tiempo real
- 🗺️ **Route Planning** - Optimización de rutas con IA
- ⚡ **ETA Prediction** - Predicción de tiempo de llegada
- 🛡️ **Fraud Detection** - Detección de fraude en POD con OpenAI Vision
- 📱 **Notificaciones** - Sistema de notificaciones en tiempo real

### 🤖 AI Capabilities
- **Document Parsing** - Análisis automático de documentos
- **Load Assignment** - Asignación inteligente de cargas
- **Route Optimization** - Optimización de rutas
- **Performance Analysis** - Análisis de rendimiento
- **Driver Q&A** - Asistente virtual para conductores
- **Report Generation** - Generación automática de reportes

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                            FRONTEND                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📊 Shipper Dashboard    🚛 Driver Dashboard    ⚙️  Admin Dashboard │
│  🗺️  Real-Time Map        💬 AI Chat            📄 Document System  │
│  🚨 Penalty System       📜 Shipment History    💳 Wallet & Payments│
│  👤 Driver Profile                                                   │
│                                                                      │
│                    Next.js 15 + React 19 + TypeScript               │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           │ REST API
                           │
┌──────────────────────────┴──────────────────────────────────────────┐
│                           BACKEND                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🗄️  PostgreSQL          🧠 LLM Engine         ⚙️  Rules Engine     │
│  🔒 Data Encryption      🌐 External API       📋 Task Queue        │
│  📊 Event Logging                                                    │
│                                                                      │
│                   Node.js + Express + TypeScript + Prisma           │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           │
┌──────────────────────────┴──────────────────────────────────────────┐
│                          AI MODEL                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🧾 Document Parsing     🎯 Load Assignment    🛡️  Fraud Detection  │
│  🗺️  Route Planning       ⏱️  ETA Prediction     📊 Report Generation│
│  💬 Driver Q&A           📈 Performance Analysis                     │
│                                                                      │
│                          OpenAI GPT-4 Vision                        │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         INTEGRATIONS                                 │
├──────────────────────────────────────────────────────────────────────┤
│  🗺️  Maps API (Google)   💳 Payment Gateway    ⚙️  Admin Panel      │
│  👁️  Auditor System      🔍 FMCSA API          📧 Email/SMS         │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                        SECURITY & ROLES                              │
├──────────────────────────────────────────────────────────────────────┤
│  🚛 Driver    📦 Shipper    ⚙️  Admin    👁️  Auditor                │
│  JWT Authentication + Role-Based Access Control (RBAC)              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
```typescript
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- OpenAI GPT-4 Vision API
- FMCSA Integration
- WebSocket (Real-time updates)
```

### Frontend
```typescript
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Axios
- React Context (State Management)
```

### AI & Integrations
```typescript
- OpenAI GPT-4 Vision
- Google Maps API
- FMCSA API (Carrier Verification)
- Payment Gateway Integration
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key (para features AI)
- FMCSA API Key (para carrier verification)

### 1️⃣ Clonar e Instalar

```bash
# Clonar repositorio
git clone https://github.com/msawah/grand-eagle-logistics.git
cd grand-eagle-logistics

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 2️⃣ Configurar Variables de Entorno

**Backend (`backend/.env`):**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/grand_eagle_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# OpenAI (para AI features)
OPENAI_API_KEY="sk-..."

# FMCSA (para carrier verification)
FMCSA_API_URL="https://mobile.fmcsa.dot.gov/qc/services/carriers"
FMCSA_API_KEY="your-key"
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 3️⃣ Setup Database

```bash
cd backend

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio
npm run prisma:studio
```

### 4️⃣ Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
🚀 Backend: `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
🌐 Frontend: `http://localhost:3000`

---

## 📱 Uso

### Como Shipper
1. Registrarse como **Shipper**
2. Crear nuevos shipments con pickup/dropoff
3. Asignar drivers
4. Rastrear en tiempo real
5. Ver POD y validación con IA

### Como Driver
1. Registrarse como **Driver**
2. Ver shipments disponibles
3. Aceptar asignaciones
4. Activar GPS tracking
5. Subir POD al completar entrega

### Como Admin
1. Acceso total al sistema
2. Gestionar usuarios
3. Ver analytics
4. Gestionar penalties
5. Auditar transacciones

---

## 📂 Estructura del Proyecto

```
grand-eagle-logistics/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma              # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts                 # Environment config
│   │   │   └── db.ts                  # Database connection
│   │   ├── middleware/
│   │   │   └── auth.ts                # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.ts                # Authentication
│   │   │   ├── shipments.ts           # Shipment management
│   │   │   ├── drivers.ts             # Driver operations
│   │   │   ├── wallet.ts              # Wallet & payments
│   │   │   ├── admin.ts               # Admin operations
│   │   │   ├── analytics.ts           # Analytics
│   │   │   ├── notifications.ts       # Notifications
│   │   │   └── reviews.ts             # Reviews & ratings
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── shipmentService.ts
│   │   │   ├── driverService.ts
│   │   │   ├── podService.ts
│   │   │   ├── walletService.ts
│   │   │   ├── analyticsService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── carrierVerificationService.ts
│   │   │   ├── aiVision.ts            # OpenAI Vision
│   │   │   ├── aiRouteOptimization.ts # Route optimization
│   │   │   └── aiLoadAssignment.ts    # Load assignment AI
│   │   └── index.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                     # Landing page
│   │   │   ├── login/page.tsx               # Login
│   │   │   ├── register/page.tsx            # Register
│   │   │   └── dashboard/
│   │   │       ├── shipper/
│   │   │       │   ├── page.tsx             # Shipper dashboard
│   │   │       │   └── ultra/page.tsx       # Shipper ultra view
│   │   │       ├── driver/
│   │   │       │   ├── page.tsx             # Driver dashboard
│   │   │       │   ├── ultra/page.tsx       # Driver ultra view
│   │   │       │   └── pod/[id]/page.tsx    # POD upload
│   │   │       └── admin/
│   │   │           └── ultra/page.tsx       # Admin dashboard
│   │   ├── components/
│   │   │   └── Map.tsx                      # Real-time map
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx              # Auth state
│   │   └── lib/
│   │       └── api.ts                       # API client
│   └── package.json
│
├── docs/                                     # Documentación adicional
└── README.md                                 # Este archivo
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register          - Registrar usuario
POST   /api/v1/auth/login             - Login
GET    /api/v1/auth/profile           - Obtener perfil
```

### Shipments
```
GET    /api/v1/shipments              - Listar shipments
GET    /api/v1/shipments/available    - Shipments disponibles
GET    /api/v1/shipments/:id          - Detalle de shipment
POST   /api/v1/shipments              - Crear shipment
POST   /api/v1/shipments/:id/assign   - Asignar driver
PATCH  /api/v1/shipments/:id/status   - Actualizar estado
POST   /api/v1/shipments/:id/pod      - Subir POD
GET    /api/v1/shipments/:id/pod-events - Eventos de POD
```

### Drivers
```
GET    /api/v1/drivers                - Listar drivers
GET    /api/v1/drivers/profile        - Perfil del driver
POST   /api/v1/drivers/location       - Actualizar GPS
GET    /api/v1/drivers/locations      - Ubicaciones GPS
POST   /api/v1/drivers/:id/verify-carrier - Verificar carrier
```

### Wallet
```
GET    /api/v1/wallet/balance         - Balance
POST   /api/v1/wallet/deposit         - Depositar
POST   /api/v1/wallet/withdraw        - Retirar
GET    /api/v1/wallet/transactions    - Historial
```

### Analytics
```
GET    /api/v1/analytics/dashboard    - Dashboard metrics
GET    /api/v1/analytics/revenue      - Revenue analytics
GET    /api/v1/analytics/performance  - Performance metrics
```

### Notifications
```
GET    /api/v1/notifications          - Listar notificaciones
PATCH  /api/v1/notifications/:id/read - Marcar como leída
POST   /api/v1/notifications/send     - Enviar notificación
```

---

## 🚢 Deployment

### Deploy a Render.com

#### Backend
```bash
Root Directory: backend
Build Command: npm install && npm run prisma:generate && npm run build
Start Command: npm run prisma:deploy && npm start
```

#### Frontend
```bash
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npm start
```

#### Database
- PostgreSQL 14+
- Configurar `DATABASE_URL` en las variables de entorno

### Variables de Entorno en Render

**Backend:**
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `FMCSA_API_KEY`
- `NODE_ENV=production`

**Frontend:**
- `NEXT_PUBLIC_API_URL` (URL del backend en Render)

---

## 🔐 Security Features

- ✅ **Password Hashing** - bcrypt
- ✅ **JWT Authentication** - Tokens seguros
- ✅ **Role-Based Access Control** - RBAC
- ✅ **GPS Validation** - Validación de ubicación POD
- ✅ **AI Fraud Detection** - Detección con OpenAI Vision
- ✅ **Carrier Verification** - Verificación FMCSA
- ✅ **Data Encryption** - Encriptación de datos sensibles
- ✅ **Audit Logging** - Registro de eventos

---

## 📊 Features Roadmap

### ✅ Implementado
- [x] Authentication & Authorization
- [x] Shipment Management
- [x] Real-time GPS Tracking
- [x] POD with AI Fraud Detection
- [x] Carrier Verification
- [x] Wallet System
- [x] Analytics Dashboard
- [x] Notifications
- [x] AI Route Optimization
- [x] AI Load Assignment

### 🚧 En Desarrollo
- [ ] Mobile Apps (React Native)
- [ ] SMS Notifications (Twilio)
- [ ] Email Notifications
- [ ] Cloud Storage (AWS S3)
- [ ] Advanced Analytics
- [ ] Multi-language Support

---

## 📚 Documentación Adicional

- [📋 Commands](./docs/COMMANDS.md) - Lista de comandos útiles
- [🚀 Deployment Guide](./docs/DEPLOYMENT.md) - Guía completa de deployment
- [⚙️ Environment Setup](./docs/ENVIRONMENT_SETUP.md) - Configuración detallada
- [🏗️ Platform Guide](./docs/PLATFORM_GUIDE.md) - Guía de la plataforma
- [📖 Quick Start](./docs/QUICK_START.md) - Guía rápida de inicio

---

## 🤝 Contributing

Este proyecto es activamente mantenido. Para contribuir:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 License

MIT License - Ver [LICENSE](LICENSE) para más detalles

---

## 🆘 Support & Help

### Troubleshooting

**Backend no inicia:**
- Verificar `DATABASE_URL` en `.env`
- Ejecutar `npm run prisma:migrate`
- Verificar logs en consola

**Frontend no conecta:**
- Verificar `NEXT_PUBLIC_API_URL` en `.env.local`
- Verificar que backend esté corriendo
- Revisar CORS settings

**AI Features no funcionan:**
- Verificar `OPENAI_API_KEY` válido
- Revisar límites de uso de OpenAI
- Verificar logs del backend

### Tools de Debugging
```bash
# Ver database con Prisma Studio
cd backend && npm run prisma:studio

# Health check del API
curl http://localhost:4000/api/v1/health

# Logs del backend
cd backend && npm run dev

# Logs del frontend
cd frontend && npm run dev
```

---

## 👥 Team

**Desarrollado por:** Grand Eagle Logistics Team

**Contacto:** [Crear un issue](https://github.com/msawah/grand-eagle-logistics/issues)

---

<div align="center">

### 🦅 **Soar High, Deliver Fast!**

**Built with ❤️ using TypeScript, Next.js, PostgreSQL & OpenAI**

[⬆ Volver arriba](#-grand-eagle-logistics)

</div>
