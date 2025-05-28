from typing import Optional
from fastapi import Request

from src.core.schemas.common import QueryParam


class CommonParam:
    def __init__(self, filter_fields: list):
        self.filter_fields = filter_fields

    def __call__(
        self,
        request: Request,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 1000,
    ) -> QueryParam:
        offset_limit = limit if limit > 0 else 0

        query_clone = dict(request.query_params).copy()
        entries_to_remove = ("page", "number", "search")
        for k in entries_to_remove:
            query_clone.pop(k, None)

        query_clone = {k: v for k, v in query_clone.items() if k in self.filter_fields}

        return QueryParam(
            search=search,
            page=page,
            limit=limit,
            offset_limit=offset_limit,
            filter=query_clone,
        )
