import aio_pika
from aio_pika.abc import AbstractRobustConnection

from app.settings import Settings

settings = Settings()


async def get_rabbitmq_connection() -> AbstractRobustConnection:
    connection = await aio_pika.connect_robust(settings.rabbit_url)
    return connection

