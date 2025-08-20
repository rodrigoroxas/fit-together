from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas

router = APIRouter(prefix="/user_routines", tags=["UserRoutine"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.UserRoutineOut)
def assign_routine_to_user(assignment: schemas.UserRoutineCreate, db: Session = Depends(get_db)):
    # Opcional: verifica que el usuario y la rutina existen
    user = db.query(models.User).filter(models.User.id == assignment.user_id).first()
    routine = db.query(models.Routine).filter(models.Routine.id == assignment.routine_id).first()
    if not user or not routine:
        raise HTTPException(status_code=404, detail="Usuario o rutina no existe")
    # Evita duplicados
    exists = db.query(models.UserRoutine).filter_by(user_id=assignment.user_id, routine_id=assignment.routine_id).first()
    if exists:
        raise HTTPException(status_code=400, detail="Esta rutina ya está asignada a este usuario")
    user_routine = models.UserRoutine(**assignment.dict())
    db.add(user_routine)
    db.commit()
    db.refresh(user_routine)
    return user_routine

@router.delete("/{user_routine_id}")
def delete_user_routine(user_routine_id: int, db: Session = Depends(get_db)):
    ur = db.query(models.UserRoutine).filter(models.UserRoutine.id == user_routine_id).first()
    if not ur:
        raise HTTPException(status_code=404, detail="Asignación no encontrada")
    db.delete(ur)
    db.commit()
    return {"detail": "Asignación eliminada"}

# ------------- AGREGA ESTE GET para que tu frontend funcione --------------
@router.get("/by_user/{user_id}", response_model=list[schemas.UserRoutineOut])
def get_user_routines_by_user(user_id: int, db: Session = Depends(get_db)):
    """
    Devuelve todas las rutinas asignadas a un usuario.
    """
    return db.query(models.UserRoutine).filter(models.UserRoutine.user_id == user_id).all()
