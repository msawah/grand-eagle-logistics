# 🦅 Grand Eagle Logistics - Commands Reference

## Referencia Rápida de Comandos

---

## 🚀 Inicio Rápido

### Opción 1: Iniciar Todo (Recomendado)
```bash
./start-all.sh
```
Inicia backend (puerto 3001) y frontend (puerto 3000) simultáneamente.

### Opción 2: Iniciar Solo Backend
```bash
./start-backend.sh
```
o manualmente:
```bash
cd backend
npm run dev
```

### Opción 3: Iniciar Solo Frontend
```bash
./start-frontend.sh
```
o manualmente:
```bash
cd frontend
npm run dev
```

---

## 📦 Instalación

### Instalación Completa Automática
```bash
chmod +x ULTIMATE_INSTALL.sh
./ULTIMATE_INSTALL.sh
```

### Instalación Manual

#### Backend
```bash
cd backend
npm install
cp .env.example .env  # Edit with your values
npx prisma generate
npx prisma db push
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local  # Edit with your values
```

---

## 🗄️ Base de Datos (Prisma)

### Generar Prisma Client
```bash
cd backend
npx prisma generate
```

### Sincronizar Schema (Development)
```bash
npx prisma db push
```

### Crear Migración (Production)
```bash
npx prisma migrate dev --name migration_name
```

### Aplicar Migraciones (Production)
```bash
npx prisma migrate deploy
```

### Abrir Prisma Studio (GUI Database)
```bash
npx prisma studio
```
Abre en: http://localhost:5555

### Reset Database (⚠️ Cuidado)
```bash
npx prisma migrate reset
```

---

## 🔧 Desarrollo

### Backend

#### Modo Desarrollo (Hot Reload)
```bash
cd backend
npm run dev
```

#### Build para Producción
```bash
npm run build
```

#### Iniciar Producción
```bash
npm start
```

#### Type Check (Sin compilar)
```bash
npm test
```

### Frontend

#### Modo Desarrollo
```bash
cd frontend
npm run dev
```

#### Build para Producción
```bash
npm run build
```

#### Iniciar Producción
```bash
npm start
```

#### Lint
```bash
npm run lint
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📡 API Testing

### Health Check
```bash
curl http://localhost:3001/api/v1/health
```

### Status Check
```bash
curl http://localhost:3001/api/v1/status
```

### Register User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "driver",
    "phoneNumber": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (Authenticated)
```bash
curl http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Shipment (Shipper)
```bash
curl -X POST http://localhost:3001/api/v1/shipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "123 Main St, New York, NY",
    "dropoffAddress": "456 Oak Ave, Los Angeles, CA",
    "pickupLat": 40.7128,
    "pickupLng": -74.0060,
    "dropoffLat": 34.0522,
    "dropoffLng": -118.2437,
    "cargoType": "Electronics",
    "cargoWeight": 1.5,
    "price": 1500.00,
    "specialInstructions": "Fragile - handle with care"
  }'
```

### Get All Shipments
```bash
curl http://localhost:3001/api/v1/shipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update GPS Location (Driver)
```bash
curl -X POST http://localhost:3001/api/v1/drivers/location \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gpsLat": 40.7128,
    "gpsLng": -74.0060,
    "heading": 180,
    "speed": 65.5,
    "accuracy": 10
  }'
```

---

## 🛠️ Utilidades

### Ver Logs del Backend
```bash
cd backend
npm run dev | tee backend.log
```

### Ver Logs del Frontend
```bash
cd frontend
npm run dev | tee frontend.log
```

### Limpiar node_modules
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Frontend
cd frontend && rm -rf node_modules && npm install

# Ambos
rm -rf backend/node_modules frontend/node_modules
cd backend && npm install
cd ../frontend && npm install
```

### Limpiar Build Artifacts
```bash
# Backend
cd backend && rm -rf dist

# Frontend
cd frontend && rm -rf .next

# Ambos
rm -rf backend/dist frontend/.next
```

---

## 🐳 Docker (Opcional)

### Build Backend Image
```bash
cd backend
docker build -t grand-eagle-backend .
```

### Run Backend Container
```bash
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  grand-eagle-backend
```

### Build Frontend Image
```bash
cd frontend
docker build -t grand-eagle-frontend .
```

### Run Frontend Container
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1" \
  grand-eagle-frontend
```

### Docker Compose (Full Stack)
```bash
docker-compose up -d
```

---

## 🔐 Seguridad

### Cambiar JWT Secret
```bash
# Editar backend/.env
JWT_SECRET="new-super-secret-key"

