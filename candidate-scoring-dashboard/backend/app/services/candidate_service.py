# Service layer for business logic
import json
from sqlalchemy.orm import Session
from app import models, schemas

def create_candidate(db: Session, candidate_data: schemas.CandidateCreate):
    """Create a new candidate"""
    skills_json = json.dumps(candidate_data.skills)
    db_candidate = models.Candidate(
        name=candidate_data.name,
        email=candidate_data.email,
        role_applied=candidate_data.role_applied,
        skills=skills_json,
        status=candidate_data.status
    )
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def calculate_average_score(candidate: models.Candidate):
    """Calculate average score for a candidate"""
    if not candidate.scores:
        return 0
    return sum(score.score for score in candidate.scores) / len(candidate.scores)