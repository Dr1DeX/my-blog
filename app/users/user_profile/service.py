from dataclasses import dataclass

from app.users.user_exception import UserEmailUniqueException
from app.users.user_profile.repository import UserRepository
from app.users.auth.schema import UserLoginSchema
from app.users.auth.service import AuthService
from app.users.user_profile.schema import UserCreateSchema, UserMeSchema


@dataclass
class UserService:
    user_repository: UserRepository
    auth_service: AuthService

    async def create_user(self, body: UserCreateSchema) -> UserLoginSchema:
        verify_user_by_email = await self.user_repository.get_user_by_email(email=body.email)
        if verify_user_by_email:
            raise UserEmailUniqueException
        user = await self.user_repository.create_user(user_data=body)
        access_token = self.auth_service.generate_access_token(user_id=user.id)
        return UserLoginSchema(user_id=user.id, access_token=access_token)

    async def get_user(self, user_id: int) -> UserMeSchema:
        user = await self.user_repository.get_user(user_id=user_id)
        return UserMeSchema(
            username=user.username,
            email=user.email,
            image=user.image
        )