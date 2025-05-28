from src.core.schemas.common import PaginatedResponse, QueryParam
from src.modules.users.models import User
from src.core.service import BaseService
from src.modules.users.repository import UserRepository


class UserService(BaseService):
    def __init__(self, user_repository: UserRepository):
        super().__init__(repository=user_repository)

    async def get_users(self, queryParam: QueryParam) -> PaginatedResponse[User]:
        return await self.repository.get_list(model=User, param=queryParam)
