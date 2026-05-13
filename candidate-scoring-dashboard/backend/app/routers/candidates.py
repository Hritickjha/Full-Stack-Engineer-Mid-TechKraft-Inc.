from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import asyncio
import json
from app import models, schemas, auth, database
from app.services import candidate_service

router = APIRouter()

@router.get("/", response_model=dict)
def get_candidates(
    status: Optional[str] = Query(None),
    role_applied: Optional[str] = Query(None),
    skill: Optional[str] = Query(None),
    keyword: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get candidates with filters and pagination"""
    query = db.query(models.Candidate).filter(models.Candidate.deleted_at.is_(None))
    
    # Apply filters
    if status:
        query = query.filter(models.Candidate.status == status)
    if role_applied:
        query = query.filter(models.Candidate.role_applied == role_applied)
    if skill:
        query = query.filter(models.Candidate.skills.contains(skill))
    if keyword:
        query = query.filter(
            (models.Candidate.name.contains(keyword)) |
            (models.Candidate.email.contains(keyword))
        )
    
    # Pagination
    total = query.count()
    offset = (page - 1) * page_size
    candidates = query.offset(offset).limit(page_size).all()
    
    # Convert to response model
    result = []
    for candidate in candidates:
        # Only show internal_notes to admin
        candidate_dict = {
            "id": candidate.id,
            "name": candidate.name,
            "email": candidate.email,
            "role_applied": candidate.role_applied,
            "status": candidate.status,
            "skills": json.loads(candidate.skills) if candidate.skills else [],
            "internal_notes": candidate.internal_notes if current_user.role == "admin" else None,
            "created_at": candidate.created_at,
            "scores": []
        }
        result.append(candidate_dict)
    
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "candidates": result
    }

@router.get("/{candidate_id}", response_model=schemas.CandidateResponse)
def get_candidate(
    candidate_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get candidate details with scores"""
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id,
        models.Candidate.deleted_at.is_(None)
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Filter scores based on role
    if current_user.role == "admin":
        scores = candidate.scores
    else:
        scores = [s for s in candidate.scores if s.reviewer_id == current_user.id]
    
    # Parse skills from JSON string
    skills = json.loads(candidate.skills) if candidate.skills else []
    
    return schemas.CandidateResponse(
        id=candidate.id,
        name=candidate.name,
        email=candidate.email,
        role_applied=candidate.role_applied,
        status=candidate.status,
        skills=skills,
        internal_notes=candidate.internal_notes if current_user.role == "admin" else None,
        created_at=candidate.created_at,
        scores=scores
    )

@router.post("/{candidate_id}/scores", response_model=schemas.ScoreResponse)
def add_score(
    candidate_id: int,
    score_data: schemas.ScoreCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Submit a score for a candidate"""
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id,
        models.Candidate.deleted_at.is_(None)
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    new_score = models.Score(
        candidate_id=candidate_id,
        category=score_data.category,
        score=score_data.score,
        reviewer_id=current_user.id,
        note=score_data.note
    )
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    
    return new_score

@router.post("/{candidate_id}/summary")
async def generate_summary(
    candidate_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Mock AI summary generation (simulates 2s async call)"""
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id,
        models.Candidate.deleted_at.is_(None)
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Get scores for context
    if current_user.role == "admin":
        scores = candidate.scores
    else:
        scores = [s for s in candidate.scores if s.reviewer_id == current_user.id]
    
    # Simulate async LLM call with 2 second delay
    await asyncio.sleep(2)
    
    # Generate mock summary
    avg_score = sum(s.score for s in scores) / len(scores) if scores else 0
    summary = f"""
    AI-Generated Candidate Summary:
    
    Name: {candidate.name}
    Role Applied: {candidate.role_applied}
    Status: {candidate.status}
    
    Performance Metrics:
    - Total Reviews: {len(scores)}
    - Average Score: {avg_score:.2f}/5
    
    Assessment:
    Based on {len(scores)} review(s), this candidate shows {
        "strong potential" if avg_score >= 4 
        else "moderate fit" if avg_score >= 3 
        else "area for improvement"
    } for the {candidate.role_applied} position.
    
    Skills: {json.loads(candidate.skills) if candidate.skills else 'Not specified'}
    
    Recommendation: {
        "Proceed to next round" if avg_score >= 3.5
        else "Additional review needed" if avg_score >= 2.5
        else "Not recommended for advancement"
    }
    """
    
    return {
        "summary": summary.strip(),
        "generated_at": datetime.utcnow()
    }

@router.put("/{candidate_id}")
def update_candidate(
    candidate_id: int,
    update_data: schemas.CandidateUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_admin)  # Admin only
):
    """Update candidate (admin only)"""
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id,
        models.Candidate.deleted_at.is_(None)
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    if update_data.status:
        candidate.status = update_data.status
    if update_data.internal_notes:
        candidate.internal_notes = update_data.internal_notes
    
    db.commit()
    return {"message": "Candidate updated successfully"}

@router.delete("/{candidate_id}")
def delete_candidate(
    candidate_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_admin)  # Admin only
):
    """Soft delete candidate (admin only)"""
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id,
        models.Candidate.deleted_at.is_(None)
    ).first()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Soft delete - set deleted_at timestamp
    candidate.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": "Candidate archived successfully"}

@router.get("/{candidate_id}/stream")
async def stream_scores(
    candidate_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """SSE endpoint that streams score updates in real time"""
    async def event_generator():
        last_score_count = 0
        while True:
            # Check for new scores
            candidate = db.query(models.Candidate).filter(
                models.Candidate.id == candidate_id,
                models.Candidate.deleted_at.is_(None)
            ).first()
            
            if candidate:
                current_scores = candidate.scores
                if current_user.role == "admin":
                    scores = current_scores
                else:
                    scores = [s for s in current_scores if s.reviewer_id == current_user.id]
                
                if len(scores) != last_score_count:
                    last_score_count = len(scores)
                    yield f"data: {json.dumps({'type': 'update', 'score_count': last_score_count, 'scores': [s.score for s in scores]})}\n\n"
            
            await asyncio.sleep(2)  # Check every 2 seconds
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")