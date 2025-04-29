from fastapi import Depends, Form, Request, APIRouter
from sqlalchemy.orm import Session
from src.utils.helper import JWTBearer
import schema
import Serializer
from ..controllers.auth import AuthController
from database import get_db  # Import get_db from database.py

router_with_token = APIRouter()
router_without_token = APIRouter()

@router_without_token.post("/register")
def register(user: schema.Register = Depends(schema.Register.as_form), db: Session = Depends(get_db)):
    return AuthController().register(user, db)

@router_without_token.post("/login")
def login(user: schema.Login, db: Session = Depends(get_db)):
    return AuthController().login(user, db)

@router_with_token.post("/refresh", dependencies=[Depends(JWTBearer())])
def refresh(request: Request):
    return AuthController().refresh(request)

@router_with_token.get("/get_user")
def get_user(db: Session = Depends(get_db)):
    return AuthController().get_user(db)

@router_with_token.get("/get_user/{user_id}", response_model=Serializer.UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    return AuthController().get_user_by_id(user_id, db)

@router_with_token.put("/update_user/{user_id}")
def update_user(user: schema.UpdateUser, user_id: int, db: Session = Depends(get_db)):
    return AuthController().update_user(user, user_id, db)

@router_with_token.delete("/delete_user/{user_id}")
def delete_user_row(user_id: int, db: Session = Depends(get_db)):
    return AuthController().delete_user_row(user_id, db)