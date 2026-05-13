from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, database
from app.routers import candidates, auth

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Candidate Scoring API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(candidates.router, prefix="/api/candidates", tags=["candidates"])

@app.get("/")
def root():
    return {"message": "Candidate Scoring API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}