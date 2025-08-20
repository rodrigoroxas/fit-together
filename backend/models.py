from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Float, Text, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    role = Column(String(20), nullable=False)  # 'superadmin', 'entrenador', 'usuario'

    # Rutinas creadas como entrenador
    trainer_routines = relationship(
        "Routine",
        foreign_keys="[Routine.trainer_id]",
        back_populates="trainer"
    )
    # Rutinas personales asignadas (como usuario)
    personal_routines = relationship(
        "Routine",
        foreign_keys="[Routine.user_id]",
        back_populates="user"
    )
    # Asignaciones de rutinas (muchos a muchos)
    user_routines = relationship(
        "UserRoutine",
        back_populates="user"
    )
    # Logs de actividad
    logs = relationship(
        "ActivityLog",
        back_populates="user"
    )
    # Progresos
    progress_entries = relationship(
        "Progress",
        back_populates="user"
    )

class Routine(Base):
    __tablename__ = "routines"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    duration = Column(Integer, nullable=False)
    target_area = Column(String(50))
    level = Column(String(20))
    trainer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    trainer = relationship(
        "User",
        foreign_keys=[trainer_id],
        back_populates="trainer_routines"
    )
    user = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="personal_routines"
    )
    user_routines = relationship(
        "UserRoutine",
        back_populates="routine"
    )
    progress_entries = relationship(
        "Progress",
        back_populates="routine"
    )

class UserRoutine(Base):
    __tablename__ = "user_routines"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    routine_id = Column(Integer, ForeignKey("routines.id"))
    assigned_at = Column(DateTime, default=datetime.utcnow)
    accepted = Column(Boolean, default=False)
    completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="user_routines")
    routine = relationship("Routine", back_populates="user_routines")
    progress_entries = relationship("Progress", back_populates="user_routine")

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user_routine_id = Column(Integer, ForeignKey("user_routines.id"), nullable=True)
    routine_id = Column(Integer, ForeignKey("routines.id"), nullable=True)
    date = Column(Date, default=datetime.utcnow)
    weight = Column(Float, nullable=True)
    repetitions = Column(Integer, nullable=True)
    calories = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="progress_entries")
    user_routine = relationship("UserRoutine", back_populates="progress_entries")
    routine = relationship("Routine", back_populates="progress_entries")

class PredefinedRoutine(Base):
    __tablename__ = "predefined_routines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    target_area = Column(String(50))
    level = Column(String(50))
    duration = Column(Integer)
    description = Column(String(500))

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(100))
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(Text, nullable=True)

    user = relationship("User", back_populates="logs")
