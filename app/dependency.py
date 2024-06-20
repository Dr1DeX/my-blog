from fastapi import Depends, security, Security, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.exception import TokenExpireExtension, TokenNotCorrectException
from app.infrastructure.database import get_db_session
from app.posts.repository import PostRepository
from app.posts.service import PostService
from app.settings import Settings
from app.users.auth.service import AuthService
from app.users.user_profile.repository import UserRepository
from app.users.user_profile.service import UserService


async def get_posts_repository(
        db_session: AsyncSession = Depends(get_db_session)
) -> PostRepository:
    return PostRepository(db_session=db_session)


async def get_post_service(
        post_repository: PostRepository = Depends(get_posts_repository)
) -> PostService:
    return PostService(post_repository=post_repository)


async def get_user_repository(db_session: AsyncSession = Depends(get_db_session)) -> UserRepository:
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


reusable_oauth2 = security.HTTPBearer()


async def get_request_user_id(
        auth_service: AuthService = Depends(get_auth_service),
        token: security.http.HTTPAuthorizationCredentials = Security(reusable_oauth2)
) -> int:
    try:
        user_id = auth_service.get_user_id_from_access_token(token=token.credentials)
    except TokenExpireExtension as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.detail
        )
    except TokenNotCorrectException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.detail
        )
    return user_id
