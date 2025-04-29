from pydantic import BaseModel, EmailStr, Field, field_validator
from pydantic_core.core_schema import FieldValidationInfo
from typing import Optional
import re
from fastapi import Depends, UploadFile, Form, File
import json


class Register(BaseModel):
    name: str
    username: str
    password: str
    confirm_password: str
    profile: UploadFile

    @classmethod
    def as_form(
        cls,
        name: str = Form(...),
        username: str = Form(...),
        password: str = Form(...),
        confirm_password: str = Form(...),
        profile: UploadFile = File(...),
    ):
        return cls(
            name=name,
            username=username,
            password=password,
            confirm_password=confirm_password,
            profile=profile,
        )

    @field_validator("password")
    def password_validation(cls, v):
        pattern = re.compile(
            "(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
        )
        if not re.fullmatch(pattern, v):
            raise ValueError(
                "The password must have 1 uppercase letter, 1 special character, 1 lowercase letter and is at least of length 8"
            )
        return v

    @field_validator("confirm_password")
    def match_passwords(cls, v, info: FieldValidationInfo):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("The passwords do not match")
        return v


class UpdateUser(BaseModel):
    is_active: bool
    role_id: int


class Login(BaseModel):
    username: EmailStr
    password: str


class Create(BaseModel):
    name: str
    designation: str
    email: EmailStr
    phone: str
    city: str


class Permission(BaseModel):
    view: Optional[bool] = False
    edit: Optional[bool] = False
    add: Optional[bool] = False
    delete: Optional[bool] = False


class Permissions(BaseModel):
    page: str
    permission: Permission


class RoleSchema(BaseModel):
    role_name: str
    permissions: list[Permissions]


class Details(BaseModel):
    description: str = Field(..., max_length=1000)
    responsibilities: str = Field(..., max_length=1000)
    requirements: str = Field(..., max_length=1000)
    benefits: str = Field(..., max_length=1000)


class CareerSchema(BaseModel):
    job: str
    type: str
    location: str
    details: Details


class BaseLayout(BaseModel):
    page_name: str


class Home(BaseModel):
    image: Optional[str] = None
    heading: str
    subHeading: str
    buttonText: str


class HomeSchema(BaseLayout):
    page_data: Home


class About(BaseModel):
    title: str
    description: str


class AboutSchema(BaseLayout):
    page_data: About


class Contact(BaseModel):
    name: str
    email: EmailStr
    phone: str


class ContactSchema(BaseLayout):
    page_data: Contact


class FooterHeaders(BaseModel):
    header: str
    footerHeaderLinks: list[str]
    
class Footer(BaseModel):
    cols: list[FooterHeaders]

class FooterSchema(BaseLayout):
    page_data : Footer

class PageSchema(BaseModel):
    home: HomeSchema
    about: AboutSchema
    contact: ContactSchema
    footer: FooterSchema
