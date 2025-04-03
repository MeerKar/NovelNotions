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

# Clean up
rm -rf node_modules package-lock.json dist

# Create a temporary package.json with minimal dependencies
cat > package.json << 'EOF'
{
  "name": "client",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "./node_modules/.bin/vite build"
  },
  "dependencies": {
    "@apollo/client": "^3.7.14",
    "@chakra-ui/react": "^2.8.2",
    "@chakra-ui/icons": "^2.1.1",
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "framer-motion": "^11.2.6",
    "graphql": "^16.6.0",
    "jwt-decode": "^3.1.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.11.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "4.0.0",
    "vite": "4.4.5"
  }
}
EOF

# Create vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: true
  }
})
EOF

# Install dependencies
npm install

# Ensure vite is available in node_modules/.bin
if [ ! -f "node_modules/.bin/vite" ]; then
  echo "Vite binary not found, installing explicitly..."
  npm install --save-dev vite@4.4.5
fi

# Build using explicit path
./node_modules/.bin/vite build

# Return to root
cd .. 