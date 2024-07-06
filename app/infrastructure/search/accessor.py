from app.settings import Settings

from elasticsearch import AsyncElasticsearch

settings = Settings()

es_client = AsyncElasticsearch(
    hosts=[settings.ELASTICSEARCH_URL],
    basic_auth=(settings.ELASTICSEARCH_USER, settings.ELASTICSEARCH_PASSWORD)
)


async def get_elastic_connection():
    return es_client
