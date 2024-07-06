from typing import Annotated

from fastapi import APIRouter, Depends

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
        query: str
):
    pass
