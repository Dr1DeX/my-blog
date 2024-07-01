from fastapi import Depends, security, Security, HTTPException, status


from app.users.auth.service import AuthService
from app.users.user_exception import TokenExpireExtension, TokenNotCorrectException
from app.users.users_dependency import get_auth_service


reusable_oauth2 = security.HTTPBearer()


async def get_request_user_id(
        auth_service: AuthService = Depends(get_auth_service),
        token: security.http.HTTPAuthorizationCredentials = Security(reusable_oauth2)
) -> int:
    try:
        user_id = await auth_service.get_user_id_from_access_token(token=token.credentials)
    except TokenExpireExtension as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.detail
        )
    except TokenNotCorrectException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.detail
        )
    return user_id

