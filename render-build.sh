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
# Ensure Vite is installed
npm install vite@latest
npm install
npm run build

# Return to root
cd .. 