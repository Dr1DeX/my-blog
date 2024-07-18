import sentry_sdk

from typing import Annotated

from fastapi import APIRouter, Depends, Query, HTTPException, status

from app.posts.schema import PostSchema
from app.search.search_dependency import get_elastic_service
from app.search.service import ElasticService

router = APIRouter(prefix='/api/search', tags=['search'])


@router.get(
    '',
    response_model=list[PostSchema]
)
async def search_posts(
        elastic_service: Annotated[ElasticService, Depends(get_elastic_service)],
        query: Annotated[str, Query(...)]
):
    return await elastic_service.search_posts(query=query)


@router.get(
    '/etl_script',
)
async def etl_script(
        elastic_service: Annotated[ElasticService, Depends(get_elastic_service)]
):
    try:
        posts = await elastic_service.etl_script()
        await elastic_service.save_bulk_post_to_etl(posts=posts)
    except Exception as e:
        sentry_sdk.capture_exception(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e
        )
    return {'etl_service': 'posts save to success'}
