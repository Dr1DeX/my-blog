from pydantic import BaseModel


class PostSchema(BaseModel):
    id: int | None = None
    title: str | None = None
    description: str | None = None
    author_id: int
    category_id: int

    class Config:
        from_attributes = True


class PostCreateSchema(BaseModel):
    title: str | None = None
    description: str | None = None
    category_id: int | None = None


class CategoriesSchema(BaseModel):
    id: int | None = None
    name: str | None = None

    class Config:
        from_attributes = True
