from typing import Any

from fastapi import APIRouter

from src.core.config import settings
from src.modules.health.schemas import HealthCheck

router = APIRouter(prefix="/health-check", tags=["Health Check"])


@router.get("/", response_model=HealthCheck)
def health_check() -> Any:
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.APP_VERSION,
        "description": settings.DESCRIPTION,
    }
