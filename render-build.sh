#!/usr/bin/env bash

# Steg 1: Bygg frontend
cd client
npm install
npm run build

# Steg 2: Gå tillbaka och installera backend
cd ..
npm install

# Steg 3: Bygg TypeScript om det behövs (om du har tsconfig.json i /server)
cd server
npm run build
