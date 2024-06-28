# my-blog

## Как развернуть локально в докере?

### 1) Устанавливаем зависимости:
```
conda create -n blog
conda activate blog
poetry init
poetry install
```
### 2) Инициализируем `alembic`
`alembic init alembic`

### 3) Не забываем про переменные окружения `.env.local` и `.env.dev`, например:
```
DB_HOST=blog-pg
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=blog-pg
DB_DRIVER=postgresql+asyncpg
JWT_SECRET_KEY=mega-super-secret
JWT_ENCODE_ALGORITHM=HS256
```

### 4) Поднимаем контейнеры:
`docker-compose up --build -d`

### 5) Дока станет доступна по адресу [тык](http://localhost:8001/docs)

# by Dr1DeX
