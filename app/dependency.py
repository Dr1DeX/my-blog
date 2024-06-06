from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database import get_db_session
from app.posts.repository import PostRepository
from app.posts.service import PostService


async def get_posts_repository(
        db_session: AsyncSession = Depends(get_db_session)
) -> PostRepository:
    return PostRepository(db_session=db_session)


async def get_post_service(
        post_repository: PostRepository = Depends(get_posts_repository)
) -> PostService:
    return PostService(post_repository=post_repository)
