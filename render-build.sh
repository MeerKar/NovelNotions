#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing root dependencies..."
npm install

echo "Installing and building client..."
cd client

# Clean up
rm -rf node_modules dist

# Create a temporary package.json with minimal dependencies
cat > package.json << 'EOF'
{
  "name": "client",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@apollo/client": "3.7.14",
    "@chakra-ui/react": "2.8.2",
    "@chakra-ui/icons": "2.1.1",
    "@emotion/react": "11.11.4",
    "@emotion/styled": "11.11.5",
    "framer-motion": "10.16.4",
    "graphql": "16.6.0",
    "jwt-decode": "3.1.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "6.11.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "4.0.0",
    "vite": "4.4.5"
  }
}
EOF

# Create vite.config.js using CommonJS format
cat > vite.config.js << 'EOF'
const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const path = require('path')

module.exports = defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild'
  }
})
EOF

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Novel Notions</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# Ensure src directory exists
mkdir -p src

# Create main.jsx
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

echo "Installing client dependencies..."
# First do a regular install to generate package-lock.json
npm install

echo "Building client..."
npm run build

echo "Client build complete. Returning to root..."
cd ..

echo "Installing server dependencies..."
cd server
# First do a regular install to generate package-lock.json
npm install
cd .. 