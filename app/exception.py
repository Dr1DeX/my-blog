class PostNotFoundException(Exception):
    detail = 'Post not found'


class PostByCategoryNameException(Exception):
    detail = 'Post by category name not found'


class UserNotFoundException(Exception):
    detail = 'User not found'


class UserWrongPasswordException(Exception):
    detail = 'Wrong password'


class TokenExpireExtension(Exception):
    detail = 'Token expire'


class TokenNotCorrectException(Exception):
    detail = 'Token not correct'


class CategoryNotFoundException(Exception):
    detail = 'Category not found'
