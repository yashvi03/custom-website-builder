from fastapi import APIRouter, File, UploadFile, Request, status, Depends
from sqlalchemy.orm import Session
import schema
import Serializer
from ..controllers.page import PageController
from src.utils.helper import AuthHelper
from database import get_db
from slowapi import Limiter
from slowapi.util import get_remote_address
import requests

router_with_token = APIRouter()

limiter = Limiter(key_func=get_remote_address, default_limits=["3 per minute"])

@router_with_token.get("/get_page")
@limiter.limit("10/minute")
def get_page(request: Request, db: Session = Depends(get_db)):
    return PageController().get_page(db)

@router_with_token.put("/update_page")
def update_page(request: Request, page: schema.PageSchema, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, ""):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return PageController().update_page(page, db)

@router_with_token.put("/upload_image")
def upload_image(request: Request, home: str, image: UploadFile = File(...), db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, ""):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return PageController().upload_image(home, image, db)