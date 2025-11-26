# 🚀 Guía de Despliegue en Render

Esta guía te ayudará a desplegar la plataforma Grand Eagle Logistics en Render.

## ✅ Estado Actual

- ✅ Código subido a GitHub en branch `claude/delivery-platform-full-stack-01JmwN1Liv1YHjw2sH5ac45j`
- ✅ Prisma schema configurado para PostgreSQL
- ✅ Variables de entorno configuradas en Render
- ✅ Base de datos PostgreSQL creada en Render

## 📋 Pasos para Desplegar

### 1. Merge del Código a Main

**IMPORTANTE:** El código está en el branch `claude/delivery-platform-full-stack-01JmwN1Liv1YHjw2sH5ac45j`

**Opción A: Merge en GitHub (Recomendado)**
1. Ve a: https://github.com/msawah/grand-eagle-logistics
2. Verás un banner amarillo: "**claude/delivery-platform-full-stack-01JmwN1Liv1YHjw2sH5ac45j had recent pushes**"
3. Click en **"Compare & pull request"**
4. Título: "Deploy to Production - PostgreSQL + Map Fixes"
5. Click **"Create pull request"**
6. Click **"Merge pull request"** → **"Confirm merge"**

**Opción B: Manual**
1. Click en "**Pull requests**" tab
2. Click "**New pull request**"
3. Base: **main**
4. Compare: **claude/delivery-platform-full-stack-01JmwN1Liv1YHjw2sH5ac45j**
5. Click "**Create pull request**"
6. Click "**Merge pull request**"

### 2. Verificar Variables de Entorno en Render

#### Backend Service

Ya tienes estas configuradas, pero verifica que estén correctas:

```bash
DATABASE_URL=postgresql://grand_eagle_db_aedw_user:8STWa9GBLst85tgrFIIV0qHCDFCWwRMt@dpg-d4hfrh6r433s73enb3k0-a/grand_eagle_db_aedw
JWT_SECRET=grand_eagle_super_secret_2025_production
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=4000
```

**Agregar estas variables que faltan:**

```bash
FRONTEND_URL=https://grand-eagle-logistics-frontend.onrender.com
OPENAI_API_KEY=sk-placeholder-for-now
STRIPE_SECRET_KEY=sk_test_placeholder
```

**Pasos:**
1. Ve a tu servicio backend en Render
2. Click en "**Environment**" en el menú izquierdo
3. Click "**Add Environment Variable**"
4. Agrega cada variable con su valor
5. Click "**Save Changes**"

#### Frontend Service

Ya tienes:
```bash
NEXT_PUBLIC_API_URL=https://grand-eagle-logistics.onrender.com/api/v1
NODE_VERSION=18
```

**Agregar esta variable:**
```bash
NEXT_PUBLIC_WS_URL=https://grand-eagle-logistics.onrender.com
```

**Pasos:**
1. Ve a tu servicio frontend en Render
2. Click en "**Environment**" en el menú izquierdo
3. Click "**Add Environment Variable**"
4. Key: `NEXT_PUBLIC_WS_URL`
5. Value: `https://grand-eagle-logistics.onrender.com`
6. Click "**Save Changes**"

### 3. Verificar Configuración de Build

