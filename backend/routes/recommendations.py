from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from typing import List 

router = APIRouter(prefix="/recommendation", tags=["Recommendation"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.PredefinedRoutineOut])
def recommend_routines(
    target_area: str = Query(...),
    level: str = Query(...),
    db: Session = Depends(get_db)
):
    return db.query(models.PredefinedRoutine).filter(
        models.PredefinedRoutine.target_area == target_area,
        models.PredefinedRoutine.level == level
    ).all()