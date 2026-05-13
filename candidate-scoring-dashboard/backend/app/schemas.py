from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    REVIEWER = "reviewer"

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ScoreCreate(BaseModel):
    category: str
    score: int = Field(ge=1, le=5)
    note: Optional[str] = ""

class ScoreResponse(BaseModel):
    id: int
    candidate_id: int
    category: str
    score: int
    reviewer_id: int
    note: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class CandidateCreate(BaseModel):
    name: str
    email: EmailStr
    role_applied: str
    skills: List[str]
    status: Optional[str] = "new"

class CandidateUpdate(BaseModel):
    status: Optional[str] = None
    internal_notes: Optional[str] = None

class CandidateResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role_applied: str
    status: str
    skills: List[str]
    internal_notes: Optional[str] = None
    created_at: datetime
    scores: List[ScoreResponse] = []
    
    class Config:
        from_attributes = True

class AISummaryResponse(BaseModel):
    summary: str
    generated_at: datetime