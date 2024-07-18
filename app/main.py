import os
import sentry_sdk

from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.posts.handlers import router as post_router
from app.users.auth.handlers import router as auth_router
from app.users.user_profile.handlers import router as user_router
from app.search.handlers import router as search_router
from app.settings import Settings

settings = Settings()

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)

app = FastAPI(
    title='My blog'
)


@app.get('/sentry-debug')
async def trigger_error():
    pass


origins = [
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.add_middleware(SentryAsgiMiddleware)


if not os.path.exists(settings.UPLOAD_DIRECTORY):
    os.makedirs(settings.UPLOAD_DIRECTORY)

app.mount(settings.STATIC_URL, StaticFiles(directory=settings.UPLOAD_DIRECTORY), name='static')

app.include_router(post_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(search_router)
