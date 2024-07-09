from app.posts.repository.cache_post import PostCacheRepository
from app.posts.workers.contracts.publisher import SearchPublisherController
from app.posts.workers.contracts.publisher.search_service_schema import DeliveryPostSchema
from app.posts.workers.rq_publisher import publish_message

from utils.upload_image import save_base64_image

from dataclasses import dataclass

from app.posts.posts_exception import PostByCategoryNameException, PostNotFoundException
from app.posts.repository import PostRepository
from app.posts.schema import PostSchema, PostCreateSchema, CategoriesSchema


@dataclass
class PostService:
    post_repository: PostRepository
    post_cache_repository: PostCacheRepository
    search_publisher_controller: SearchPublisherController

    async def get_posts(self, page: int, page_size: int) -> tuple[list[PostSchema], int]:
        if cache_posts := await self.post_cache_repository.get_posts(page=page, page_size=page_size):
            total_count = await self.post_repository.get_total_count_posts()
            return cache_posts, total_count
        else:
            posts = await self.post_repository.get_posts()
            total_count = len(posts)
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
            await self.post_cache_repository.set_posts(posts=posts_schema)
            return posts_schema[(page - 1) * page_size: page * page_size], total_count

    async def create_post(self, body: PostCreateSchema, author_id: int) -> PostSchema:
        if body.image_url is not None:
            image_url = await save_base64_image(base64_str=body.image_url)
        else:
            image_url = None
        post_id = await self.post_repository.create_post(body=body, author_id=author_id, image_url=image_url)
        post = await self.post_repository.get_post(post_id=post_id)
        if not post:
            raise PostNotFoundException
        post_schema = PostSchema(
            id=post.id,
            title=post.title,
            description=post.description,
            author_name=post.author.username,
            category_name=post.category.name,
            image_url=post.image_url,
            pub_date=post.pub_date,
            pub_updated=post.pub_updated,
        )

        await self.post_cache_repository.create_post(posts=post_schema)

        post_delivery_message = DeliveryPostSchema(
            id=post.id,
            title=post.title,
            description=post.description,
            author_name=post.author.username,
            category_name=post.category.name,
            image_url=post.image_url
        )

        await publish_message(
            exchange_name=self.search_publisher_controller.get_exchange_name,
            routing_key=self.search_publisher_controller.get_routing_key,
            message_body={
                'action': self.search_publisher_controller.create_action,
                'post': post_delivery_message.dict()
            }
        )
        return post_schema

    async def get_post(self, post_id: int) -> PostSchema:

        post = await self.post_repository.get_post(post_id=post_id)

        if not post:
            raise PostNotFoundException

        post_schema = PostSchema(
            id=post.id,
            title=post.title,
            description=post.description,
            author_name=post.author.username,
            category_name=post.category.name,
            image_url=post.image_url,
            pub_date=post.pub_date,
            pub_updated=post.pub_updated,
        )

        return post_schema

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

    async def update_post(self, post_id: int, author_id: int, body: PostCreateSchema) -> PostSchema:
        if body.image_url is not None:
            body['image_url'] = await save_base64_image(base64_str=body.image_url)

        await self.post_repository.update_post(
            author_id=author_id,
            post_id=post_id,
            body=body,
        )
        updated_post = await self.post_repository.get_post(post_id=post_id)
        post_schema = PostSchema(
            id=updated_post.id,
            title=updated_post.title,
            description=updated_post.description,
            author_name=updated_post.author.username,
            category_name=updated_post.category.name,
            image_url=updated_post.image_url,
            pub_date=updated_post.pub_date,
            pub_updated=updated_post.pub_updated,
        )

        await self.post_cache_repository.update_post(post=post_schema)

        return post_schema

    async def delete_post(self, post_id: int, author_id: int) -> None:
        await self.post_repository.delete_post(post_id=post_id, author_id=author_id)
        await self.post_cache_repository.delete_post(post_id=post_id)
        post_delivery_message = DeliveryPostSchema(id=post_id)
        await publish_message(
            exchange_name=self.search_publisher_controller.get_exchange_name,
            routing_key=self.search_publisher_controller.get_routing_key,
            message_body={
                'action': self.search_publisher_controller.delete_action,
                'post': post_delivery_message

            }
        )

    async def get_all_posts(self) -> list[PostSchema]:
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
