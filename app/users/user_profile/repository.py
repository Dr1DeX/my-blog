from dataclasses import dataclass

from sqlalchemy import insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.users.user_profile.models import UserProfile
from app.users.user_profile.schema import UserCreateSchema, UserUpdateSchema


@dataclass
class UserRepository:
    db_session: AsyncSession

    async def create_user(self, user_data: UserCreateSchema) -> UserProfile:
        query = insert(UserProfile).values(
            **user_data.dict(exclude_none=True)
        ).returning(UserProfile.id)

        async with self.db_session as session:
            user_id: int = (await session.execute(query)).scalar()
            await session.commit()
            return await self.get_user(user_id=user_id)

    async def get_user(self, user_id: int) -> UserProfile | None:
        query = select(UserProfile).where(UserProfile.id == user_id)

        async with self.db_session as session:
            return (await session.execute(query)).scalar_one_or_none()

    async def get_user_by_username(self, username: str) -> UserProfile | None:
        query = select(UserProfile).where(UserProfile.username == username)

        async with self.db_session as session:
            return (await session.execute(query)).scalar_one_or_none()

    async def get_user_by_email(self, email: str) -> UserProfile | None:
        query = select(UserProfile).where(UserProfile.email == email)

        async with self.db_session as session:
            user: UserProfile = (await session.execute(query)).scalar_one_or_none()
            return user

    async def update_user(self, user_id: int, user_update: UserUpdateSchema):
        query = (update(
            UserProfile)
                 .where(UserProfile.id == user_id)
                 .values(**user_update.dict(exclude_none=True))
                 )

        async with self.db_session as session:
            await session.execute(query)
            await session.commit()
