import json
from functools import wraps
from fastapi import HTTPException

from src.core.helpers.enum import UserTypeOption


def permission_required(u_type: list[UserTypeOption]):
    def decorator_auth(func):
        @wraps(func)
        async def wrapper_auth(request, *args, **kwargs):
            current_user = request.state.user
            if not current_user.u_type in u_type:
                raise HTTPException(status_code=403, detail="Not permitted")
            return await func(request, *args, **kwargs)

        return wrapper_auth

    return decorator_auth
