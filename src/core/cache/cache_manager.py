import functools
import pickle
from typing import Any

from src.core.cache.redis_backend import RedisBackend
from src.core.logging import logger


class CacheManager:
    def __init__(self) -> None:
        self._backend: RedisBackend | None = None

    @property
    def backend(self) -> RedisBackend:
        if self._backend is None:
            raise RuntimeError("Cache backend is not initialized.")
        return self._backend

    def init(self, backend: RedisBackend) -> None:
        self._backend = backend

    async def get(self, key: str) -> Any:
        try:
            data = await self.backend.get(key)
            data = pickle.loads(data)
            return data
        except Exception as err:
            logger.error(f"Can not set cache data: {str(err)}")
            return False

    async def set(self, key: str, value: Any, ttl: int | None = None) -> bool:
        try:
            await self.backend.set(key, value, ttl)
        except Exception as err:
            logger.error(f"Can not set cache data: {str(err)}")
            return False
        return True

    async def delete(self, key: str) -> bool:
        try:
            await self.backend.delete(key)
        except Exception as err:
            logger.error(f"Can not delete cache data: {str(err)}")
            return False
        return True

    def cached(self, expire_time: int = 3600) -> Any:
        def decorator(func: Any) -> Any:
            @functools.wraps(func)
            def wrapper(*args: Any, **kwargs: Any) -> Any:
                cache_key = f"cache:{func.__name__}:{args}:{kwargs}"
                cached_result = self.get(cache_key)
                if cached_result is not None:
                    return cached_result
                else:
                    result = func(*args, **kwargs)
                    self.set(cache_key, result, expire_time)
                    return result

            return wrapper

        return decorator


Cache = CacheManager()
