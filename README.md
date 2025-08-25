# 🏀 Fast Break - Basketball Mini-Game

A fun basketball mini-game where players alternate between A and D keys to sprint to the hoop! Built with Next.js (TypeScript + TailwindCSS) and FastAPI (Python).

## 🎮 Game Features

- **Alternating Controls**: Players must alternate between A and D keys (or on-screen buttons) to move forward
- **10-Second Timer**: Race against time to reach the basketball hoop
- **Star Rating System**:
  - ⭐⭐⭐ = 20+ steps
  - ⭐⭐ = 15-19 steps  
  - ⭐ = 10-14 steps
  - 0 stars = <10 steps
- **Leaderboard**: Track top scores across all players
- **Mobile Friendly**: On-screen buttons for touch devices
- **Responsive Design**: Works on all screen sizes

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm** (for frontend)
- **Python 3.8+** (for backend)
- **Git**

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd Fast-break
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python main.py
```

The backend will start at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will start at `http://localhost:3000`

### 4. Play the Game!

Navigate to `http://localhost:3000/games/fast-break` in your browser and start playing!

## 🏗️ Project Structure

```
Fast-break/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── venv/               # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── games/
│   │   │       └── fast-break/
│   │   │           └── page.tsx    # Game page route
│   │   └── components/
│   │       └── FastBreakGame.tsx   # Main game component
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🎯 How to Play

1. **Enter your name** and click "Start Game"
2. **Alternate between A and D keys** (or use on-screen buttons)
3. **Each correct alternation** moves your player forward
4. **Reach the basketball hoop** before time runs out!
5. **View your score** and star rating
6. **Check the leaderboard** to see how you rank

## 🔧 API Endpoints

### Backend (`http://localhost:8000`)

- `POST /score` - Save a player's score
- `GET /leaderboard?game_type=fast_break` - Get top scores
- `GET /health` - Health check

### Example API Usage

```bash
# Save a score
curl -X POST "http://localhost:8000/score" \
  -H "Content-Type: application/json" \
  -d '{"player_id": "player123", "game_type": "fast_break", "score": 25, "stars": 3}'

# Get leaderboard
curl "http://localhost:8000/leaderboard?game_type=fast_break&limit=10"
```

## 🎨 Customization

### Styling
The game uses TailwindCSS classes that are scoped to the component, so they won't interfere with your main site's styles.

### Game Settings
You can easily modify:
- Timer duration (default: 10 seconds)
- Star rating thresholds
- Player movement speed
- Visual styling

### Embedding
The `FastBreakGame` component can be imported and used anywhere in your Next.js application:

```tsx
import FastBreakGame from '@/components/FastBreakGame';

export default function MyPage() {
  return (
    <div>
      <h1>My Basketball Training Site</h1>
      <FastBreakGame />
    </div>
  );
}
```

## 🚀 Production Deployment

### Backend
- **SQLite**: Currently using SQLite for development
- **PostgreSQL**: For production, update `DATABASE_URL` in `main.py`:
  ```python
  DATABASE_URL = "postgresql://user:password@localhost/fastbreak"
  ```
- **Environment Variables**: Use environment variables for database credentials
- **CORS**: Update allowed origins for your production domain

### Frontend
- Build for production: `npm run build`
- Deploy to Vercel, Netlify, or your preferred hosting service

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Ensure Python virtual environment is activated
   - Check if port 8000 is available
   - Verify all dependencies are installed

2. **Frontend can't connect to backend**
   - Ensure backend is running on `http://localhost:8000`
   - Check CORS settings in backend
   - Verify network requests in browser dev tools

3. **Game not responding to keys**
   - Ensure the game is in "playing" state
   - Check browser console for errors
   - Try refreshing the page

### Debug Mode

Enable debug logging by adding to backend:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🏆 Game Rules

- **Scoring**: Each correct A-D alternation = 1 step
- **Movement**: Player moves forward with each correct input
- **Timing**: 10-second countdown timer
- **Goal**: Reach the basketball hoop before time expires
- **Rating**: Stars awarded based on total steps achieved

---

**Have fun playing Fast Break! 🏀⚡**
