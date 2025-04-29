from fastapi import FastAPI, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.exceptions import RequestValidationError
# from fastapi.responses import JSONResponse
from src.routes import auth, emp, roles, careers, page
from src.utils.helper import JWTBearer
from fastapi.staticfiles import StaticFiles
# from slowapi import Limiter, _rate_limit_exceeded_handler
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded
import requests

# limiter = Limiter(key_func=get_remote_address, default_limits=["3 per minute"])

app = FastAPI()

# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.mount("/static", StaticFiles(directory="static"), name="static")


origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5174",
    "http://localhost:5173",
]

# app.add_middleware(HTTPSRedirectMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# url = "http://localhost:8000/get_page"  # Replace with your endpoint
# for i in range(5):
#     response = requests.get(url)
#     print(f"Request {i+1}: Status Code {response.status_code}")


# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, exc: RequestValidationError):
#     return JSONResponse(
#         status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#         content={
#             "status": 422,
#             "message": "User not registered successfully",
#             "detail": exc.errors(),
#         },
#     )


app.include_router(auth.router_with_token, dependencies=[Depends(JWTBearer())])
app.include_router(auth.router_without_token)
app.include_router(emp.router_with_token, dependencies=[Depends(JWTBearer())])
app.include_router(roles.router_with_token, dependencies=[Depends(JWTBearer())])
app.include_router(roles.router_without_token)
app.include_router(careers.router_with_token, dependencies=[Depends(JWTBearer())])
app.include_router(page.router_with_token, dependencies=[Depends(JWTBearer())])

