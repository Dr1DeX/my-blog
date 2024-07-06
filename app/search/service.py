from dataclasses import dataclass

from app.posts.schema import PostSchema
from app.search.repository import ElasticRepository
from app.search.workers.contracts.consumer.search_schema import DeliveryPostSchema


@dataclass
class ElasticService:
    es_repository: ElasticRepository

    async def search_posts(self, query: str) -> list[PostSchema]:
        hits = await self.es_repository.search_posts(query=query)
        return [PostSchema.model_validate(hit) for hit in hits]

    async def save_post_to_elasticsearch(self, post: DeliveryPostSchema) -> None:
        await self.es_repository.save_post_to_elasticsearch(post=post)
        print(f'Post create success')

    async def delete_post_from_elasticsearch(self, post_id: str) -> None:
        await self.es_repository.delete_post_from_elasticsearch(post_id=post_id)
        print(f'Post {post_id} delete success')
