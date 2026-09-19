from functools import lru_cache

from app.core.config import settings


@lru_cache(maxsize=1)
def get_client():
    if not settings.gemini_api_key:
        return None
    from google import genai

    return genai.Client(api_key=settings.gemini_api_key)
