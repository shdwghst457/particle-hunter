#!/bin/bash
set -e

echo "Loading particlehunter image..."
docker load -i particlehunter.tar

echo "Stopping existing container (if any)..."
docker rm -f particlehunter 2>/dev/null || true

echo "Starting particlehunter..."
docker run -d --name particlehunter -p 8082:8082 particlehunter

echo "Done. Open http://localhost:8082"
