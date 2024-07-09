from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, Query, HTTPException, status

from app.posts.schema import PostSchema
from app.search.search_dependency import get_elastic_service
from app.search.service import ElasticService
from app.search.workers.contracts.consumer.search_schema import DeliveryPostSchema

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
    async with httpx.AsyncClient() as client:
        response = await client.get('http://localhost:8001/api/post/etl_data')
        post_schema = [DeliveryPostSchema.model_validate(post) for post in response.json()]
    try:
        await elastic_service.save_bulk_post_to_etl(posts=post_schema)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e
        )
    return {'etl_service': 'posts save to success'}
