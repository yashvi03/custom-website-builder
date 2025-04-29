from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from contextlib import contextmanager
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import SQLAlchemyError
import os

URL_DATABASE = 'postgresql://postgres:Yashvi%402003@localhost:5432/form'

Base = declarative_base()

class DatabaseSessionFactory:
    def __init__(self):
        self.engine = create_engine(
            URL_DATABASE,
            pool_size=20,
            max_overflow=0,
            pool_timeout=30,
            pool_recycle=1800,
            pool_pre_ping=True,
            echo=bool(int(os.getenv("DEBUG", 0))),
        )
        self.session_maker = sessionmaker(self.engine, expire_on_commit=False)

    @contextmanager
    def __call__(self):
        session = self.session_maker()
        try:
            yield session
            session.commit()
        except SQLAlchemyError as e:
            session.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        finally:
            session.close()

default_session_factory = DatabaseSessionFactory()

def get_db():
    with default_session_factory() as session:
        yield session