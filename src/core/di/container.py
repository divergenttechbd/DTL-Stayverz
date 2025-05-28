from functools import partial

from fastapi import Depends
from src.modules.chat.models import ChatRoom
from src.modules.chat.service import ChatService
from src.modules.chat.repository import ChatRepository
from src.modules.users.models import User

from src.modules.users.repository import UserRepository
from src.modules.users.service import UserService


class Container:
    """
    This is the factory container that will instantiate all the controllers and
    repositories which can be accessed by the rest of the application.
    """

    # Repositories
    user_repository = partial(UserRepository)
    chat_repository = partial(ChatRepository)

    def get_user_service(self) -> UserService:
        return UserService(user_repository=self.user_repository())

    def get_chat_service(self) -> ChatService:
        return ChatService(chat_repository=self.chat_repository())
