from dataclasses import dataclass

from elasticsearch import AsyncElasticsearch

from app.search.workers.contracts.consumer.search_schema import DeliveryPostSchema


@dataclass
class ElasticRepository:
    es: AsyncElasticsearch

    async def search_posts(self, query: str) -> list[dict]:
        response = await self.es.search(index='posts', body={
            'query': {
                'multi_match': {
                    'query': query,
                    'fields': ['title', 'description', 'author_name', 'category_name']
                }
            }
        })
        return [hit['_source'] for hit in response['hits']['hits']]

    async def save_post_to_elasticsearch(self, post: DeliveryPostSchema) -> None:
        await self.es.index(index='posts', id=str(post.id), document=post.dict())

    async def delete_post_from_elasticsearch(self, post_id: str) -> None:
        await self.es.delete(index='posts', id=post_id)
