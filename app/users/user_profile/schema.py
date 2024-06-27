from typing import Annotated, Optional

from fastapi import UploadFile, Form

from pydantic import BaseModel


class UserCreateSchema(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    image: Optional[str] = None
    name: Optional[str] = None
    google_access_token: Optional[str] = None
    yandex_access_token: Optional[str] = None


class UserMeSchema(BaseModel):
    username: str | None = None
    email: str | None = None

    class Config:
        from_attributes = True
