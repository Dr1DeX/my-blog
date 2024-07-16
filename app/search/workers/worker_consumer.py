import asyncio
import json

import aio_pika
from aio_pika.abc import AbstractRobustQueue
from elasticsearch import AsyncElasticsearch

from app.infrastructure.search import get_elastic_connection
from app.search.service import ElasticService
from app.search.repository import ElasticRepository
from app.search.workers.contracts.consumer.search_controller import SearchConsumeController
from app.search.workers.contracts.consumer.search_schema import MessageSchema
from app.search.workers.rq_consumer import ElasticServiceConsumer
from app.settings import Settings

settings = Settings()


async def get_message_from_queue(queue: AbstractRobustQueue):
    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                message_body = json.loads(message.body)
                message_data = MessageSchema(**message_body)
                print(f'Received data: {message_data}')
                return message_data


async def process_message(es_client: AsyncElasticsearch, message: MessageSchema):
    es_repository = ElasticRepository(es=es_client)
    es_service = ElasticService(es_repository=es_repository)

    if message.action == 'create':
        await es_service.save_post_to_elasticsearch(post=message.post)
    elif message.action == 'delete':
        await es_service.delete_post_from_elasticsearch(post_id=message.post['id'])


async def main():
    connection = await aio_pika.connect_robust(settings.rabbit_url)
    controller = SearchConsumeController()
    async with connection:
        channel = await connection.channel()
        exchange = await channel.declare_exchange(name=controller.get_exchange_name, type=aio_pika.ExchangeType.DIRECT)

        queue = await channel.declare_queue('search_post_data', durable=True)
        await queue.bind(exchange=exchange, routing_key=controller.get_routing_key)

        es_client = await get_elastic_connection()
        try:
            while True:
                post_data = await get_message_from_queue(queue=queue)
                if post_data:
                    await process_message(es_client=es_client, message=post_data)
        finally:
            await es_client.close()


if __name__ == '__main__':
    print(f'[!] Stargazer elastic activate...')
    asyncio.run(main())
