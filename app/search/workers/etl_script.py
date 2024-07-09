import asyncio

import httpx
from elasticsearch import AsyncElasticsearch

from app.main import settings
from app.search.repository import ElasticRepository
from app.search.service import ElasticService
from app.search.workers.contracts.consumer.search_schema import DeliveryPostSchema


async def main():
    es_client = AsyncElasticsearch(
        hosts=[settings.ELASTICSEARCH_URL],
        basic_auth=(settings.ELASTICSEARCH_USER, settings.ELASTICSEARCH_PASSWORD)
    )
    es_repository = ElasticRepository(es=es_client)
    es_service = ElasticService(es_repository=es_repository)

    async with httpx.AsyncClient() as client:
        response = await client.get('http://localhost:8001/api/post/etl_data')
        post_schema = [DeliveryPostSchema.model_validate(post) for post in response.json()]
    print(post_schema)

if __name__ == '__main__':
    print('ETL script activated')
    asyncio.run(main())
