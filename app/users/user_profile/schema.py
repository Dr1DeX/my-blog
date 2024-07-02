from typing import Optional

from pydantic import BaseModel


class UserCreateSchema(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    google_access_token: Optional[str] = None
    yandex_access_token: Optional[str] = None


class UserMeSchema(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class UserUpdateSchema(BaseModel):
    image: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None
