#!/bin/bash
# Simple local server for Particle Hunter
# No dependencies needed - uses Python's built-in server

PORT=8000

echo "🚂 Starting Particle Hunter locally..."
echo "📂 Serving from: $(pwd)"
echo "🌐 Open in browser: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop"

if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer $PORT
else
    echo "Error: Python not found. Just open index.html directly in your browser instead."
    exit 1
fi
