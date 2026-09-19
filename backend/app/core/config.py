from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://docuintel:docuintel@localhost:5432/docuintel"

    gemini_api_key: str | None = None
    gemini_llm_model: str = "gemini-3.8-flash"
    gemini_embedding_model: str = "models/text-embedding-004"
    embedding_dim: int = 768

    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    max_upload_size_mb: int = 25

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
