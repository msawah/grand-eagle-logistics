# 🚀 EMPEZAR AQUÍ - 1 COMANDO

## ⚡ Opción 1: Script Automático (RECOMENDADO)

```bash
./start.sh
```

Eso es TODO. El script hace:
- ✅ Instala dependencias (backend + frontend)
- ✅ Genera Prisma Client
- ✅ Crea/migra base de datos
- ✅ Inicia backend en puerto 4000
- ✅ Inicia frontend en puerto 3000

Espera 30 segundos y abre: **http://localhost:3000**

---

## 📋 Opción 2: Manual (Si el script no funciona)

### Paso 1: Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

### Paso 2: Frontend (Nueva terminal)
```bash
cd frontend
npm install
npm run dev
```

---

## 🐛 Si Localhost No Abre

### Error: "Cannot find module"
```bash
cd backend && npm install
cd frontend && npm install
```

### Error: "Database connection"
```bash
# PostgreSQL no está instalado o no está corriendo
# Mac: brew install postgresql && brew services start postgresql
# Ubuntu: sudo apt install postgresql && sudo systemctl start postgresql

# Crear DB:
createdb grand_eagle_db
```

### Error: "Port 4000 already in use"
```bash
# Matar proceso en puerto 4000
lsof -ti:4000 | xargs kill -9

# O cambiar puerto en backend/.env:
PORT=5000
```

### Error: "Prisma Client not initialized"
```bash
cd backend
npm run prisma:generate
```

---

## ✅ Verificar que Todo Funciona

1. **Backend**: http://localhost:4000/api/v1/health
   - Deberías ver: `{"status":"ok"}`

2. **Frontend**: http://localhost:3000
   - Deberías ver la landing page

3. **Login**: http://localhost:3000/login
   - Registra un usuario nuevo

---

## 🎯 URLs Importantes

- **App**: http://localhost:3000
- **API**: http://localhost:4000/api/v1
- **Health**: http://localhost:4000/api/v1/health

---

## 📝 Notas

- **Backend** corre en puerto **4000**
- **Frontend** corre en puerto **3000**
- Los logs se guardan en `backend.log` y `frontend.log`

---

## 🆘 Ayuda Rápida

```bash
# Ver logs del backend
tail -f backend.log

# Ver logs del frontend
tail -f frontend.log

# Reiniciar todo
./start.sh
```

---

**¡Eso es todo! Si sigue sin funcionar, revisa los logs o contáctame.** 🦅
