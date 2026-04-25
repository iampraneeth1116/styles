#!/bin/bash
# Idempotent setup script for local development

set -e

echo "Starting setup..."

# Create necessary directories idempotently if they don't exist
mkdir -p logs
mkdir -p uploads

# Setup Server
echo "Setting up backend..."
cd server
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed. Skipping..."
fi

# Setup Client
echo "Setting up frontend..."
cd ../client
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed. Skipping..."
fi

echo "Setup completed successfully."
