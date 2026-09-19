import hashlib

import numpy as np

from app.core.config import settings
from app.services.gemini_client import get_client


def _fallback_embedding(text: str) -> list[float]:
    """Deterministic pseudo-embedding so vector search stays functional without an API key."""
    seed = int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16) % (2**32)
    rng = np.random.default_rng(seed)
    vector = rng.normal(size=settings.embedding_dim)
    vector = vector / (np.linalg.norm(vector) + 1e-9)
    return vector.tolist()


def embed_text(text: str) -> list[float]:
    client = get_client()
    if client is not None:
        try:
            result = client.models.embed_content(
                model=settings.gemini_embedding_model,
                contents=text,
                config={"output_dimensionality": settings.embedding_dim},
            )
            return list(result.embeddings[0].values)
        except Exception:
            pass
    return _fallback_embedding(text)
