import models
import schema
from sqlalchemy.orm import Session
from fastapi import Depends, status, HTTPException, Request
from src.utils.helper import AuthHelper
from sqlalchemy.exc import SQLAlchemyError
import shutil
from pathlib import Path

# Define the directory for file uploads and create it if it doesn't exist
UPLOAD_DIR = Path("static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class AuthController(AuthHelper):
    def register(
        self,
        user: schema.Register,
        db: Session = Depends(models.get_db),
    ):
        try:
            # Create a new user instance
            db_user = models.Users(
                username=user.username,
                password=user.password,             
                name=user.name,
            )

            # Save the uploaded profile picture to the upload directory
            file_location = UPLOAD_DIR / user.profile.filename
            with open(file_location, "wb") as buffer:
                shutil.copyfileobj(user.profile.file, buffer)
            db_user.profile = str(file_location)

            # Check if the user already exists in the database
            users = db.query(models.Users).filter(models.Users.username == user.username).first()

            if users:
                return {
                    "status": status.HTTP_403_FORBIDDEN,
                    "message": "User already exists",
                }

            # Hash the user's password and save the user to the database
            hashed_password = self.hash_password(user.password)
            db_user.password = hashed_password
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

            return {
                "status": status.HTTP_201_CREATED,
                "message": "User registered successfully",
                "user": {
                    "id": db_user.id,
                    "username": db_user.username,
                    "name": db_user.name,
                    "profile": db_user.profile,
                },
            }
        except Exception as e:
            raise HTTPException(
                status_code=403, detail=f"User not registered successfully, error: {e}"
            )

    def login(self, user: schema.Login, db: Session = Depends(models.get_db)):   
        try:
            # Query the user by username
            users = db.query(models.Users).filter(models.Users.username == user.username).first()

            if not users:
                return {
                    "status": status.HTTP_403_FORBIDDEN,
                    "message": "User does not exist. Please Sign up.",
                }

            # Verify the user's password
            self.verify_password(user.password, users.password)

            if not users.is_active:
                return {
                    "status": status.HTTP_403_FORBIDDEN,
                    "message": "Your account is deactivated, Please contact support",
                }

            elif not users.is_super and not users.role_id:
                return {
                    "status": status.HTTP_403_FORBIDDEN,
                    "message": "Your role is not defined yet, Please try again later",
                }

            # Create JWT tokens for the user
            access_token = self.create_jwt_tokens(
                {
                    "username": users.username,
                    "role_id": users.role_id,
                    "is_super": users.is_super,
                }
            )
            refresh_token = self.create_refresh_token(
                {
                    "username": users.username,
                    "role_id": users.role_id,
                    "is_super": users.is_super,
                }
            )

            return {
                "status": status.HTTP_200_OK,
                "message": "User logged in successfully",
                "data": users,
                "token": {**access_token, **refresh_token},
            }
        except Exception as e:
            raise HTTPException(
                status_code=403, detail=f"User could not login, error: {e}"
            )

    def refresh(self, request: Request):
        # Get the payload from the request state
        response = request.state.payload
        print(response)
        # Create new JWT tokens
        new_access_token = self.create_jwt_tokens(response)
        new_refresh_token = self.create_refresh_token(response)
        return {
            "token": {**new_access_token, **new_refresh_token},
        }

    def get_user(self, db: Session = Depends(models.get_db)):
        # Query pending users (users without a role)
        pending_users = (
            db.query(models.Users)
            .filter(models.Users.role_id.is_(None))
            .order_by(models.Users.id.desc())
            .all()
        )
        
        # Query authorized users (users with a role)
        authorized_users = (
            db.query(models.Users)
            .filter(models.Users.role_id.is_not(None))
            .order_by(models.Users.id.desc())
            .all()
        )
        
        return {
            "status": status.HTTP_200_OK,
            "message": "",
            "data": {
                "pending_users": pending_users,
                "authorized_users": authorized_users,
            },
        }

    def get_user_by_id(self, user_id: int, db: Session = Depends(models.get_db)):
        # Query a user by their ID
        user_item = (
            db.query(
                models.Users.id,
                models.Users.name,
                models.Users.username,
                models.Users.role_id,
                models.Users.is_active,
            )
            .filter(models.Users.id == user_id)
            .first()
        )
        
        return {"status": status.HTTP_200_OK, "message": "", "data": user_item}

    def update_user(self, user: schema.UpdateUser, user_id: int, db: Session = Depends(models.get_db)):
        try:
            # Query the user by their ID
            user_item = (
                db.query(models.Users)
                .filter(models.Users.id == user_id)
                .first()
            )

            # Update the user's active status and role
            user_item.is_active = user.is_active
            user_item.role_id = user.role_id
            db.commit()
            return {"status": status.HTTP_200_OK, "message": "Successfully updated"}
        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()

    def delete_user_row(self, user_id: int, db: Session = Depends(models.get_db)):
        try:
            # Query the user by their ID
            user_item = (
                db.query(models.Users)
                .filter(models.Users.id == user_id)
                .first()
            )
            
            # Delete the user from the database
            db.delete(user_item)
            db.commit()
            return {"status": status.HTTP_200_OK, "message": "Successfully deleted"}
        except SQLAlchemyError:
            db.rollback()
            raise
        finally:
            db.commit()