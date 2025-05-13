#!/usr/bin/env bash

# Exit immediately on error
set -e

echo "🔧 Installerar och bygger frontend..."
cd client
npm install
npm run build

echo "✅ Frontend byggd!"

echo "📦 Installerar backend beroenden..."
cd ../server
npm install

echo "✅ Backend klar!"
