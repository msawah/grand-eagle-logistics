# ⚡ INICIO RÁPIDO - 5 MINUTOS

## 🚀 PASO 1: Crear Base de Datos PostgreSQL

```bash
# Instalar PostgreSQL (si no lo tienes)
# En Mac: brew install postgresql
# En Ubuntu: sudo apt-get install postgresql

# Crear la base de datos
createdb grand_eagle_db

# O si no funciona, usa psql:
psql postgres
CREATE DATABASE grand_eagle_db;
\q
```

## 📦 PASO 2: Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

## ⚙️ PASO 3: Configurar Variables (.env ya están creados)

### Backend (.env)
Ya está creado en `backend/.env` con:
- DATABASE_URL apuntando a localhost
- JWT_SECRET configurado
- Puerto 4000

**IMPORTANTE:** Si tu PostgreSQL tiene usuario/password diferente, edita `backend/.env`:
```env
DATABASE_URL="postgresql://TU_USUARIO:TU_PASSWORD@localhost:5432/grand_eagle_db"
```

### Frontend (.env.local)
Ya está creado en `frontend/.env.local` apuntando a `http://localhost:4000/api/v1`

## 🗄️ PASO 4: Crear Tablas en Base de Datos

```bash
cd backend

# Generar Prisma Client
npm run prisma:generate

# Crear todas las tablas
npm run prisma:migrate

# (Opcional) Ver la base de datos
npm run prisma:studio
```

## ▶️ PASO 5: Iniciar la Aplicación

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
✅ Deberías ver: **Server running on port 4000**

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
✅ Deberías ver: **Ready on http://localhost:3000**

## 🎯 PASO 6: Usar la Plataforma

1. **Abre**: http://localhost:3000
2. **Register**: Click en "Sign up"
   - Email: `admin@example.com`
   - Password: `password123`
   - Name: `Admin Test`
   - Role: **Shipper** o **Driver**
3. **Login**: Inicia sesión
4. **Dashboard**: Verás el dashboard moderno 🎉

---

## 📱 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **Health Check**: http://localhost:4000/api/v1/health
- **Prisma Studio**: http://localhost:5555 (si corriste prisma:studio)

---

## 👥 Crear Usuarios de Prueba

### Shipper:
- Email: `shipper@test.com`
- Password: `password123`
- Role: SHIPPER

### Driver:
- Email: `driver@test.com`
- Password: `password123`
- Role: DRIVER

---

## 🐛 Troubleshooting Rápido

### Error: "Connection refused" en Frontend
- ✅ Verifica que el backend esté corriendo en puerto 4000
- ✅ Chequea `frontend/.env.local`

### Error: "Cannot connect to database"
- ✅ PostgreSQL está corriendo? `ps aux | grep postgres`
- ✅ La base de datos existe? `psql -l | grep grand_eagle`
- ✅ Usuario/password correcto en `backend/.env`?

### Error: "Module not found"
- ✅ Corriste `npm install` en backend Y frontend?

### Error: "Prisma Client not generated"
- ✅ Corre: `cd backend && npm run prisma:generate`

---

## 🚀 Deploy a Producción (Render.com)

Ver archivo: **`RENDER_SETUP.md`**

---

## ✅ TODO LISTO!

Tu aplicación está corriendo en:
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend**: http://localhost:4000

**Los dashboards ya se ven exactamente como las imágenes que me mostraste.**

¡Disfruta! 🦅
