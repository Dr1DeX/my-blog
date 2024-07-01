from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_HOST: str = 'localhost'
    DB_USER: str = 'postgres'
    DB_PASSWORD: str = 'password'
    DB_PORT: int = 5432
    DB_NAME: str = 'blog-pg'
    DB_DRIVER: str = 'postgresql+asyncpg'
    JWT_SECRET_KEY: str = 'mega-super-secret'
    JWT_ENCODE_ALGORYTHM: str = 'HS256'
    UPLOAD_DIRECTORY: str = 'app/static/user_avatars/'
    STATIC_URL: str = '/static/user_avatars/'
    CACHE_HOST: str = 'localhost'
    CACHE_PORT: int = 6379
    CACHE_DB: int = 0
    CACHE_TTL: int = 3600

    @property
    def db_url(self):
        return f'{self.DB_DRIVER}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}'
