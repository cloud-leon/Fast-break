#!/bin/bash

# Fast Break Backend Startup Script

echo "🏀 Starting Fast Break Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Start the server
echo "Starting FastAPI server on http://localhost:8000..."
echo "Press Ctrl+C to stop the server"
python main.py
