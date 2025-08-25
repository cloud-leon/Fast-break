#!/bin/bash

# Fast Break - Complete Game Startup Script

echo "🏀 Starting Fast Break Basketball Mini-Game..."
echo "=============================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Start backend in background
echo "🚀 Starting FastAPI backend..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

echo "✅ Backend started with PID: $BACKEND_PID"
echo "🌐 Backend running at: http://localhost:8000"
echo ""

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎮 Starting Next.js frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Frontend started with PID: $FRONTEND_PID"
echo "🌐 Frontend running at: http://localhost:3000"
echo "🎯 Game available at: http://localhost:3000/games/fast-break"
echo ""

echo "🎉 Fast Break is now running!"
echo "=============================="
echo "📱 Backend: http://localhost:8000"
echo "🎮 Frontend: http://localhost:3000"
echo "🏀 Game: http://localhost:3000/games/fast-break"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '✅ Servers stopped'; exit 0" INT

# Keep script running
wait
