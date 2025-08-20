# routes/reports.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import SessionLocal
import models
from datetime import datetime, timedelta

router = APIRouter(prefix="/reports", tags=["Reports"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/login_activity")
def get_login_activity(db: Session = Depends(get_db)):
    """Devuelve los últimos 20 inicios de sesión registrados."""
    logs = db.query(models.ActivityLog).filter(models.ActivityLog.action == "User Login")\
             .order_by(models.ActivityLog.timestamp.desc()).limit(20).all()
    return logs

@router.get("/top_trainers_by_assignments")
def get_top_trainers(db: Session = Depends(get_db)):
    """Devuelve el top 5 de entrenadores con más usuarios únicos asignados a sus rutinas."""
    results = db.query(
        models.User.name,
        func.count(models.UserRoutine.user_id.distinct()).label('assigned_users_count')
    )\
    .join(models.Routine, models.Routine.trainer_id == models.User.id)\
    .join(models.UserRoutine, models.UserRoutine.routine_id == models.Routine.id)\
    .group_by(models.User.name)\
    .order_by(func.count(models.UserRoutine.user_id.distinct()).desc())\
    .limit(5).all()
    
    return [{"trainer_name": name, "assigned_users": count} for name, count in results]

@router.get("/most_active_users")
def get_most_active_users(db: Session = Depends(get_db)):
    """Devuelve los 5 usuarios con más registros de progreso en los últimos 30 días."""
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    results = db.query(
        models.User.name,
        func.count(models.Progress.id).label('progress_count')
    )\
    .join(models.Progress, models.Progress.user_id == models.User.id)\
    .filter(models.Progress.date >= thirty_days_ago, models.User.role == 'usuario')\
    .group_by(models.User.name)\
    .order_by(func.count(models.Progress.id).desc())\
    .limit(5).all()

    return [{"user_name": name, "progress_entries": count} for name, count in results]