from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import timedelta, timezone, datetime
import jwt
from passlib.context import CryptContext
import models
from sqlalchemy.ext.asyncio import AsyncSession
from dotenv import load_dotenv
import os

load_dotenv()


SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')
REFRESH_TOKEN_EXPIRE_DAYS = os.getenv('REFRESH_TOKEN_EXPIRE_DAYS')


class AuthHelper:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def hash_password(cls, password: str):
        return cls.pwd_context.hash(password)

    @classmethod
    def verify_password(cls, password: str, hashed_password: str):
        if not cls.pwd_context.verify(password, hashed_password):
            return {"status": status.HTTP_403_FORBIDDEN, "message": "Wrong password"}

    @staticmethod
    def create_jwt_tokens(data: dict):
        payload = data.copy()
        access_token_expires = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

        payload.update({"exp": access_token_expires})
        access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": access_token}

    @staticmethod
    def create_refresh_token(data: dict):
        payload = data.copy()
        refresh_token_expires = datetime.now(timezone.utc) + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        )

        payload.update({"exp": refresh_token_expires})
        refresh_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"refresh_token": refresh_token}

    @staticmethod
    def decode_jwt_token(request: Request, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            request.state.payload = payload
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        
    # def check_if_admin(self)

    async def check_permission(self, request: Request, action: str, db: AsyncSession = Depends(models.get_db)):
        
        response = request.state.payload
        print(response)
        if response.get("is_super"):
                return True
        role_id = response.get("role_id")
        
        result = await db.execute(models.Roles.select().filter(models.Roles.id == role_id))
        role_item = result.fetchone()
        
        if role_item:
            permissions = role_item.permissions
            for permission in permissions:
                return permission.get('permission').get(action,False)
        
        return False
            

        # role_item = (
        #         db.query(
        #             models.Roles.id,
        #             models.Roles.role_name,
        #             models.Roles.permissions,
        #         )
        #         .filter(models.Roles.id == role_id)
        #         .first()
        #     )

        # permissions = role_item.permissions
        # print('permissions',permissions)

        # for permission in permissions:
        #         return permission.get('permission').get(action,False)
                    
        
        # return True


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if credentials:
            if credentials.scheme != "Bearer":
                raise HTTPException(
                    status_code=403, detail="Invalid authentication scheme"
                )
            try:
                payload = AuthHelper.decode_jwt_token(request, credentials.credentials)
                return payload.get("username")
            except HTTPException as e:
                raise e
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code")
