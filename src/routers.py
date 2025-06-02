from fastapi import APIRouter


from src.modules.health import controller
from src.modules.users.router import api_router as accounts_router
from src.modules.chat.router import api_router as chat_router

api_router = APIRouter()


api_router.include_router(controller.router)
api_router.include_router(accounts_router)
api_router.include_router(chat_router)
