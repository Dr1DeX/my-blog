from elasticsearch import AsyncElasticsearch
from fastapi import Depends

from app.infrastructure.search import get_elastic_connection
from app.search.repository import ElasticRepository
from app.search.service import ElasticService


async def get_elastic_repository(
        es: AsyncElasticsearch = Depends(get_elastic_connection)
) -> ElasticRepository:
    return ElasticRepository(es=es)


async def get_elastic_service(
        es_repository: ElasticRepository = Depends(get_elastic_repository)
) -> ElasticService:
    return ElasticService(es_repository=es_repository)
