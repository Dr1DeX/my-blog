from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_HOST: str = 'localhost'
    DB_USER: str = 'postgres'
    DB_PASSWORD: str = 'password'
    DB_PORT: int = 5432
    DB_NAME: str = 'blog-pg'
    DB_DRIVER: str = 'postgresql+asyncpg'

    @property
    def db_url(self):
        return f'{self.DB_DRIVER}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}'