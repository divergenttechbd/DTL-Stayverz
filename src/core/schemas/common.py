from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

Model = TypeVar("Model", bound=BaseModel)


class QueryParam(BaseModel):
    search: Optional[str] = None
    page: int
    limit: int = 1000
    offset_limit: int
    filter: dict[str, str] = {}


class PaginatedResponse(BaseModel, Generic[Model]):
    data: list[Model]
    extra_data: Any = {}
    meta_info: dict[str, Any] = {}
