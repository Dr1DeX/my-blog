from datetime import datetime

from fastapi import UploadFile
from pydantic import BaseModel


class PostSchema(BaseModel):
    id: int | None = None
    title: str | None = None
    description: str | None = None
    author_name: str | None = None
    category_name: str | None = None
    image_url: UploadFile | None = None
    pub_date: datetime | None = None
    pub_updated: datetime | None = None

    class Config:
        from_attributes = True

    def human_readable_dates(self):
        if self.pub_date:
            self.pub_date = self.pub_date.strftime("%d.%m.%Y %H:%M")
        if self.pub_updated:
            self.pub_updated = self.pub_updated.strftime("%d.%m.%Y %H:%M")


class PostCreateSchema(BaseModel):
    title: str | None = None
    description: str | None = None
    category_id: int | None = None
    image_url: UploadFile | None = None


class CategoriesSchema(BaseModel):
    id: int | None = None
    name: str | None = None

    class Config:
        from_attributes = True
