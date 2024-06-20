from fastapi import FastAPI

from app.posts.handlers import router as post_router
from app.users.auth.handlers import router as auth_router
from app.users.user_profile.handlers import router as user_router

app = FastAPI(
    title='My blog'
)

app.include_router(post_router)
app.include_router(auth_router)
app.include_router(user_router)
