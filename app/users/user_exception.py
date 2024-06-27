class UserNotFoundException(Exception):
    detail = 'User not found'


class UserWrongPasswordException(Exception):
    detail = 'Wrong password'


class TokenExpireExtension(Exception):
    detail = 'Token expire'


class TokenNotCorrectException(Exception):
    detail = 'Token not correct'


class UserEmailUniqueException(Exception):
    detail = 'This email is already registered'
