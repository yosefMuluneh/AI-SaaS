from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-SaaS Competitor Intelligence"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgrespassword@localhost:5433/aisaas_db"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()