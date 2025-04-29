from sqlalchemy import JSON, String, Column, Integer, ForeignKey, Boolean
from database import Base, default_session_factory
from sqlalchemy.orm import relationship


# class Page(Base):
#     __tablename__ = 'page'
#     id = Column(Integer,primary_key=True, index=True)
#     home = Column(JSON)
#     about = Column(JSON)
#     contact = Column(JSON)
#     footer = Column(JSON)
#     user = relationship("Users",back_populates='page')


class Page(Base):
    __tablename__ = "page"
    id = Column(Integer, primary_key=True, index=True)
    page_name = Column(String, unique=True)
    page_data = Column(JSON)
    user = relationship("Users", back_populates="page")


class Careers(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    job = Column(String)
    type = Column(String)
    location = Column(String)
    details = Column(JSON)
    user = relationship("Users", back_populates="career")


class Employee(Base):
    __tablename__ = "employee"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    designation = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    city = Column(String)


class Roles(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String, nullable=False)
    permissions = Column(JSON)
    user = relationship("Users", back_populates="role")


class Users(Base):
    __tablename__ = "user_table"

    id = Column(Integer, primary_key=True, index=True)
    profile = Column(String)
    username = Column(String, unique=True)
    password = Column(String)
    role_id = Column(Integer, ForeignKey("roles.id"), default=None, nullable=True)
    career_id = Column(Integer, ForeignKey("careers.id"), default=None, nullable=True)
    page_id = Column(Integer, ForeignKey("page.id"), default=None, nullable=True)
    name = Column(String)
    is_super = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    role = relationship("Roles", back_populates="user")
    career = relationship("Careers", back_populates="user")
    page = relationship("Page", back_populates="user")


async def get_db():
    async with default_session_factory() as db:
        try:
            yield db
        finally:
            db.close()


# Base.metadata.create_all(engine)
