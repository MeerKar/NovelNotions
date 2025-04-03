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

# Install Vite globally first
npm install -g vite@4.4.5

# Install dependencies with exact versions
npm install --save-exact
npm install --save-dev --save-exact @vitejs/plugin-react@4.0.0

# Ensure vite.config.js is in the correct location
if [ ! -f "vite.config.js" ]; then
  echo "Creating vite.config.js..."
  cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: true,
  },
})
EOF
fi

# Build using global Vite
NODE_ENV=production vite build

# Return to root
cd .. 