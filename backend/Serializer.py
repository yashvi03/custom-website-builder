from pydantic import BaseModel, EmailStr
from typing import Union, Optional


class EmployeeSerializer(BaseModel):
    id: int
    name: str
    designation: str
    email: EmailStr
    phone: str
    city: str


class UserSerializer(BaseModel):
    id: int
    name: str
    username: EmailStr
    is_active: bool
    is_super: bool
    profile: Optional[str]


class PermissionSerializer(BaseModel):
    view: bool
    edit: bool
    add: bool
    delete: bool


class PermissionsSerializer(BaseModel):
    page: str
    permission: PermissionSerializer


class RoleSerializer1(BaseModel):
    permissions: list[PermissionsSerializer]


class RoleSerializer2(RoleSerializer1):
    id: int
    role_name: str


class EmpResponse(BaseModel):
    status: int
    message: str
    data: EmployeeSerializer


class UserResponse(BaseModel):
    status: int
    message: str
    data: UserSerializer


class RoleResponse(BaseModel):
    status: int
    message: str
    data: Union[RoleSerializer1, RoleSerializer2, str]


class RoleName(BaseModel):
    role_id: int
    role_name: str


class RoleNameResponse(BaseModel):
    status: int
    message: str
    data: list[RoleName]


class CareerDetailSerializer(BaseModel):
    description: str
    responsibilities: str
    requirements: str
    benefits: str


class CareerSerializer(BaseModel):
    job: str
    type: str
    location: str
    details: CareerDetailSerializer


class CareerResponseSerializer(BaseModel):
    status: int
    message: str
    data: CareerSerializer
    
class BaseLayout(BaseModel):
    page_name: str
    
class Home(BaseModel):
    image: Optional[str] = None
    heading: str
    subHeading: str
    buttonText: str


class HomeSerializer(BaseLayout):
    page_data: Home
   
class About(BaseModel):
    title: str
    description: str

class AboutSerializer(BaseLayout):
    page_data: About
    
class Contact(BaseModel):
    name: str
    email: EmailStr
    phone: str

class ContactSerializer(BaseLayout):
    page_data: Contact

class FooterHeadersSerializer(BaseModel):
    header: str
    footerHeaderLinks: list[str]

class Footer(BaseModel):
    cols: list[FooterHeadersSerializer]

class FooterSerializer(BaseLayout):
    page_data: Footer

class PageSerializer(BaseModel):
    home: HomeSerializer
    about: AboutSerializer
    contact: ContactSerializer
    footer: FooterSerializer
    
class PageResponseSerializer(BaseModel):
    status: int
    message: str
    data: PageSerializer


# class HomeResponseSerializer(BaseModel):
#     status: int
#     message: str
#     data: HomeSerializer
