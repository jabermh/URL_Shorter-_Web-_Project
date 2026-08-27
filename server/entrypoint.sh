#!/bin/sh

set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

echo "Running migrations..."
npm run migrate

echo "Migrations completed"

echo "Starting Express server..."
exec node index.js