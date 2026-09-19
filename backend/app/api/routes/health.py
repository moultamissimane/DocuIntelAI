from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
def health():
    return {
        "status": "ok",
        "hasGeminiKey": bool(settings.gemini_api_key),
        "embeddingModel": settings.gemini_embedding_model,
        "llmModel": settings.gemini_llm_model,
    }
