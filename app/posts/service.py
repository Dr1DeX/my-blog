from app.utils.upload_image import upload_image

from dataclasses import dataclass

from app.posts.posts_exception import PostByCategoryNameException, PostNotFoundException
from app.posts.repository import PostRepository
from app.posts.schema import PostSchema, PostCreateSchema, CategoriesSchema


@dataclass
class PostService:
    post_repository: PostRepository

    async def get_posts(self) -> list[PostSchema]:
        posts = await self.post_repository.get_posts()
        posts_schema = [
            PostSchema(
                id=post.id,
                title=post.title,
                description=post.description,
                author_name=post.author.username,
                category_name=post.category.name,
                image_url=post.image_url,
                pub_date=post.pub_date,
                pub_updated=post.pub_updated
            )
            for post in posts
        ]
        return posts_schema

    async def get_post(self, post_id: int) -> PostSchema:
        post = await self.post_repository.get_post(post_id=post_id)
        if not post:
            raise PostNotFoundException
        return PostSchema(
            id=post.id,
            title=post.title,
            description=post.description,
            author_name=post.author.username,
            category_name=post.category.name,
            image_url=post.image_url,
            pub_date=post.pub_date,
            pub_updated=post.pub_updated,
        )

    async def get_categories(self) -> list[CategoriesSchema]:
        categories = await self.post_repository.get_categories()
        categories_schema = [CategoriesSchema.model_validate(category) for category in categories]
        return categories_schema

    async def get_posts_by_categories_name(self, cat_name: str) -> list[PostSchema]:
        posts = await self.post_repository.get_post_by_categories_name(cat_name=cat_name)
        if not posts:
            raise PostByCategoryNameException
        posts_schema = [PostSchema.model_validate(post) for post in posts]
        return posts_schema

    async def create_post(self, body: PostCreateSchema, author_id: int) -> PostSchema:
        image_url = await upload_image(image=body.image_url)
        post_id = await self.post_repository.create_post(body=body, author_id=author_id, image_url=image_url)
        post = await self.post_repository.get_post(post_id=post_id)
        if not post:
            raise PostNotFoundException
        return PostSchema(
            id=post.id,
            title=post.title,
            description=post.description,
            author_name=post.author.username,
            category_name=post.category.name,
            image_url=post.image_url,
            pub_date=post.pub_date,
            pub_updated=post.pub_updated,
        )

    async def update_post(self, post_id: int, author_id: int, body: PostCreateSchema) -> PostSchema:
        image_url = await upload_image(image=body.image_url)
        post_id = await self.post_repository.update_post(
            author_id=author_id,
            post_id=post_id,
            body=body,
            image_url=image_url,
        )
        updated_post = await self.post_repository.get_post(post_id=post_id)
        return PostSchema.model_validate(updated_post)

    async def delete_post(self, post_id: int, author_id: int) -> None:
        await self.post_repository.delete_post(post_id=post_id, author_id=author_id)