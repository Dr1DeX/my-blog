from typing import Annotated

from fastapi import APIRouter, Depends

from app.default_dependency import get_request_user_id
from app.users.users_dependency import get_user_service
from app.users.user_profile.schema import UserCreateSchema, UserMeSchema
from app.users.auth.schema import UserLoginSchema
from app.users.user_profile.service import UserService

router = APIRouter(prefix='/api/user', tags=['user'])


@router.post(
    '/create_user',
    response_model=UserLoginSchema
)
async def create_user(
        body: UserCreateSchema,
        user_service: Annotated[UserService, Depends(get_user_service)]
):
    return await user_service.create_user(username=body.username, password=body.password)


@router.get(
    '/me',
    response_model=UserMeSchema
)
async def get_user_me(
        user_service: Annotated[UserService, Depends(get_user_service)],
        user_id: int = Depends(get_request_user_id)
):
    return await user_service.get_user(user_id=user_id)
