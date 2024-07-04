import base64
import os
import aiofiles

from uuid import uuid4

from app.posts.posts_exception import FileFormatIncorrectException
from app.settings import Settings

settings = Settings()


async def save_base64_image(base64_str: str) -> str:
    header, encoded = base64_str.split(',', 1)
    file_extension = header.split('/')[1].split(';')[0]
    if not os.path.exists(settings.UPLOAD_DIRECTORY):
        os.makedirs(settings.UPLOAD_DIRECTORY)

    if file_extension not in ('jpg', 'jpeg', 'png'):
        raise FileFormatIncorrectException
    file_name = f'{uuid4()}.{file_extension}'
    file_path = os.path.join(settings.UPLOAD_DIRECTORY, file_name)

    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(base64.b64decode(encoded))

    return f'http://localhost:8001{settings.STATIC_URL}{file_name}'
