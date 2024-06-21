from dataclasses import dataclass
from sqlalchemy import select, delete, update, insert
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.posts.models import Posts, Categories
from app.posts.posts_exception import CategoryNotFoundException, PostNotFoundException
from app.posts.schema import PostCreateSchema


@dataclass
class PostRepository:
    db_session: AsyncSession

    async def get_posts(self) -> list[Posts]:
        query = (select(Posts)
                 .options(joinedload(Posts.author), joinedload(Posts.category))
                 )
        async with self.db_session as session:
            posts: list[Posts] = (await session.execute(query)).scalars().all()
            return posts

    async def get_post(self, post_id: int) -> Posts | None:
        query = (select(Posts)
                 .options(joinedload(Posts.author), joinedload(Posts.category))
                 .where(Posts.id == post_id)
                 )
        async with self.db_session as session:
            post: Posts = (await session.execute(query)).scalar_one_or_none()
            return post

    async def create_post(self, body: PostCreateSchema, author_id: int) -> int:
        async with self.db_session as session:
            cat_id = select(Categories.id).where(Categories.id == body.category_id)
            cat_query = (await session.execute(cat_id)).scalar_one_or_none()
            if not cat_query:
                raise CategoryNotFoundException
            query = insert(Posts).values(
                title=body.title,
                description=body.description,
                category_id=body.category_id,
                author_id=author_id
            ).returning(Posts.id)
            post_id = (await session.execute(query)).scalar_one()
            await session.commit()
            await session.flush()
            return post_id

    async def get_categories(self) -> list[Categories]:
        async with self.db_session as session:
            categories: list[Categories] = (await session.execute(select(Categories))).scalars().all()
            return categories

    async def get_post_by_categories_name(self, cat_name: str) -> list[Posts]:
        query = select(Posts).join(Categories, Posts.category_id == Categories.id).where(Categories.name == cat_name)

        async with self.db_session as session:
            post: list[Posts] = (await session.execute(query)).scalars().all()
            return post

    async def update_post(self, post_id: int, author_id: int, body: PostCreateSchema) -> int:
        post_query = await self.get_post(post_id=post_id)
        if not post_query:
            raise PostNotFoundException
        query = (update(Posts)
                 .where(Posts.id == post_id, Posts.author_id == author_id)
                 .values(**body.dict(exclude_unset=True))
                 ).returning(Posts.id)
        async with self.db_session as session:
            post_id: int = (await session.execute(query)).scalar_one_or_none()
            await session.commit()
            await session.flush()
            return post_id

    async def delete_post(self, post_id: int, author_id: int) -> None:
        post_query = await self.get_post(post_id=post_id)
        if not post_query:
            raise PostNotFoundException
        query = delete(Posts).where(Posts.id == post_id, Posts.author_id == author_id)
        async with self.db_session as session:
            await session.execute(query)
            await session.commit()
            await session.flush()
