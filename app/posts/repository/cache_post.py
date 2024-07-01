import json

from dataclasses import dataclass

from redis import asyncio as Redis

from app.posts.posts_exception import PostNotFoundException
from app.posts.schema import PostSchema
from app.settings import Settings

settings = Settings()


@dataclass
class PostCacheRepository:
    redis_connection: Redis

    async def get_posts(self, page: int, page_size: int) -> list[PostSchema]:
        start = (page - 1) * page_size
        end = start + page_size - 1
        async with self.redis_connection as redis:
            posts_json = await redis.lrange('posts', start, end)
            posts_schema = [
                PostSchema(
                    id=post_data['id'],
                    title=post_data['title'],
                    description=post_data['description'],
                    author_name=post_data['author_name'],
                    category_name=post_data['category_name'],
                    image_url=post_data['image_url'],
                    pub_date=post_data['pub_date'],
                    pub_updated=post_data['pub_updated']
                )
                for post in posts_json
                for post_data in [json.loads(post)]
            ]
            return posts_schema

    async def get_post(self, post_id: int) -> PostSchema:
        async with self.redis_connection as redis:
            post_json = await redis.lrange('posts', 0, -1)
            posts = [json.loads(post) for post in post_json]
            for post in posts:
                if post['id'] == post_id:
                    return PostSchema(
                        id=post['id'],
                        title=post['title'],
                        description=post['description'],
                        author_name=post['author_name'],
                        category_name=post['category_name'],
                        image_url=post['image_url'],
                        pub_date=post['pub_date'],
                        pub_updated=post['pub_updated']
                    )
            raise PostNotFoundException

    async def create_post(self, posts: PostSchema):
        post_json = posts.json()
        async with self.redis_connection as redis:
            await redis.lpush('posts', post_json)
            await redis.expire('posts', settings.CACHE_TTL)

    async def update_post(self, post: PostSchema):
        async with self.redis_connection as redis:
            posts_json = await redis.lrange('posts', 0, -1)
            updated_posts_json = []

            for post_json in posts_json:
                post_data = json.loads(post_json)
                if post_data['id'] == post.id:
                    updated_posts_json.append(post.json())
                else:
                    updated_posts_json.append(post_json)
            await redis.delete('posts')
            await redis.lpush('posts', *updated_posts_json)
            await redis.expire('posts', settings.CACHE_TTL)

    async def delete_post(self, post_id: int):
        async with self.redis_connection as redis:
            posts_json = await redis.lrange('posts', 0, -1)
            updated_posts_json = [post_json for post_json in posts_json if json.loads(post_json)['id'] != post_id]
            await redis.delete('posts')
            await redis.lpush('posts', *updated_posts_json)
            await redis.expire('posts', settings.CACHE_TTL)

    async def set_posts(self, posts: list[PostSchema]):
        post_json = [post.json() for post in posts]
        async with self.redis_connection as redis:
            await redis.lpush('posts', *post_json)
            await redis.expire('posts', settings.CACHE_TTL)
