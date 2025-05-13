#!/usr/bin/env bash

# Build frontend
cd client
npm install
npm run build

# Build backend
cd ../server
npm install
npm run build
