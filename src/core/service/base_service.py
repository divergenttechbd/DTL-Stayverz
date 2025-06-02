from src.core.repository import BaseRepository


class BaseService:
    """BaseService where you can write common service. So that you reuse"""

    def __init__(self, repository: BaseRepository):
        self.repository = repository
