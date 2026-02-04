#!/bin/bash
set -e

echo "Building particlehunter image..."
docker build -t particlehunter .

echo "Exporting particlehunter.tar..."
docker save particlehunter:latest -o particlehunter.tar

echo "Done. particlehunter.tar is ready to deploy."
