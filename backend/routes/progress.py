from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas

router = APIRouter(prefix="/progress", tags=["Progress"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ProgressOut)
def create_progress(progress: schemas.ProgressCreate, db: Session = Depends(get_db)):
    db_progress = models.Progress(**progress.dict())
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress

@router.get("/user/{user_id}", response_model=list[schemas.ProgressOut])
def get_progress_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Progress).filter(models.Progress.user_id == user_id).all()
