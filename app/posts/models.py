from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey

from app.infrastructure.database import Base


class Posts(Base):
    __tablename__ = 'Posts'

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    title: Mapped[str]
    description: Mapped[str] = mapped_column(nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey('UserProfile.id'), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey('Categories.id'), nullable=False)

    author = relationship('UserProfile', back_populates='posts')
    category = relationship('Categories', back_populates='posts')


class Categories(Base):
    __tablename__ = 'Categories'

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    name: Mapped[str]

    posts = relationship('Posts', back_populates='category')
