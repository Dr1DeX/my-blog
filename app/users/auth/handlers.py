from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.default_dependency import get_auth_service
from app.users.auth.schema import UserLoginSchema
from app.users.user_exception import UserNotFoundException, UserWrongPasswordException
from app.users.user_profile.schema import UserCreateSchema
from app.users.auth.service import AuthService

router = APIRouter(prefix='/api/auth', tags=['auth'])


@router.post(
    '/login',
    response_model=UserLoginSchema
)
async def login(
        body: UserCreateSchema,
        auth_service: Annotated[AuthService, Depends(get_auth_service)]
):
    try:
        return await auth_service.login(email=body.email, password=body.password)
    except UserNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.detail
        )
    except UserWrongPasswordException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.detail
        )
