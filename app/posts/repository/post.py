import os
import aiofiles

from uuid import uuid4

from fastapi import UploadFile, File

from dataclasses import dataclass
from sqlalchemy import select, delete, update, insert
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.posts.models import Posts, Categories
from app.posts.posts_exception import CategoryNotFoundException, PostNotFoundException, FileFormatIncorrectException
from app.posts.schema import PostCreateSchema
from app.settings import Settings

settings = Settings()


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

    async def create_post(self, body: PostCreateSchema, author_id: int, image_url: str | None) -> int:
        async with self.db_session as session:
            cat_id = select(Categories.id).where(Categories.id == body.category_id)
            cat_query = (await session.execute(cat_id)).scalar_one_or_none()
            if not cat_query:
                raise CategoryNotFoundException
            query = insert(Posts).values(
                title=body.title,
                description=body.description,
                category_id=body.category_id,
                author_id=author_id,
                image_url=image_url
            ).returning(Posts.id)
            post_id: int = (await session.execute(query)).scalar()
            await session.commit()
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

    async def update_post(self, post_id: int, author_id: int, body: PostCreateSchema) -> None:
        query = (update(Posts)
                 .where(Posts.id == post_id, Posts.author_id == author_id)
                 .values(**body.dict(exclude_unset=True))
                 )
        async with self.db_session as session:
            await session.execute(query)
            await session.commit()

    async def delete_post(self, post_id: int, author_id: int) -> None:
        post_query = await self.get_post(post_id=post_id)
        if not post_query:
            raise PostNotFoundException
        query = delete(Posts).where(Posts.id == post_id, Posts.author_id == author_id)
        async with self.db_session as session:
            await session.execute(query)
            await session.commit()

    async def upload_image(self, author_id: int, post_id: int, file: UploadFile = File(...)) -> str:
        file_extension = file.filename.split('.')[-1]
        if file_extension not in ('jpg', 'jpeg', 'png'):
            raise FileFormatIncorrectException

        file_name = f'{uuid4()}.{file_extension}'
        file_path = os.path.join(settings.UPLOAD_DIRECTORY, file_name)

        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        image_url = f'/static/{file_name}'

        query = (update(Posts)
                 .where(Posts.id == post_id, Posts.author_id == author_id)
                 .values(image_url=image_url)
                 )
        async with self.db_session as session:
            await session.execute(query)
            await session.commit()

        return image_url

    async def my_posts(self, author_id: int) -> list[Posts]:
        query = (select(Posts)
                 .options(joinedload(Posts.author), joinedload(Posts.category))
                 .where(Posts.author_id == author_id)
                 )
        async with self.db_session as session:
            posts: list[Posts] = (await session.execute(query)).scalars().all()
            return posts

    async def my_post(self, author_id: int, post_id: int) -> Posts:
        query = (select(Posts)
                 .options(joinedload(Posts.author), joinedload(Posts.category))
                 .where(Posts.author_id == author_id, Posts.id == post_id)
                 )
        async with self.db_session as session:
            post: Posts = (await session.execute(query)).scalar_one_or_none()
            return post
