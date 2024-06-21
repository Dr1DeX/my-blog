from typing import Annotated

from fastapi import APIRouter, status, Depends, HTTPException

from app.default_dependency import get_request_user_id
from app.posts.posts_dependency import get_post_service
from app.posts.posts_exception import CategoryNotFoundException, PostNotFoundException, PostByCategoryNameException
from app.posts.schema import PostSchema, PostCreateSchema, CategoriesSchema
from app.posts.service import PostService
from app.posts.success_exception import PostDeleteSuccessException

router = APIRouter(prefix='/api/post', tags=['post'])


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


@router.get(
    '',
    response_model=list[PostSchema]
)
async def get_posts_by_categories_name(
        cat_name: str,
        post_service: Annotated[PostService, Depends(get_post_service)]
):
    try:
        return await post_service.get_posts_by_categories_name(cat_name=cat_name)
    except PostByCategoryNameException as e:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail=e.detail
        )


@router.get(
    '/categories/all',
    response_model=list[CategoriesSchema]
)
async def get_all_categories(
        post_service: Annotated[PostService, Depends(get_post_service)]
):
    return await post_service.get_categories()


@router.post(
    '/create',
    response_model=PostSchema
)
async def create_post(
        body: PostCreateSchema,
        post_service: Annotated[PostService, Depends(get_post_service)],
        author_id: int = Depends(get_request_user_id)
):
    try:
        return await post_service.create_post(body=body, author_id=author_id)
    except CategoryNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.detail
        )


@router.patch(
    '/update_post',
    response_model=PostSchema
)
async def update_post(
        body: PostCreateSchema,
        post_id: int,
        post_service: Annotated[PostService, Depends(get_post_service)],
        author_id: int = Depends(get_request_user_id)
):
    try:
        return await post_service.update_post(
            post_id=post_id,
            author_id=author_id,
            body=body
        )
    except PostNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.detail
        )


@router.delete(
    '/delete_post',
)
async def delete_post(
        post_id: int,
        post_service: Annotated[PostService, Depends(get_post_service)],
        author_id: int = Depends(get_request_user_id)
):
    try:
        await post_service.delete_post(post_id=post_id, author_id=author_id)
    except PostNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.detail
        )
    return HTTPException(
        status_code=status.HTTP_204_NO_CONTENT,
        detail=PostDeleteSuccessException.detail
    )
