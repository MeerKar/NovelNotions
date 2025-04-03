#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Build client
cd client
npm install
npm run build

# Return to root and start server
cd .. 