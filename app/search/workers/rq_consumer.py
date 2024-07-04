import json
import aio_pika

from pydantic import ValidationError
from dataclasses import dataclass

from app.search.service import ElasticService
from app.search.workers.contracts.consumer.search_schema import MessageSchema
from app.settings import Settings

settings = Settings()


@dataclass
class ElasticServiceConsumer:
    elastic_service: ElasticService

    async def consume(self, exchange_name: str, routing_key: str):
        connection = await aio_pika.connect_robust(settings.rabbit_url)
        channel = connection.channel()
        queue = await channel.declare_queue(name='search_queue', durable=True)
        await queue.bind(exchange=exchange_name, routing_key=routing_key)

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    try:
                        message_body = json.loads(message.body)
                        message_data = MessageSchema(**message_body)
                        print(f'Received data: {message_data}')
                        await self.process_message(message_data)
                    except ValidationError as e:
                        print(f'Invalid message format: {e}')
                    except json.JSONDecodeError:
                        print('Failed to decode JSON message')

    async def process_message(self, message: MessageSchema):
        if message.action == 'create':
            print(f'Create method {message}')
        elif message.action == 'delete':
            print(f'Delete method {message}')
