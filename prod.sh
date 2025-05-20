#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define default env file
ENV_FILE=".env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "⚠️  $ENV_FILE not found. Please create one with the required environment variables."
  exit 1
fi

echo "🚀 Starting prod environment..."

# Build and start containers with Docker Compose
docker compose \
  -f docker-compose.yml \
  --env-file "$ENV_FILE" \
  up --build
