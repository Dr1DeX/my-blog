from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database import get_db_session
from app.settings import Settings
from app.users.auth.service import AuthService
from app.users.user_profile.repository import UserRepository
from app.users.user_profile.service import UserService


async def get_user_repository(
        db_session: AsyncSession = Depends(get_db_session)
) -> UserRepository:
    return UserRepository(db_session=db_session)


async def get_auth_service(
        user_repository: UserRepository = Depends(get_user_repository),
) -> AuthService:
    return AuthService(
        user_repository=user_repository,
        settings=Settings()
    )


async def get_user_service(
        user_repository: UserRepository = Depends(get_user_repository),
        auth_service: AuthService = Depends(get_auth_service)
) -> UserService:
    return UserService(user_repository=user_repository, auth_service=auth_service)

