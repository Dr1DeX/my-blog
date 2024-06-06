class PostNotFoundException(Exception):
    detail = 'Post not found'


class PostByCategoryNameException(Exception):
    detail = 'Post by category name not found'
