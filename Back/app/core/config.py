from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    app_name: str = Field("Delifit API", alias="APP_NAME")
    app_env: str = Field("development", alias="APP_ENV")
    debug: bool = Field(False, alias="DEBUG")
    secret_key: str = Field(..., alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")

    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


settings = get_settings()
