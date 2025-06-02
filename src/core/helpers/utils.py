from datetime import datetime
import math
from typing import Any

from pytz import timezone

from src.core.schemas.common import PaginatedResponse


def paginateResponse(
    data: list, total: int, page: int, limit: int, extra_data: Any
) -> PaginatedResponse:
    lastPage = math.ceil(total / limit) if limit > 0 else 1
    nextPage = None if page + 1 > lastPage else page + 1
    prevPage = None if page - 1 < 1 > lastPage else page - 1
    return {
        "data": data,
        "extra_data": extra_data,
        "meta_info": {
            "count": total,
            "currentPage": page,
            "nextPage": nextPage,
            "prevPage": prevPage,
            "lastPage": lastPage,
        },
    }


def get_current_datetime(timezone_str: str = "Asia/Dhaka") -> datetime:
    tz = timezone(timezone_str)
    return datetime.now(tz)