# Reiniciar servidor
```

### Regenerar Prisma Client (Después de cambiar schema)
```bash
cd backend
npx prisma generate
npx prisma db push
```

---

## 📊 Monitoreo

### Ver Procesos Node
```bash
ps aux | grep node
```

### Ver Puerto en Uso
```bash
lsof -i :3001  # Backend
lsof -i :3000  # Frontend
```

### Matar Proceso en Puerto
```bash
kill -9 $(lsof -t -i:3001)  # Backend
kill -9 $(lsof -t -i:3000)  # Frontend
```

---

## 🌐 URLs Importantes

### Development
```
Frontend:          http://localhost:3000
Backend API:       http://localhost:3001
API Health:        http://localhost:3001/api/v1/health
Prisma Studio:     http://localhost:5555

Dashboards:
- Shipper:         http://localhost:3000/dashboard/shipper/ultra
- Driver:          http://localhost:3000/dashboard/driver/ultra
- Admin:           http://localhost:3000/dashboard/admin/ultra

Auth:
- Login:           http://localhost:3000/login
- Register:        http://localhost:3000/register
```

### Production
```
Frontend:          https://your-domain.com
Backend API:       https://api.your-domain.com
API Health:        https://api.your-domain.com/api/v1/health
```

---

## 🔄 Git

### Commit Changes
```bash
git add .
git commit -m "Your commit message"
git push
```

### Create Branch
```bash
git checkout -b feature/your-feature-name
```

### Merge to Main
```bash
git checkout main
git merge feature/your-feature-name
git push
```

---

## 🚢 Deployment

### Deploy to Railway

#### Backend
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Set environment variables in Railway dashboard
# DATABASE_URL, JWT_SECRET, PORT, etc.

# Deploy
git push railway main
```

#### Frontend
```bash
# Same process, separate Railway project
railway login
railway link
git push railway main
```

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL
```

### Deploy to Render

1. Connect GitHub repo
2. Create Web Service for backend
   - Build: `cd backend && npm install && npm run build`
   - Start: `cd backend && npm start`
3. Create Web Service for frontend
   - Build: `cd frontend && npm install && npm run build`
   - Start: `cd frontend && npm start`
4. Create PostgreSQL database
5. Set environment variables

---

## 🆘 Troubleshooting

### Puerto Ya en Uso
```bash
# Encontrar proceso
lsof -i :3001

# Matar proceso
kill -9 <PID>
```

### Prisma Client Error
```bash
cd backend
rm -rf node_modules/.prisma
npx prisma generate
```

### Database Connection Error
```bash
# Verificar DATABASE_URL en .env
# Verificar que PostgreSQL esté corriendo
# Verificar credenciales

# Test connection
npx prisma db push
```

### Module Not Found
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Backend
cd backend
npm run test  # Type check only

# Frontend
cd frontend
npm run lint
```

### Frontend No Se Conecta al Backend
```bash
# Verificar NEXT_PUBLIC_API_URL en frontend/.env.local
# Verificar que backend esté corriendo
# Verificar CORS en backend/src/index.ts
```

### WebSocket No Funciona
```bash
# Verificar NEXT_PUBLIC_WS_URL
# Verificar que Socket.IO esté habilitado en backend
# Revisar console del browser para errores
```

---

## 📖 Documentación

### Ver Documentación Completa
```bash
cat README_ULTIMATE.md    # Overview completo
cat PLATFORM_GUIDE.md     # Guía de funcionalidades
cat DEPLOYMENT.md         # Guía de deployment
cat QUICK_START.md        # Inicio rápido
```

### Generar Documentación API
```bash
# Endpoint de documentación
curl http://localhost:3001/api/v1/health
```

---

## 🎯 Atajos Útiles

### Setup Completo (Primera vez)
```bash
./ULTIMATE_INSTALL.sh
```

### Desarrollo Diario
```bash
./start-all.sh
```

### Reset Total
```bash
cd backend
rm -rf node_modules dist
npx prisma migrate reset
npm install
npx prisma generate

cd ../frontend
rm -rf node_modules .next
npm install
```

---

## 💡 Tips

1. **Siempre correr Prisma generate después de cambiar el schema**
   ```bash
   npx prisma generate
   ```

2. **Usar Prisma Studio para ver/editar datos**
   ```bash
   npx prisma studio
   ```

3. **Logs detallados en desarrollo**
   ```bash
   NODE_ENV=development npm run dev
   ```

4. **Hot reload está activado** - Los cambios se aplican automáticamente

5. **Puerto 3001 para backend, 3000 para frontend** - Estándar del proyecto

---

## 📞 Soporte

### Recursos
- README_ULTIMATE.md - Documentación completa
- PLATFORM_GUIDE.md - Guía de funcionalidades
- DEPLOYMENT.md - Guía de deployment
- API Health: http://localhost:3001/api/v1/health

### Problemas Comunes
- Ver sección de Troubleshooting arriba
- Revisar logs del servidor
- Verificar variables de entorno

---

**© 2024 Grand Eagle Logistics - Ultimate Platform**
🦅 *"Soar High, Deliver Fast!"*
