# routes/auth.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from security import get_password_hash, verify_password
from datetime import datetime # Se importa datetime

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.UserOut)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # --- INICIO DE LA MODIFICACIÓN ---
    # Se crea un registro en el log de actividad para el inicio de sesión
    new_log = models.ActivityLog(
        user_id=db_user.id,
        action="User Login",
        timestamp=datetime.utcnow(),
        details=f"El usuario {db_user.name} ha iniciado sesión."
    )
    db.add(new_log)
    db.commit()
    # --- FIN DE LA MODIFICACIÓN ---

    return db_user