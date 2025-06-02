from collections.abc import Callable
from typing import Any

from fastapi.responses import JSONResponse
from starlette.requests import Request


class CustomErrorHandler:
    async def __call__(
        self, request: Request, call_next: Callable
    ) -> (Any | JSONResponse):
        try:
            return await call_next(request)
        except Exception as exc:
            return JSONResponse(status_code=500, content={"reason": str(exc)})
