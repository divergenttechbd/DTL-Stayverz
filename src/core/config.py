from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str
    DESCRIPTION: str
    SECRET_KEY: str
    JWT_ALGORITHM: str
    APP_VERSION: str
    ENV: str
    AMQP_SERVER_URL: str
    FCM_SERVER_KEY_PATH: str

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()
