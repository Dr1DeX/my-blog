from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.cache.accessor import get_redis_connection
from app.infrastructure.database import get_db_session
from app.posts.repository import PostRepository
from app.posts.repository.cache_post import PostCacheRepository
from app.posts.service import PostService
from app.posts.workers.contracts.publisher import SearchPublisherController


async def get_posts_repository(
        db_session: AsyncSession = Depends(get_db_session)
) -> PostRepository:
    return PostRepository(db_session=db_session)


async def get_post_cache_repository() -> PostCacheRepository:
    redis_connection = get_redis_connection()
    return PostCacheRepository(redis_connection=redis_connection)


async def get_post_publisher_search_contract() -> SearchPublisherController:
    return SearchPublisherController()


async def get_post_service(
        post_repository: PostRepository = Depends(get_posts_repository),
        post_cache_repository: PostCacheRepository = Depends(get_post_cache_repository),
        search_publisher_controller: SearchPublisherController = Depends(get_post_publisher_search_contract)
) -> PostService:
    return PostService(
        post_repository=post_repository,
        post_cache_repository=post_cache_repository,
        search_publisher_controller=search_publisher_controller
    )
