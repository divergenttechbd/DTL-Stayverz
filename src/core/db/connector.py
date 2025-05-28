from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from src.modules.users.models import User
from src.modules.chat.models import ChatRoom, Message


class Database:
    def __init__(
        self,
        mongo_uri: str,
    ) -> None:
        self.mongo_uri: str = mongo_uri
        self.client = None

    async def connect_to_database(self) -> None:
        self.client = AsyncIOMotorClient(self.mongo_uri)
        await init_beanie(
            self.client.chat_service, document_models=[User, ChatRoom, Message]
        )

    async def disconnect_from_database(self) -> None:
        pass
