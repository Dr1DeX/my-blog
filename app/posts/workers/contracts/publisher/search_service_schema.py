from typing import Optional

from pydantic import BaseModel, Field


class DeliveryPostSchema(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    author_name: Optional[str] = None
    category_name: Optional[str] = None
    image_url: Optional[str] = None


class MessageSchema(BaseModel):
    action: str = Field(..., pattern='^(create|update|delete)$')
    post: DeliveryPostSchema
