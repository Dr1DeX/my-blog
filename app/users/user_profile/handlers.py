from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.default_dependency import get_request_user_id
from app.posts.posts_exception import FileFormatIncorrectException
from app.users.user_exception import UserEmailUniqueException
from app.users.users_dependency import get_user_service
from app.users.user_profile.schema import UserCreateSchema, UserMeSchema, UserUpdateSchema
from app.users.auth.schema import UserLoginSchema
from app.users.user_profile.service import UserService
from app.utils.upload_image import save_base64_image

router = APIRouter(prefix='/api/user', tags=['user'])


@router.post(
    '/create_user',
    response_model=UserLoginSchema
)
async def create_user(
        body: UserCreateSchema,
        user_service: Annotated[UserService, Depends(get_user_service)]
):
    if body.image:
        try:
            image_url = await save_base64_image(base64_str=body.image)
            body.image = image_url
        except FileFormatIncorrectException as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=e.detail
            )
    try:
        return await user_service.create_user(body=body)
    except UserEmailUniqueException as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=e.detail
        )


@router.get(
    '/me',
    response_model=UserMeSchema
)
async def get_user_me(
        user_service: Annotated[UserService, Depends(get_user_service)],
        user_id: int = Depends(get_request_user_id)
):
    return await user_service.get_user(user_id=user_id)


@router.patch(
    '/update-user',
    response_model=UserMeSchema
)
async def update_user(
        user_service: Annotated[UserService, Depends(get_user_service)],
        user_update: UserUpdateSchema,
        user_id: int = Depends(get_request_user_id)
):
    return await user_service.update_user(user_id=user_id, user_update=user_update)
