from typing import Any
from fastapi import APIRouter, Depends
from src.modules.users.models import User
from src.core.dependencies.param import CommonParam
from src.core.di import Container
from src.core.schemas.common import PaginatedResponse, QueryParam


from src.modules.users.service import UserService


router = APIRouter(prefix="")


@router.get("/", response_model=PaginatedResponse[User])
async def get_users(
    user_service: UserService = Depends(Container().get_user_service),
    params: QueryParam = Depends(CommonParam(filter_fields=["name"])),
) -> Any:
    print(" -------------- ")

    return await user_service.get_users(params)
