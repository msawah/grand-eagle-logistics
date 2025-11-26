#!/bin/bash

echo "🦅 Starting Grand Eagle Logistics Backend..."
echo ""

cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Check if Prisma client is generated
if [ ! -d "node_modules/.prisma" ]; then
  echo "🔧 Generating Prisma client..."
  npx prisma generate
fi

echo "🚀 Starting backend server on port 3001..."
echo ""
npm run dev
