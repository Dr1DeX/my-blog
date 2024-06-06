from typing import Annotated

from fastapi import APIRouter, status, Depends, HTTPException

from app.dependency import get_post_service
from app.exception import PostNotFoundException
from app.posts.schema import PostSchema, PostCreateSchema
from app.posts.service import PostService

router = APIRouter(prefix='/post', tags=['post'])


@router.get(
    '/all',
    response_model=list[PostSchema]
)
async def get_posts(
        post_service: Annotated[PostService, Depends(get_post_service)]
):
    return await post_service.get_posts()


@router.get(
    '/{post_id}',
    response_model=PostSchema
)
async def get_post(
        post_id: int,
        post_service: Annotated[PostService, Depends(get_post_service)]
):
    try:
        return await post_service.get_post(post_id=post_id)
    except PostNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail=e.detail
        )
