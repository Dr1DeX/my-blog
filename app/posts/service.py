from dataclasses import dataclass

from app.exception import PostNotFoundException, PostByCategoryNameException
from app.posts.repository import PostRepository
from app.posts.schema import PostSchema, PostCreateSchema, CategoriesSchema


@dataclass
class PostService:
    post_repository: PostRepository

    async def get_posts(self) -> list[PostSchema]:
        posts = await self.post_repository.get_posts()
        posts_schema = [PostSchema.model_validate(post) for post in posts]
        return posts_schema

    async def get_post(self, post_id: int) -> PostSchema:
        post = await self.post_repository.get_post(post_id=post_id)
        return PostSchema.model_validate(post)

    async def get_categories(self) -> list[CategoriesSchema]:
        categories = await self.post_repository.get_categories()
        categories_schema = [CategoriesSchema.model_validate(category) for category in categories]
        return categories_schema

    async def get_posts_by_categories_name(self, category_name: str) -> list[PostSchema]:
        posts = await self.post_repository.get_post_by_categories_name(category_name=category_name)
        if not posts:
            raise PostByCategoryNameException
        posts_schema = [PostSchema.model_validate(post) for post in posts]
        return posts_schema

    async def create_post(self, body: PostCreateSchema, author_id: int) -> PostSchema:
        post_id = await self.post_repository.create_post(body=body, author_id=author_id)
        post = await self.post_repository.get_post(post_id=post_id)
        return PostSchema.model_validate(post)
