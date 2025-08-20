from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://fituser:fitpassword@localhost/fittogether"
engine = create_engine(SQLALCHEMY_DATABASE_URL)   # ← Usar el nombre correcto
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
