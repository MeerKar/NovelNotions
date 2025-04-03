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
    "build": "vite build"
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
    minify: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
EOF

# Install dependencies
npm install

# Build
npm run build

# Return to root
cd .. 