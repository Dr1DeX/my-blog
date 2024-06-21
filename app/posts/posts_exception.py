class PostNotFoundException(Exception):
    detail = 'Post not found'


class PostByCategoryNameException(Exception):
    detail = 'Post by category name not found'


class CategoryNotFoundException(Exception):
    detail = 'Category not found'


class FileFormatIncorrectException(Exception):
    detail = 'File format not supported'
