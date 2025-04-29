import models
import schema
from sqlalchemy.exc import SQLAlchemyError
from fastapi import status, HTTPException, Depends
from sqlalchemy.orm import Session

class RoleController:
    def add_role(self, role: schema.RoleSchema, db: Session = Depends(models.get_db)):
        try:
            permissions_json = [perm.model_dump() for perm in role.permissions]
            db_role = models.Roles(
                role_name=role.role_name, permissions=permissions_json
            )
            if db.query(models.Roles).filter(models.Roles.role_name == role.role_name).first():
                return {
                    "status": status.HTTP_403_FORBIDDEN,
                    "message": "This role already exists",
                }
            db.add(db_role)
            db.commit()
            return {
                "status": status.HTTP_200_OK,
                "message": "Role added successfully",
                "data": db_role,
            }
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=403, detail=f"Role detail not added: {e}"
            )
        except SQLAlchemyError:
            db.rollback()
            return {
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "",
                "data": "",
            }

    def get_role(self, db: Session = Depends(models.get_db)):
        role = db.query(models.Roles).all()
        return {"status": status.HTTP_200_OK, "message": "", "data": role}

    def update_role(self, role: schema.RoleSchema, role_id: int, db: Session = Depends(models.get_db)):
        try:
            permissions_json = [perm.model_dump() for perm in role.permissions]
            role_item = db.query(models.Roles).filter(models.Roles.id == role_id).first()
            if role_item:
                role_item.role_name = role.role_name
                role_item.permissions = permissions_json
                db.commit()
                return {
                    "status": status.HTTP_200_OK,
                    "message": "Data updated",
                    "data": role_item,
                }
            else:
                raise HTTPException(status_code=404, detail="Role not found")
        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()

    def get_role_by_id(self, role_id: int, just_per: bool, db: Session = Depends(models.get_db)):
        fields = (
            (models.Roles.permissions,)
            if just_per
            else (
                models.Roles.id,
                models.Roles.role_name,
                models.Roles.permissions,
            )
        )
        role_item = db.query(*fields).filter(models.Roles.id == role_id).first()
        return {"status": status.HTTP_200_OK, "message": "", "data": role_item}

    def delete_role_row(self, role_id: int, db: Session = Depends(models.get_db)):
        try:
            role_item = db.query(models.Roles).filter(models.Roles.id == role_id).first()
            if role_item:
                db.delete(role_item)
                db.commit()
                return {
                    "status": status.HTTP_200_OK,
                    "message": "Successfully Deleted",
                    "data": role_item,
                }
            else:
                raise HTTPException(status_code=404, detail="Role not found")
        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()

    def get_roles_for_user(self, db: Session = Depends(models.get_db)):
        roles = db.query(models.Roles.id.label("role_id"), models.Roles.role_name).all()
        return {"status": status.HTTP_200_OK, "message": "", "data": roles}