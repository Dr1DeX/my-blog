import datetime
from redis import asyncio as Redis
from dataclasses import dataclass
from datetime import datetime as dt, timedelta
from jose import jwt, JWTError

from app.users.user_exception import (
    UserNotFoundException,
    UserWrongPasswordException,
    TokenNotCorrectException,
    TokenExpireExtension
)
from app.users.user_profile.models import UserProfile
from app.users.user_profile.repository import UserRepository
from app.users.auth.schema import UserLoginSchema, LogoutSchema
from app.settings import Settings


@dataclass
class AuthService:
    user_repository: UserRepository
    settings: Settings
    redis: Redis

    async def login(self, email: str, password: str) -> UserLoginSchema:
        user = await self.user_repository.get_user_by_email(email=email)
        self._validate_auth_user(user=user, password=password)
        access_token = self.generate_access_token(user_id=user.id)
        await self._save_token(token=access_token, user_id=user.id, ttl=self.settings.CACHE_TTL)
        return UserLoginSchema(user_id=user.id, access_token=access_token)

    async def logout(self, token: str):
        await self._delete_token(token=token)

    def generate_access_token(self, user_id: int):
        payload = {
            'user_id': user_id,
            'expire': (dt.now(tz=datetime.UTC) + timedelta(days=7)).timestamp()
        }
        encoded_jwt = jwt.encode(payload, self.settings.JWT_SECRET_KEY, algorithm=self.settings.JWT_ENCODE_ALGORYTHM)
        return encoded_jwt

    async def _save_token(self, token: str, user_id: int, ttl: int):
        await self.redis.setex(f'token:{token}', ttl, user_id)

    async def _delete_token(self, token: str):
        await self.redis.delete(f'token:{token}')

    @staticmethod
    def _validate_auth_user(user: UserProfile, password: str):
        if not user:
            raise UserNotFoundException
        if user.password != password:
            raise UserWrongPasswordException

    async def get_user_id_from_access_token(self, token: str) -> int:
        user_id = await self.redis.get(f'token:{token}')
        if not user_id:
            raise TokenNotCorrectException

        try:
            payload = jwt.decode(token, self.settings.JWT_SECRET_KEY, algorithms=[self.settings.JWT_ENCODE_ALGORYTHM])
        except JWTError:
            raise TokenNotCorrectException
        if payload['expire'] < dt.now().timestamp():
            raise TokenExpireExtension
        return int(user_id)

    async def refresh_token(self, old_token: str) -> UserLoginSchema:
        user_id = await self.get_user_id_from_access_token(token=old_token)
        new_token = self.generate_access_token(user_id=user_id)
        await self._delete_token(token=old_token)
        await self._save_token(token=new_token, user_id=user_id, ttl=self.settings.CACHE_TTL)
        return UserLoginSchema(user_id=user_id, access_token=new_token)
