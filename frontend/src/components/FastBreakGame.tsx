'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Score {
  id: number;
  player_id: string;
  game_type: string;
  score: number;
  stars: number;
  timestamp: string;
}

interface LeaderboardResponse {
  scores: Score[];
  total: number;
}

const FastBreakGame: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [lastKey, setLastKey] = useState<'A' | 'D' | null>(null);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [stars, setStars] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const gameInterval = useRef<NodeJS.Timeout | null>(null);
  const timeInterval = useRef<NodeJS.Timeout | null>(null);
  const playerId = useRef(`player_${Date.now()}`);

  const API_BASE = 'http://localhost:8000';

  // Calculate stars based on score
  const calculateStars = (score: number): number => {
    if (score >= 20) return 3;
    if (score >= 15) return 2;
    if (score >= 10) return 1;
    return 0;
  };

  // Handle key press
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    const key = event.key.toUpperCase();
    if (key === 'A' || key === 'D') {
      if (lastKey === null || key !== lastKey) {
        setLastKey(key);
        setScore(prev => prev + 1);
        setPlayerPosition(prev => Math.min(prev + 20, 400)); // Move player forward
      }
    }
  }, [gameState, lastKey]);

  // Handle mobile button press
  const handleButtonPress = (key: 'A' | 'D') => {
    if (gameState !== 'playing') return;
    
    if (lastKey === null || key !== lastKey) {
      setLastKey(key);
      setScore(prev => prev + 1);
      setPlayerPosition(prev => Math.min(prev + 20, 400));
    }
  };

  // Start game
  const startGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name to start!');
      return;
    }
    
    setGameState('playing');
    setScore(0);
    setTimeLeft(10);
    setLastKey(null);
    setPlayerPosition(0);
    setStars(0);
    
    // Start timer
    timeInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End game
  const endGame = () => {
    setGameState('finished');
    const finalStars = calculateStars(score);
    setStars(finalStars);
    
    if (timeInterval.current) {
      clearInterval(timeInterval.current);
    }
    
    // Save score to backend
    saveScore();
  };

  // Save score to backend
  const saveScore = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: playerId.current,
          game_type: 'fast_break',
          score: score,
          stars: stars
        }),
      });
      
      if (response.ok) {
        console.log('Score saved successfully');
        fetchLeaderboard();
      }
    } catch (error) {
      console.error('Error saving score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/leaderboard?game_type=fast_break&limit=10`);
      if (response.ok) {
        const data: LeaderboardResponse = await response.json();
        setLeaderboard(data.scores);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameState('idle');
    setScore(0);
    setTimeLeft(10);
    setLastKey(null);
    setPlayerPosition(0);
    setStars(0);
    setPlayerName('');
  };

  // Load leaderboard on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Add keyboard event listeners
  useEffect(() => {
    if (gameState === 'playing') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [gameState, handleKeyPress]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (timeInterval.current) clearInterval(timeInterval.current);
      if (gameInterval.current) clearInterval(gameInterval.current);
    };
  }, []);

  const renderStars = (starCount: number) => {
    return '⭐'.repeat(starCount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-800 mb-2">🏀 Fast Break</h1>
        <p className="text-lg text-gray-600">Alternate A and D keys to sprint to the hoop!</p>
      </div>

      {gameState === 'idle' && (
        <div className="text-center space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Your Name</h2>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              maxLength={20}
            />
            <button
              onClick={startGame}
              className="mt-4 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Start Game
            </button>
          </div>
          
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6">
          {/* Game Info */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{score}</div>
              <div className="text-sm text-gray-600">Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{timeLeft}</div>
              <div className="text-sm text-gray-600">Seconds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{Math.floor(playerPosition / 20)}</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>

          {/* Game Area */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="relative h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-lg overflow-hidden">
              {/* Player */}
              <div 
                className="absolute bottom-4 w-8 h-8 bg-blue-600 rounded-full transition-all duration-200 ease-out"
                style={{ left: `${playerPosition}px` }}
              >
                <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  🏃
                </div>
              </div>
              
              {/* Basketball Hoop */}
              <div className="absolute right-4 bottom-4 w-12 h-12">
                <div className="w-12 h-8 bg-orange-500 rounded-t-full border-4 border-orange-700"></div>
                <div className="w-2 h-8 bg-orange-700 mx-auto"></div>
              </div>
              
              {/* Finish Line */}
              <div className="absolute right-16 bottom-0 w-1 h-full bg-red-500"></div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-center mb-4">Controls</h3>
            <div className="flex justify-center space-x-8">
              <button
                onClick={() => handleButtonPress('A')}
                className="w-20 h-20 bg-red-500 text-white text-2xl font-bold rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                A
              </button>
              <button
                onClick={() => handleButtonPress('D')}
                className="w-20 h-20 bg-blue-500 text-white text-2xl font-bold rounded-full hover:bg-blue-600 transition-colors shadow-lg"
              >
                D
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              Or use your keyboard: A and D keys
            </p>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="text-center space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-indigo-800 mb-4">Game Over!</h2>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-indigo-600">{score}</div>
                <div className="text-gray-600">Total Steps</div>
              </div>
              <div>
                <div className="text-3xl text-yellow-500">{renderStars(stars)}</div>
                <div className="text-gray-600">Rating</div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={resetGame}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Play Again
              </button>
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Leaderboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🏆 Leaderboard</h2>
          {isLoading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((score, index) => (
                <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                    <span className="font-semibold text-gray-800">{score.player_id}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{score.score} steps</span>
                    <span className="text-yellow-500">{renderStars(score.stars)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">No scores yet. Be the first to play!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FastBreakGame;
