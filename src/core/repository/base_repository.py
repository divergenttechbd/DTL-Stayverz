from typing import TypeVar, Type

from beanie import Document
from pydantic import BaseModel
from src.modules.chat.models import ChatRoom
from src.core.helpers.utils import paginateResponse
from src.core.schemas.common import PaginatedResponse, QueryParam
from src.core.logging import logger

ModelType = TypeVar("ModelType", bound=Document)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)


class BaseRepository:
    async def get_list(
        self,
        model: Type[ModelType],
        param: QueryParam,
        filter_param: dict | tuple = {},
        sorting: list = [],
    ) -> PaginatedResponse[ModelType]:
        offset = (param.page - 1) * param.offset_limit
        limit = param.limit
        data = (
            await model.find(*filter_param, limit=limit, skip=offset, fetch_links=True)
            .sort(sorting)
            .to_list()
        )
        total_count = await model.find(*filter_param).count()
        return paginateResponse(data, total_count, param.page, param.offset_limit, {})

    async def get(self, model: Type[ModelType], query_param: dict) -> ModelType | None:
        return await model.find(query_param).first_or_none()

    async def get_by_id(self, model: Type[ModelType], id: str) -> ModelType | None:
        instance = await model.get(id)
        if instance:
            await instance.fetch_all_links()
        return instance

    async def create(self, model: Type[ModelType], data: CreateSchemaType) -> ModelType:
        created_object = model(**data.model_dump())
        return await created_object.create()
