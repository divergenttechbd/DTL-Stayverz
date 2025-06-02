import asyncio
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware import Middleware
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from src.core.db.connector import Database
from src.core.cache import Cache, RedisBackend
from src.core.config import settings

from src.core.logging import logger
from src.core.middleware import (
    CustomErrorHandler,
    CustomResponseMiddleware,
    RouterLoggingMiddleware,
)
from src.routers import api_router
from src.modules.chat.controllers.ws import broadcast


def make_middleware() -> list[Middleware]:
    middleware = [
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        ),
        # Middleware(RouterLoggingMiddleware, logger=logger),
        Middleware(CustomResponseMiddleware),
    ]
    return middleware


def init_routers(app_: FastAPI) -> None:
    app_.include_router(api_router, prefix=f"/api/{settings.APP_VERSION}")


def init_cache() -> None:
    Cache.init(backend=RedisBackend())


def handle_exception(app: FastAPI) -> None:
    app.middleware("http")(CustomErrorHandler())


def custom_request_validation(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        details = exc.errors()
        modified_details = []
        for error in details:
            modified_details.append(
                {
                    str(error["loc"][1]): error["msg"],
                }
            )
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=jsonable_encoder({"detail": modified_details}),
        )


def create_app() -> FastAPI:
    app_ = FastAPI(
        title="Gust House Chat Service",
        description="Gust House Chat Service",
        version="1.0.0",
        docs_url=None if settings.ENV == "prod" else "/docs",
        redoc_url=None if settings.ENV == "prod" else "/redoc",
        middleware=make_middleware(),
        debug=True,
    )

    init_routers(app_=app_)
    init_cache()
    handle_exception(app_)
    custom_request_validation(app_)

    return app_


app = create_app()


@app.on_event("startup")
async def app_init() -> None:
    db =  Database("mongodb://localhost:27017")
    if await db.connect_to_database():
        logger.info("✅ MongoDB connected")
    else:
        logger.warning("❌ MongoDB connection failed")
    data = await broadcast.connect()
    print(data, " ---data--- ")


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await broadcast.disconnect()
