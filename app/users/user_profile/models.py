from typing import Optional

from app.infrastructure.database import Base

from sqlalchemy.orm import Mapped, mapped_column, relationship


class UserProfile(Base):
    __tablename__ = 'UserProfile'

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    username: Mapped[str] = mapped_column(nullable=True)
    password: Mapped[str] = mapped_column(nullable=True)
    name: Mapped[Optional[str]]
    email: Mapped[Optional[str]]
    google_access_token: Mapped[Optional[str]]
    yandex_access_token: Mapped[Optional[str]]

    posts = relationship('Posts', back_populates='author')
