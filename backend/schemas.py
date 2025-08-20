from pydantic import BaseModel
from datetime import date
from typing import Optional, List

# ------------- USUARIO Y AUTENTICACIÓN -------------

class UserBase(BaseModel):
    name: str
    email: str
    role: str   # 'superadmin', 'entrenador', 'usuario'

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True

# ------------- RUTINA -------------

class RoutineBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration: int
    target_area: str
    level: str
    
class RoutineCreate(RoutineBase):
    trainer_id: Optional[int] = None
    user_id: Optional[int] = None  # <-- Para asociación rápida

class RoutineOut(RoutineBase):
    id: int
    trainer_id: Optional[int] = None
    user_id: Optional[int] = None
    class Config:
        from_attributes = True

# --------- Para /from_recommendation/ ---------
class RoutineFromRecommendation(BaseModel):
    name: str
    description: str
    duration: int
    target_area: str
    level: str
    user_id: int

# ------------- RUTINA PREDEFINIDA -------------

class PredefinedRoutineOut(BaseModel):
    id: int
    name: str
    target_area: str
    level: str
    duration: int
    description: str
    class Config:
        from_attributes = True

# ------------- PROGRESO -------------

class ProgressBase(BaseModel):
    user_id: int
    date: date
    routine_id: Optional[int] = None
    user_routine_id: Optional[int] = None
    weight: Optional[float] = None
    repetitions: Optional[int] = None
    calories: Optional[int] = None
    notes: Optional[str] = None

class ProgressCreate(ProgressBase):
    pass

class ProgressOut(ProgressBase):
    id: int
    # --- INICIO DE LA CORRECCIÓN ---
    # Se añade el objeto 'routine' para que la API devuelva los detalles completos
    # de la rutina asociada a cada registro de progreso.
    routine: Optional[RoutineOut] = None
    # --- FIN DE LA CORRECCIÓN ---

    class Config:
        from_attributes = True

# ------------- ASIGNACIÓN RUTINA - USUARIO -------------

class UserRoutineBase(BaseModel):
    user_id: int
    routine_id: int

class UserRoutineCreate(UserRoutineBase):
    pass

class UserRoutineOut(UserRoutineBase):
    id: int
    routine: RoutineOut

    class Config:
        from_attributes = True

# ------------- LOGS (Bitácora de actividad) -------------

class ActivityLogOut(BaseModel):
    id: int
    timestamp: str
    action: str
    details: Optional[str] = None
    class Config:
        from_attributes = True