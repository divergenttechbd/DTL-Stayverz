from fastapi import APIRouter, Depends

from src.core.dependencies.authentication import JWTBearer, JWTWebSocketBearer
from src.modules.chat.controllers.user import router as user_router
from src.modules.chat.controllers.admin import router as admin_router
from src.modules.chat.controllers.ws import router as ws_router

api_router = APIRouter()

include_api = api_router.include_router


routers = (
    (user_router, "chat/user", "User Chat", "private"),
    (admin_router, "chat/admin", "Admin Chat", "private"),
)

for router_item in routers:
    router, prefix, tag, api_type = router_item

    if api_type == "private":
        include_api(
            router, prefix=f"/{prefix}", tags=[tag], dependencies=[Depends(JWTBearer())]
        )
    else:
        include_api(
            router,
            prefix=f"/{prefix}",
            tags=[tag],
        )

include_api(
    ws_router,
    prefix=f"/ws/chat",
    tags=["User Chat"],
    dependencies=[Depends(JWTWebSocketBearer())],
)
