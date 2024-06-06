from dataclasses import dataclass
from sqlalchemy import select, delete, update, insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.posts.models import Posts, Categories
from app.posts.schema import PostCreateSchema
from app.users.user_profile.models import UserProfile


@dataclass
class PostRepository:
    db_session: AsyncSession

    async def get_posts(self) -> list[Posts]:
        async with self.db_session as session:
            posts: list[Posts] = (await session.execute(select(Posts))).scalars().all()
            return posts

    async def get_post(self, post_id: int) -> Posts | None:
        async with self.db_session as session:
            post: Posts = (await session.execute(select(Posts).where(Posts.id == post_id))).scalar_one_or_none()
            return post

    async def create_post(self, body: PostCreateSchema, author_id: int) -> int:
        query = insert(Posts).values(
            title=body.title,
            description=body.description,
            category_id=body.category_id,
            author_id=author_id
        ).returning(Posts.id)

        async with self.db_session as session:
            post_id = (await session.execute(query)).scalar_one()
            await session.commit()
            await session.flush()
            return post_id

    async def get_categories(self) -> list[Categories]:
        async with self.db_session as session:
            categories: list[Categories] = (await session.execute(select(Categories))).scalars().all()
            return categories

    async def get_post_by_categories_name(self, category_name: str) -> list[Posts]:
        query = (select(Posts)
                 .join(Categories, Posts.category_id == Categories.id)
                 .where(Categories.name == category_name))

        async with self.db_session as session:
            post: list[Posts] = (await session.execute(query)).scalars().all()
            return post
