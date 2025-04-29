from fastapi import APIRouter, Request, status, Depends
from sqlalchemy.orm import Session
import schema
import Serializer
from ..controllers.emp import EmpController
from src.utils.helper import AuthHelper
from database import get_db

router_with_token = APIRouter()

@router_with_token.post("/employee")
def add_employee(request: Request, emp: schema.Create, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, "add"):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return EmpController().add_employee(emp, db)

@router_with_token.get("/get_emp")
def get_employee(db: Session = Depends(get_db)):
    return EmpController().get_employee(db)

@router_with_token.put("/update_emp/{emp_id}")
def update_employee(request: Request, emp: schema.Create, emp_id: int, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, "edit"):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return EmpController().update_employee(emp, emp_id, db)

@router_with_token.get("/get_emp/{emp_id}", response_model=Serializer.EmpResponse)
def get_employee_by_id(emp_id: int, db: Session = Depends(get_db)):
    return EmpController().get_employee_by_id(emp_id, db)

@router_with_token.delete("/delete_emp/{emp_id}")
def delete_emp_row(request: Request, emp_id: int, db: Session = Depends(get_db)):
    if not AuthHelper().check_permission(request, "delete"):
        return {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Permission Denied",
            "data": "Permission Denied",
        }
    return EmpController().delete_emp_row(emp_id, db)