#!/usr/bin/env bash
# exit on error
set -o errexit

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Build client
cd client
# Remove existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install specific versions of Vite and its plugin
npm install --save-dev vite@4.4.5
npm install --save-dev @vitejs/plugin-react@4.0.0

# Install remaining dependencies
npm install --legacy-peer-deps

# Build the application
npm run build

# Return to root
cd .. 