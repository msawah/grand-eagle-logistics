# 🚀 Render Deployment - Guía Automática

Esta guía te llevará paso a paso para deployar **Grand Eagle Logistics** en Render.com de forma AUTOMÁTICA.

---

## 📋 Pre-requisitos

- ✅ Cuenta en [Render.com](https://render.com) (gratis)
- ✅ Repositorio de GitHub conectado
- ✅ OpenAI API Key (opcional, para features de IA)
- ✅ FMCSA API Key (opcional, para carrier verification)

---

## 🎯 Opción 1: Deployment Automático (RECOMENDADO)

### Paso 1: Deploy con Un Click

1. Ve a [https://render.com](https://render.com)
2. Haz click en **"New"** → **"Blueprint"**
3. Conecta tu repositorio: `msawah/grand-eagle-logistics`
4. Render detectará automáticamente el archivo `render.yaml`
5. Haz click en **"Apply"**

**¡ESO ES TODO!** 🎉

Render creará automáticamente:
- ✅ Base de datos PostgreSQL
- ✅ Backend API (Node.js + Express)
- ✅ Frontend (Next.js)
- ✅ Todas las variables de entorno necesarias

### Paso 2: Configurar Variables Opcionales

Después del deploy, ve a cada servicio y agrega estas variables **OPCIONALES**:

**Backend:**
```
OPENAI_API_KEY=sk-your-openai-key-here
FMCSA_API_KEY=your-fmcsa-key-here
```

---

## 🔧 Opción 2: Deployment Manual

Si prefieres crear cada servicio manualmente:

### 1️⃣ Crear Base de Datos PostgreSQL

1. En Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configuración:
   - **Name:** `grand-eagle-db`
   - **Database:** `grand_eagle_logistics`
   - **User:** `grand_eagle_user`
   - **Region:** Oregon (o el más cercano)
   - **Plan:** Free
3. Click **"Create Database"**
4. **COPIA** la **Internal Database URL** (la vas a necesitar)

---

### 2️⃣ Deploy del Backend

1. Click **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configuración:
   ```
   Name: grand-eagle-backend
   Region: Oregon
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run prisma:generate && npm run build
   Start Command: npm run prisma:deploy && npm start
   ```

4. Variables de Entorno:
   ```
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=[PEGA AQUÍ LA URL DE TU DATABASE]
   JWT_SECRET=[GENERA UNO ALEATORIO - ej: openssl rand -base64 32]
   JWT_EXPIRES_IN=7d
   OPENAI_API_KEY=sk-your-key-here (OPCIONAL)
   FMCSA_API_KEY=your-key-here (OPCIONAL)
   FMCSA_API_URL=https://mobile.fmcsa.dot.gov/qc/services/carriers
   ```

5. **Health Check Path:** `/api/v1/health`

6. Click **"Create Web Service"**

7. **ESPERA** a que termine el deploy (5-10 minutos)

8. **COPIA** la URL del backend (algo como: `https://grand-eagle-backend.onrender.com`)

---

### 3️⃣ Deploy del Frontend

1. Click **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configuración:
   ```
   Name: grand-eagle-frontend
   Region: Oregon
   Branch: main
   Root Directory: frontend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. Variables de Entorno:
   ```
   NEXT_PUBLIC_API_URL=[URL DEL BACKEND]/api/v1
   ```
   Ejemplo: `https://grand-eagle-backend.onrender.com/api/v1`

5. Click **"Create Web Service"**

6. **ESPERA** a que termine el deploy (5-10 minutos)

---

## ✅ Verificación del Deploy

### Backend Funcionando:

Abre en tu navegador:
```
https://tu-backend.onrender.com/api/v1/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2024-xx-xx..."
}
```

### Frontend Funcionando:

Abre en tu navegador:
```
https://tu-frontend.onrender.com
```

Deberías ver la landing page de **Grand Eagle Logistics** 🦅

---

## 🔑 Configurar Migraciones de Base de Datos

Render ejecutará automáticamente las migraciones con `npm run prisma:deploy` en cada deploy.

Si necesitas ejecutar migraciones manualmente:

1. Ve al **Backend Service** en Render
2. Click en **"Shell"** (terminal)
3. Ejecuta:
   ```bash
   cd backend
   npm run prisma:migrate
   ```

---

## 🚨 Troubleshooting

### Error: "Cannot connect to database"

**Solución:**
- Verifica que la variable `DATABASE_URL` esté correctamente configurada en el backend
- Usa la **Internal Database URL**, no la External

### Error: "Module not found"

**Solución:**
- Ve al servicio → Settings → Build Command
- Agrega `npm install` al inicio del build command

### Error: "API connection refused" en Frontend

**Solución:**
- Verifica que `NEXT_PUBLIC_API_URL` apunte a la URL correcta del backend
- Asegúrate de incluir `/api/v1` al final

### Backend se queda "Building..." por más de 15 minutos

**Solución:**
- Cancel el build
- Ve a Settings → Increase Build timeout
- Rebuild

---

## 🎨 URLs Finales

Después del deploy exitoso, tendrás:

```
🗄️  Database:    [internal].oregon-postgres.render.com
🔧 Backend API:  https://grand-eagle-backend.onrender.com
🌐 Frontend:     https://grand-eagle-frontend.onrender.com
```

**Comparte la URL del Frontend con tus usuarios:**
```
https://grand-eagle-frontend.onrender.com
```

---

## 📊 Monitoreo

Render te da automáticamente:

- ✅ **Logs en tiempo real** - Ve a cada servicio → Logs
- ✅ **Metrics** - CPU, Memory, Requests
- ✅ **Health Checks** - Restart automático si el servicio falla
- ✅ **Auto-Deploy** - Cada push a main hace deploy automático

---

## 💰 Costos

**Plan Free:**
- ✅ Backend: Gratis (con 750 horas/mes)
- ✅ Frontend: Gratis (con 750 horas/mes)
- ✅ PostgreSQL: Gratis (90 días, luego $7/mes)

**Plan Starter ($7/mes por servicio):**
- ✅ Sin sleep automático
- ✅ Más CPU y RAM
- ✅ Mejor performance

---

## 🔐 Seguridad Best Practices

1. **Nunca** compartas tu `DATABASE_URL` públicamente
2. **Nunca** commitees las API keys en el código
3. Usa **Environment Variables** en Render para todas las secrets
4. Habilita **2FA** en tu cuenta de Render
5. Usa `JWT_SECRET` único y aleatorio (genera con `openssl rand -base64 32`)

---

## 🚀 Auto-Deploy desde GitHub

Render hace deploy automático cuando:
- ✅ Haces push a `main`
- ✅ Mergeas un PR a `main`

Para deshabilitarlo:
- Ve al servicio → Settings → Auto-Deploy → Desactivar

---

## 📞 Soporte

**¿Problemas con el deploy?**

1. Revisa los **Logs** en Render Dashboard
2. Verifica las **Environment Variables**
3. Chequea que el **Health Check** esté respondiendo
4. Crea un issue en [GitHub](https://github.com/msawah/grand-eagle-logistics/issues)

---

## 🎉 ¡Deploy Completo!

Tu plataforma de logística está lista para producción. Ahora puedes:

- ✅ Registrar usuarios (Shippers, Drivers, Admins)
- ✅ Crear y gestionar shipments
- ✅ Tracking GPS en tiempo real
- ✅ POD upload con AI fraud detection
- ✅ Carrier verification
- ✅ Analytics dashboard

---

**🦅 Grand Eagle Logistics - Soar High, Deliver Fast!**
