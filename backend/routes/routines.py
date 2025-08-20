# routines.py
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import Optional
from database import SessionLocal
import models, schemas
from models import UserRoutine

router = APIRouter(prefix="/routines", tags=["Routines"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.RoutineOut)
def create_routine(routine: schemas.RoutineCreate, db: Session = Depends(get_db)):
    routine_data = routine.dict(exclude_unset=True)
    user_id = routine_data.pop("user_id", None)
    new_routine = models.Routine(**routine_data)
    db.add(new_routine)
    db.commit()
    db.refresh(new_routine)

    if user_id:
        user_routine = UserRoutine(user_id=user_id, routine_id=new_routine.id)
        db.add(user_routine)
        db.commit()

    return new_routine

@router.get("/", response_model=list[schemas.RoutineOut])
def get_routines(trainer_id: int = Query(None), db: Session = Depends(get_db)):
    if trainer_id is not None:
        return db.query(models.Routine).filter(models.Routine.trainer_id == trainer_id).all()
    return db.query(models.Routine).all()

@router.get("/user/{user_id}", response_model=list[schemas.RoutineOut])
def get_user_routines(user_id: int, db: Session = Depends(get_db)):
    user_routines = db.query(models.UserRoutine).filter(models.UserRoutine.user_id == user_id).all()
    routines = [ur.routine for ur in user_routines if ur.routine is not None]
    direct_routines = db.query(models.Routine).filter(models.Routine.user_id == user_id).all()
    return routines + direct_routines


@router.post("/from_recommendation/", response_model=schemas.RoutineOut)
def add_routine_from_recommendation(
    # CORREGIDO: Se usa el schema correcto para hacer la API más robusta
    routine: schemas.RoutineFromRecommendation, db: Session = Depends(get_db)
):
    new_routine = models.Routine(
        name=routine.name,
        description=routine.description,
        duration=routine.duration,
        target_area=routine.target_area,
        level=routine.level,
        user_id=routine.user_id,
        trainer_id=None
    )
    db.add(new_routine)
    db.commit()
    db.refresh(new_routine)

    if routine.user_id:
        user_routine = models.UserRoutine(user_id=routine.user_id, routine_id=new_routine.id)
        db.add(user_routine)
        db.commit()

    return new_routine

@router.delete("/{routine_id}", status_code=204)
def delete_routine(
    routine_id: int, 
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    if user_id is not None:
        # Lógica para eliminar una rutina personal o una asignación
        routine = db.query(models.Routine).filter(
            models.Routine.id == routine_id, 
            models.Routine.user_id == user_id
        ).first()
        if routine:
            db.delete(routine)
            db.commit()
            # CORREGIDO: Devuelve una respuesta 204 sin cuerpo
            return Response(status_code=204)
            
        user_routine = db.query(models.UserRoutine).filter(
            models.UserRoutine.routine_id == routine_id,
            models.UserRoutine.user_id == user_id
        ).first()
        if user_routine:
            db.delete(user_routine)
            db.commit()
            # CORREGIDO: Devuelve una respuesta 204 sin cuerpo
            return Response(status_code=204)
            
        raise HTTPException(status_code=404, detail="Rutina no encontrada o no tienes permiso para eliminarla.")
    else:
        # Lógica para que un admin/entrenador elimine una rutina maestra
        routine = db.query(models.Routine).filter(models.Routine.id == routine_id).first()
        if not routine:
            raise HTTPException(status_code=404, detail="Rutina no encontrada")
        db.delete(routine)
        db.commit()
        # CORREGIDO: Devuelve una respuesta 204 sin cuerpo
        return Response(status_code=204)