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

# Install dependencies with exact versions
npm install --save-exact
npm install --save-dev --save-exact vite@4.4.5 @vitejs/plugin-react@4.0.0

# Build using npx
npx vite build

# Return to root
cd .. 