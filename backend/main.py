from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from typing import List, Optional
import os

# Database setup
DATABASE_URL = "sqlite:///./fastbreak.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class Score(Base):
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(String, index=True)
    game_type = Column(String, index=True)
    score = Column(Integer)
    stars = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class ScoreCreate(BaseModel):
    player_id: str
    game_type: str
    score: int
    stars: int

class ScoreResponse(BaseModel):
    id: int
    player_id: str
    game_type: str
    score: int
    stars: int
    timestamp: datetime

class LeaderboardResponse(BaseModel):
    scores: List[ScoreResponse]
    total: int

# FastAPI app
app = FastAPI(title="Fast Break API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/score", response_model=ScoreResponse)
async def save_score(score: ScoreCreate, db = Depends(get_db)):
    """Save a player's score"""
    db_score = Score(
        player_id=score.player_id,
        game_type=score.game_type,
        score=score.score,
        stars=score.stars
    )
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

@app.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    game_type: str = "fast_break",
    limit: int = 10,
    db = Depends(get_db)
):
    """Get top scores for a specific game type"""
    scores = db.query(Score)\
        .filter(Score.game_type == game_type)\
        .order_by(Score.score.desc())\
        .limit(limit)\
        .all()
    
    total = db.query(Score).filter(Score.game_type == game_type).count()
    
    return LeaderboardResponse(scores=scores, total=total)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
