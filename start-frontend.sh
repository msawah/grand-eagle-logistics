#!/bin/bash

echo "🦅 Starting Grand Eagle Logistics Frontend..."
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo "🚀 Starting frontend on port 3000..."
echo ""
npm run dev
