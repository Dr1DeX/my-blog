from fastapi import FastAPI

from app.posts.handlers import router as post_router

app = FastAPI(
    title='My blog'
)

app.include_router(post_router)
