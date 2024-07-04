import aio_pika

from pydantic import ValidationError

from app.settings import Settings
from app.posts.workers.contracts.publisher import MessageSchema

settings = Settings()


async def publish_message(exchange_name: str, routing_key: str, message_body: dict):
    try:
        message = MessageSchema(**message_body)
    except ValidationError as e:
        print(f"Invalid message format: {e}")
        return
    connection = await aio_pika.connect_robust(settings.rabbit_url)
    async with connection:
        channel = await connection.channel()
        exchange = await channel.declare_exchange(name=exchange_name, type=aio_pika.ExchangeType.DIRECT)
        message_data = aio_pika.Message(
            body=message.json().encode()
        )
        await exchange.publish(message=message_data, routing_key=routing_key)
        print(f"Sendler to message for stargazer '{exchange_name}' with routing key '{routing_key}': {message_body}")
