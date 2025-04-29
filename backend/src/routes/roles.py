from fastapi import APIRouter, Request, status, Depends
from sqlalchemy.orm import Session
import Serializer
import schema
from src.controllers.roles import RoleController
from src.utils.helper import AuthHelper
from database import get_db

router_with_token = APIRouter()
router_without_token = APIRouter()

@router_with_token.post("/role")
def add_role(request: Request, role: schema.RoleSchema, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, "add"):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return RoleController().add_role(role, db)

@router_with_token.get("/get_role")
def get_role(db: Session = Depends(get_db)):
    return RoleController().get_role(db)

@router_with_token.put("/update_role/{role_id}")
def update_role(request: Request, role: schema.RoleSchema, role_id: int, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, "edit"):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return RoleController().update_role(role, role_id, db)

@router_with_token.get("/get_role/{role_id}", response_model=Serializer.RoleResponse)
def get_role_by_id(request: Request, role_id: int, just_per: bool = False, db: Session = Depends(get_db)):
    if not just_per and not AuthHelper().check_permission(request, "view"):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return RoleController().get_role_by_id(role_id, just_per, db)

@router_with_token.delete("/delete_role/{role_id}")
def delete_role_row(request: Request, role_id: int, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, "delete"):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return RoleController().delete_role_row(role_id, db)

@router_without_token.get("/get_roles", response_model=Serializer.RoleNameResponse)
def get_roles_for_user(db: Session = Depends(get_db)):
    return RoleController().get_roles_for_user(db)