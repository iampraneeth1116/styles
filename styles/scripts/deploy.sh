#!/bin/bash
# Idempotent deployment script for EC2

set -e

echo "Deploying application..."

# Create project directory for general logs if it doesn't exist
mkdir -p logs

# Restart or start the backend using PM2
echo "Deploying backend..."
cd server
npm ci --production
npx prisma generate
npx prisma db push --accept-data-loss

if pm2 describe styles-api > /dev/null 2>&1; then
    echo "Restarting Express API..."
    pm2 restart styles-api
else
    echo "Starting Express API..."
    pm2 start src/index.js --name styles-api
fi

# Build and start frontend
echo "Deploying frontend..."
cd ../client
npm ci
npm run build

if pm2 describe styles-client > /dev/null 2>&1; then
    echo "Restarting Next.js client..."
    pm2 restart styles-client
else
    echo "Starting Next.js client..."
    pm2 start npm --name styles-client -- start
fi

echo "Deployment completed successfully."
