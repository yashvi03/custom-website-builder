import models
import schema
from sqlalchemy.exc import SQLAlchemyError
from fastapi import status, HTTPException, Depends
from sqlalchemy.orm import Session
from src.utils.helper import AuthHelper

class CareerController(AuthHelper):
    def add_career(self, c: schema.CareerSchema, db: Session = Depends(models.get_db)):
        try:
            db_career = models.Careers(
                job=c.job,
                type=c.type,
                location=c.location,
                details=c.details.model_dump(),
            )
            if db.query(models.Careers).filter(models.Careers.job == c.job).first():
                return {
                    "status": status.HTTP_403_FORBIDDEN,
                    "message": "Job already exists",
                    "data": db_career
                }
            db.add(db_career)
            db.commit()
            db.refresh(db_career)
            return {"status": status.HTTP_200_OK, "message": "Successfully added", "data": db_career}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=403, detail=f"Job not added: {e}")
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Job not added",
            )

    def get_career(self, db: Session = Depends(models.get_db)):
        career = db.query(models.Careers).all()
        return {"status": status.HTTP_200_OK, "message": "", "data": career}

    def update_career(self, c: schema.CareerSchema, career_id: int, db: Session = Depends(models.get_db)):
        try:
            career = db.query(models.Careers).filter(models.Careers.id == career_id).first()
            if career:
                career.job = c.job
                career.type = c.type
                career.location = c.location
                career.details = c.details.model_dump()
                db.commit()
                return {"status": status.HTTP_200_OK, "message": "Successfully updated"}
            else:
                raise HTTPException(status_code=404, detail="Career not found")
        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()

    def get_career_by_id(self, career_id: int, db: Session = Depends(models.get_db)):
        career = (
            db.query(
                models.Careers.id,
                models.Careers.job,
                models.Careers.type,
                models.Careers.location,
                models.Careers.details,
            )
            .filter(models.Careers.id == career_id)
            .first()
        )
        return {"status": status.HTTP_200_OK, "message": "", "data": career}

    def delete_career_card(self, career_id: int, db: Session = Depends(models.get_db)):
        try:
            career = db.query(models.Careers).filter(models.Careers.id == career_id).first()
            if career:
                db.delete(career)
                db.commit()
                return {"status": status.HTTP_200_OK, "message": "Successfully deleted"}
            else:
                raise HTTPException(status_code=404, detail="Career not found")
        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()