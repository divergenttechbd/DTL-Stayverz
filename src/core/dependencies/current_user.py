from fastapi import Depends, HTTPException
from starlette.status import HTTP_403_FORBIDDEN

from core.dependencies.authentication import JWTBearer, TokenData


def get_current_user(
    token_data: TokenData = Depends(JWTBearer()),
) -> dict:
    try:
        return token_data
    except KeyError:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Username missing")
