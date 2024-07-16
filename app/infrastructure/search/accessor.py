from app.settings import Settings

from elasticsearch import AsyncElasticsearch

settings = Settings()


async def get_elastic_connection():
    es_client = AsyncElasticsearch(
        hosts=[settings.ELASTICSEARCH_URL],
        basic_auth=(settings.ELASTICSEARCH_USER, settings.ELASTICSEARCH_PASSWORD)
    )
    return es_client
