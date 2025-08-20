# users.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from typing import Optional
# CORREGIDO: Importamos la función de hasheo
from security import get_password_hash

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREAR USUARIO (Para Admins)
@router.post("/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    
    # CORREGIDO: Hasheamos la contraseña
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

# LISTAR TODOS LOS USUARIOS
@router.get("/", response_model=list[schemas.UserOut])
def get_users(db: Session = Depends(get_db), trainer_id: Optional[int] = Query(None)):
    # CORREGIDO: Se añade la lógica para filtrar por trainer_id si se proporciona
    if trainer_id is not None:
        # Esta es una lógica de ejemplo. Necesitarías definir la relación
        # de "usuarios de un entrenador" en tus modelos.
        # Por ahora, devolvemos todos los usuarios que no son entrenadores/admins.
        # La lógica correcta dependerá de tu modelo de negocio.
        return db.query(models.User).filter(models.User.role == 'usuario').all()
    
    return db.query(models.User).all()


# ELIMINAR USUARIO POR ID
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(user)
    db.commit()
    return {"detail": "Usuario eliminado"}

# CAMBIAR ROL DE USUARIO
from pydantic import BaseModel
class RoleUpdate(BaseModel):
    role: str

@router.put("/{user_id}/role")
def update_user_role(user_id: int, data: RoleUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.role = data.role
    db.commit()
    db.refresh(user)
    return {"detail": f"Rol actualizado a {data.role}"}

@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db_user.name = user.name
    db_user.email = user.email
    db_user.role = user.role
    # CORREGIDO: Hasheamos la contraseña si se proporciona una nueva
    if user.password:
        db_user.password = get_password_hash(user.password)
    db.commit()
    db.refresh(db_user)
    return db_user