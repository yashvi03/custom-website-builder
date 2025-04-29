from fastapi import APIRouter, Request, status, Depends
from sqlalchemy.orm import Session
import schema
import Serializer
from ..controllers.careers import CareerController
from src.utils.helper import AuthHelper
from database import get_db

router_with_token = APIRouter()

@router_with_token.post("/add_career")
def add_career(request: Request, c: schema.CareerSchema, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, ""):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return CareerController().add_career(c, db)

@router_with_token.get("/get_career")
def get_career(db: Session = Depends(get_db)):
    return CareerController().get_career(db)

@router_with_token.put("/update_career/{career_id}")
def update_career(request: Request, c: schema.CareerSchema, career_id: int, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, ""):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return CareerController().update_career(c, career_id, db)

@router_with_token.get(
    "/get_career/{career_id}", response_model=Serializer.CareerResponseSerializer
)
def get_career_by_id(career_id: int, db: Session = Depends(get_db)):
    return CareerController().get_career_by_id(career_id, db)

@router_with_token.delete("/delete_career/{career_id}")
def delete_career_card(request: Request, career_id: int, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, ""):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return CareerController().delete_career_card(career_id, db)