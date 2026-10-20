from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-SaaS Competitor Intelligence"
    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgrespassword@localhost:5433/aisaas_db"
    )
    REDIS_URL: str = "redis://localhost:6379/0"

    SECRET_KEY: str = "super-secret-jwt-key-change-in-production-12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    model_config = SettingsConfigDict(
        env_file=".env", extra="ignore", env_file_encoding="utf-8"
    )


settings = Settings()
