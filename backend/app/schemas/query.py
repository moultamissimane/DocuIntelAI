from typing import Literal, Optional

from app.schemas.document import CamelModel


class QueryRequest(CamelModel):
    question: str
    selected_doc_id: Optional[str] = None


class RagCitation(CamelModel):
    doc_id: str
    doc_title: str
    doc_type: str
    chunk_id: str
    page: int
    similarity_score: float
    text_excerpt: str


class VectorSearchDetails(CamelModel):
    metric: Literal["cosine", "l2", "inner_product"] = "cosine"
    top_k: int
    latency_ms: int
    matched_chunks: int
    embedding_model: str
    pgvector_index: str = "hnsw_chunks_embedding_idx"


class RagQueryResponse(CamelModel):
    id: str
    question: str
    timestamp: str
    answer: str
    citations: list[RagCitation]
    generated_sql: Optional[str] = None
    matched_count: Optional[int] = None
    vector_search_details: VectorSearchDetails
