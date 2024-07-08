from itertools import permutations
from typing import List

from dataclasses import dataclass

from elasticsearch import AsyncElasticsearch

from app.search.workers.contracts.consumer.search_schema import DeliveryPostSchema


@dataclass
class ElasticRepository:
    es: AsyncElasticsearch

    def _generate_permutations(self, query: str) -> List[str]:
        return [''.join(p) for p in permutations(query)]

    async def search_posts(self, query: str) -> list[dict]:
        response = await self.es.search(index='posts', body={
            'query': {
                'bool': {
                    'should': [
                        {
                            'multi_match': {
                                'query': query,
                                'fields': ['title^3', 'description^2', 'author_name', 'category_name'],
                                'fuzziness': 'AUTO'
                            }
                        },
                        {
                            'wildcard': {
                                'title': {
                                    'value': f'*{query}*',
                                    'boost': 2.0
                                }
                            }
                        },
                        {
                            'wildcard': {
                                'description': {
                                    'value': f'*{query}*',
                                    'boost': 1.5
                                }
                            }
                        },
                        {
                            'wildcard': {
                                'author_name': {
                                    'value': f'*{query}*',
                                    'boost': 1.2
                                }
                            }
                        },
                        {
                            'wildcard': {
                                'category_name': {
                                    'value': f'*{query}*',
                                    'boost': 1.0
                                }
                            }
                        }
                    ],
                    'minimum_should_match': 1
                }
            },
            'highlight': {
                'fields': {
                    'title': {},
                    'description': {},
                    'author_name': {},
                    'category_name': {}
                }
            }
        })
        return [hit['_source'] for hit in response['hits']['hits']]

    async def save_post_to_elasticsearch(self, post: DeliveryPostSchema) -> None:
        await self.es.index(index='posts', id=str(post.id), document=post.dict())

    async def delete_post_from_elasticsearch(self, post_id: str) -> None:
        await self.es.delete(index='posts', id=post_id)
