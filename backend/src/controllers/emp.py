import models
import schema
from sqlalchemy.exc import SQLAlchemyError
from fastapi import status, HTTPException, Depends
from sqlalchemy.orm import Session
from src.utils.helper import AuthHelper

class EmpController(AuthHelper):
    def add_employee(self, emp: schema.Create, db: Session = Depends(models.get_db)):
        try:
            db_emp = models.Employee(
                name=emp.name,
                designation=emp.designation,
                email=emp.email,
                phone=emp.phone,
                city=emp.city,
            )
            
            if db.query(models.Employee).filter(models.Employee.email == emp.email).first():
                return {
                    "status": status.HTTP_403_FORBIDDEN,
                    "message": "Employee already exists",
                }
            db.add(db_emp)
            db.commit()
            db.refresh(db_emp)
            return {"status": status.HTTP_200_OK, "message": "Successfully added"}
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=403, detail=f"Employee detail not added: {e}"
            )
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Employee detail not added",
            )

    def get_employee(self, db: Session = Depends(models.get_db)):
        employee = db.query(models.Employee).all()
        return {"status": status.HTTP_200_OK, "message": "", "data": employee}

    def update_employee(self, emp: schema.Create, emp_id: int, db: Session = Depends(models.get_db)):
        try:
            emp_item = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
            if emp_item:
                emp_item.name = emp.name
                emp_item.designation = emp.designation
                emp_item.email = emp.email
                emp_item.phone = emp.phone
                emp_item.city = emp.city
                db.commit()
                return {"status": status.HTTP_200_OK, "message": "Successfully updated"}
            else:
                raise HTTPException(status_code=404, detail="Employee not found")
        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()

    def get_employee_by_id(self, emp_id: int, db: Session = Depends(models.get_db)):
        emp_item = (
            db.query(
                models.Employee.id,
                models.Employee.name,
                models.Employee.designation,
                models.Employee.email,
                models.Employee.phone,
                models.Employee.city,
            )
            .filter(models.Employee.id == emp_id)
            .first()
        )
        return {"status": status.HTTP_200_OK, "message": "", "data": emp_item}

    def delete_emp_row(self, emp_id: int, db: Session = Depends(models.get_db)):
        try:
            emp_item = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
            if emp_item:
                db.delete(emp_item)
                db.commit()
                return {"status": status.HTTP_200_OK, "message": "Successfully deleted"}
            else:
                raise HTTPException(status_code=404, detail="Employee not found")
        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()