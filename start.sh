#!/bin/bash

echo "🦅 Grand Eagle Logistics - Inicio Automático"
echo "=============================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Ejecuta este script desde la raíz del proyecto${NC}"
    exit 1
fi

# Paso 1: Instalar dependencias del backend
echo -e "${YELLOW}📦 Paso 1: Instalando dependencias del backend...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error instalando dependencias del backend${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Dependencias del backend ya instaladas${NC}"
fi

# Paso 2: Generar Prisma Client
echo -e "${YELLOW}🗄️  Paso 2: Generando Prisma Client...${NC}"
npm run prisma:generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error generando Prisma Client${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prisma Client generado${NC}"

# Paso 3: Verificar/Crear base de datos
echo -e "${YELLOW}🗄️  Paso 3: Configurando base de datos...${NC}"
echo -e "${YELLOW}   (Esto puede tomar un momento si es la primera vez)${NC}"
npm run prisma:migrate 2>/dev/null || npm run prisma:push
echo -e "${GREEN}✅ Base de datos lista${NC}"

# Paso 4: Instalar dependencias del frontend
echo -e "${YELLOW}📦 Paso 4: Instalando dependencias del frontend...${NC}"
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error instalando dependencias del frontend${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Dependencias del frontend ya instaladas${NC}"
fi

cd ..

# Paso 5: Iniciar servidores
echo ""
echo -e "${GREEN}🚀 ¡Todo listo! Iniciando servidores...${NC}"
echo ""
echo -e "${YELLOW}📍 Backend estará en: http://localhost:4000${NC}"
echo -e "${YELLOW}📍 Frontend estará en: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}⚠️  Presiona Ctrl+C para detener ambos servidores${NC}"
echo ""
sleep 2

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo servidores...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Iniciar backend en background
echo -e "${GREEN}🔧 Iniciando Backend...${NC}"
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar un poco para que el backend inicie
sleep 5

# Iniciar frontend en background
echo -e "${GREEN}🌐 Iniciando Frontend...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ ¡Servidores iniciados!${NC}"
echo ""
echo -e "${YELLOW}📊 Ver logs:${NC}"
echo -e "   Backend:  tail -f backend.log"
echo -e "   Frontend: tail -f frontend.log"
echo ""
echo -e "${GREEN}🌐 Abre tu navegador en: http://localhost:3000${NC}"
echo ""
echo "Presiona Ctrl+C para detener..."

# Mantener el script corriendo
wait
