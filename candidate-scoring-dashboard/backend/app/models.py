from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role_applied = Column(String, nullable=False)
    status = Column(String, default="new")  # new/reviewed/hired/rejected/archived
    skills = Column(Text)  # JSON string of skills
    internal_notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)  # For soft delete
    
    scores = relationship("Score", back_populates="candidate", cascade="all, delete-orphan")

class Score(Base):
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    category = Column(String, nullable=False)  # technical, communication, problem_solving, etc.
    score = Column(Integer, nullable=False)  # 1-5
    reviewer_id = Column(Integer, nullable=False)
    note = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    candidate = relationship("Candidate", back_populates="scores")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin or reviewer
    created_at = Column(DateTime(timezone=True), server_default=func.now())