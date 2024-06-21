import os
import aiofiles

from uuid import uuid4

from fastapi import UploadFile

from app.posts.posts_exception import FileFormatIncorrectException
from app.settings import Settings

settings = Settings()


async def upload_image(image: UploadFile) -> str | None:
    if image:
        file_extension = image.filename.split('.')[-1]
        if file_extension not in ('jpg', 'jpeg', 'png'):
            raise FileFormatIncorrectException
        file_name = f'{uuid4()}.{file_extension}'
        file_path = os.path.join(settings.UPLOAD_DIRECTORY, file_name)

        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await image.read()
            await out_file.write(content)
        image_url = f'/static/{file_name}'
        return image_url
    else:
        return None
