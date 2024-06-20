import datetime
from dataclasses import dataclass
from datetime import datetime as dt, timedelta
from jose import jwt, JWTError

from app.exception import (
    UserNotFoundException,
    UserWrongPasswordException,
    TokenNotCorrectException,
    TokenExpireExtension
)
from app.users.user_profile.models import UserProfile
from app.users.user_profile.repository import UserRepository
from app.users.auth.schema import UserLoginSchema
from app.settings import Settings


@dataclass
class AuthService:
    user_repository: UserRepository
    settings: Settings

    async def login(self, username: str, password: str) -> UserLoginSchema:
        user = await self.user_repository.get_user_by_username(username=username)
        self._validate_auth_user(user=user, password=password)
        access_token = self.generate_access_token(user_id=user.id)
        return UserLoginSchema(user_id=user.id, access_token=access_token)

    def generate_access_token(self, user_id: str):
        payload = {
            'user_id': user_id,
            'expire': (dt.now(tz=datetime.UTC) + timedelta(days=7)).timestamp()
        }
        encoded_jwt = jwt.encode(payload, self.settings.JWT_SECRET_KEY, algorithm=self.settings.JWT_ENCODE_ALGORYTHM)
        return encoded_jwt

    @staticmethod
    def _validate_auth_user(user: UserProfile, password: str):
        if not user:
            raise UserNotFoundException
        if user.password != password:
            raise UserWrongPasswordException

    def get_user_id_from_access_token(self, token: str) -> int:
        try:
            payload = jwt.decode(token, self.settings.JWT_SECRET_KEY, algorithms=[self.settings.JWT_ENCODE_ALGORYTHM])
        except JWTError:
            raise TokenNotCorrectException
        if payload['expire'] < dt.now().timestamp():
            raise TokenExpireExtension
        return payload['user_id']