#### Backend Service

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npx prisma db push --accept-data-loss && npm start
```

**Nota:** El `prisma db push` creará las tablas automáticamente en la base de datos PostgreSQL.

#### Frontend Service

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### 4. Iniciar Despliegue

#### Opción A: Deploy Automático (si está configurado)
- Render detectará el merge a main y desplegará automáticamente

#### Opción B: Deploy Manual

**Backend:**
1. Ve a tu servicio backend en Render
2. Click "**Manual Deploy**" (botón azul arriba a la derecha)
3. Selecciona "**Deploy latest commit**"
4. Click "**Deploy**"

**Frontend:**
1. Ve a tu servicio frontend en Render
2. Click "**Manual Deploy**"
3. Selecciona "**Deploy latest commit**"
4. Click "**Deploy**"

### 5. Monitorear el Despliegue

**Backend:**
1. Ve a la pestaña "**Logs**"
2. Verás el proceso de build:
   ```
   Installing dependencies...
   Generating Prisma Client...
   Building TypeScript...
   Database sync...
   Server starting on port 4000...
   ```

**Frontend:**
1. Ve a la pestaña "**Logs**"
2. Verás:
   ```
   Installing dependencies...
   Building Next.js app...
   Creating optimized production build...
   Server ready on port 3000...
   ```

### 6. Verificar el Despliegue

Una vez completado:

**Backend Health Check:**
```
https://grand-eagle-logistics.onrender.com/api/v1/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "...",
  "version": "1.0.0",
  "features": [...]
}
```

**Frontend:**
```
https://grand-eagle-logistics-frontend.onrender.com
```

**Dashboards:**
```
https://grand-eagle-logistics-frontend.onrender.com/dashboard/shipper/ultra
https://grand-eagle-logistics-frontend.onrender.com/dashboard/driver/ultra
https://grand-eagle-logistics-frontend.onrender.com/dashboard/admin/ultra
```

## 🐛 Solución de Problemas

### Backend falla en build:

**Error: "Prisma Client not found"**
```bash
# Verifica que el Build Command incluya:
npm install && npx prisma generate && npm run build
```

**Error: "Cannot connect to database"**
1. Verifica que `DATABASE_URL` esté correcta
2. Asegúrate de usar la Internal Database URL (sin `.ohio-postgres.render.com`)
3. El formato correcto es:
   ```
   postgresql://grand_eagle_db_aedw_user:PASSWORD@dpg-d4hfrh6r433s73enb3k0-a/grand_eagle_db_aedw
   ```

### Frontend falla en build:

**Error: "Cannot reach API"**
1. Verifica que `NEXT_PUBLIC_API_URL` apunte al backend correcto
2. Formato: `https://TU-BACKEND.onrender.com/api/v1`

**Error: "Map component error"**
- Ya está solucionado en el código actual ✅

### Database Issues:

**Si necesitas resetear la base de datos:**
1. Ve a tu PostgreSQL service en Render
2. Click en "**Info**" → "**Delete Database**" (¡CUIDADO!)
3. O usa el comando en el backend:
   ```bash
   npx prisma db push --force-reset
   ```

## 📊 Siguientes Pasos Después del Deploy

### 1. Crear Usuario Admin

Usa el endpoint de registro para crear tu primer usuario admin:

```bash
curl -X POST https://grand-eagle-logistics.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@grandeagle.com",
    "password": "SecurePassword123!",
    "role": "admin"
  }'
```

### 2. Probar los Dashboards

1. **Shipper Dashboard:**
   - Crear shipments
   - Ver tracking en tiempo real
   - Gestionar cargas

2. **Driver Dashboard:**
   - Ver cargas disponibles
   - Aceptar deliveries
   - Ver earnings

3. **Admin Dashboard:**
   - Gestionar usuarios
   - Monitorear plataforma
   - Ver analytics

### 3. Configurar APIs Externas (Opcional)

Cuando estés listo para features avanzadas:

**OpenAI (para AI features):**
1. Ve a: https://platform.openai.com/api-keys
2. Crea un API key
3. Actualiza `OPENAI_API_KEY` en Render

**Stripe (para pagos):**
1. Ve a: https://dashboard.stripe.com/apikeys
2. Copia tu Secret key
3. Actualiza `STRIPE_SECRET_KEY` en Render

## 🎉 ¡Éxito!

Si todo funciona correctamente, verás:

✅ Backend respondiendo en `/api/v1/health`
✅ Frontend cargando correctamente
✅ Dashboards funcionando
✅ Base de datos conectada
✅ Real-time tracking operativo

**URLs Finales:**
- **Backend API:** https://grand-eagle-logistics.onrender.com
- **Frontend:** https://grand-eagle-logistics-frontend.onrender.com
- **Shipper Dashboard:** /dashboard/shipper/ultra
- **Driver Dashboard:** /dashboard/driver/ultra
- **Admin Dashboard:** /dashboard/admin/ultra

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica las variables de entorno
3. Asegúrate de que el código esté en main branch
4. Revisa este archivo: RENDER_DEPLOYMENT.md

---

© 2024 Grand Eagle Logistics - Production Deployment Guide
