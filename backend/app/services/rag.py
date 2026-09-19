import time
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Chunk, Document
from app.services.embeddings import embed_text
from app.services.gemini_client import get_client


def _sql_preview(selected_doc_id: str | None) -> str:
    if selected_doc_id:
        return f"""SELECT c.id, c.chunk_index, c.page, c.content,
       1 - (c.embedding <=> :query_embedding) AS similarity
FROM chunks c
WHERE c.document_id = '{selected_doc_id}'
ORDER BY c.embedding <=> :query_embedding
LIMIT 6;"""
    return """SELECT d.name, d.type, c.id, c.page, c.content,
       1 - (c.embedding <=> :query_embedding) AS similarity
FROM chunks c
JOIN documents d ON d.id = c.document_id
ORDER BY c.embedding <=> :query_embedding
LIMIT 6;"""


def _synthesize_answer(question: str, context_snippets: list[str], citations: list[dict]) -> str:
    client = get_client()
    if client is not None and context_snippets:
        try:
            system_instruction = (
                "You are the AI Document Intelligence Engine for an enterprise platform "
                "(FastAPI + PostgreSQL pgvector backend). Answer strictly using the retrieved "
                "context chunks below. Cite document titles and page numbers inline. Be concise, "
                "factual, and use markdown formatting (bold key figures, bullet points for lists)."
            )
            prompt = f"Question: {question}\n\nRetrieved context chunks:\n\n" + "\n\n".join(context_snippets)
            response = client.models.generate_content(
                model=settings.gemini_llm_model,
                contents=prompt,
                config={"system_instruction": system_instruction, "temperature": 0.2},
            )
            if response.text:
                return response.text
        except Exception:
            pass

    if not citations:
        return (
            f'No indexed chunks matched "{question}". Try uploading relevant documents '
            "or rephrasing your query."
        )

    bullets = "\n".join(
        f"- **{c['doc_title']}** (page {c['page']}, {c['similarity_score'] * 100:.1f}% match): "
        f"{c['text_excerpt']}"
        for c in citations
    )
    return (
        f"Based on **{len(citations)} retrieved chunk(s)** via PostgreSQL pgvector cosine "
        f"similarity search:\n\n{bullets}"
    )


def run_query(db: Session, question: str, selected_doc_id: str | None) -> dict:
    start = time.perf_counter()
    query_vector = embed_text(question)

    distance = Chunk.embedding.cosine_distance(query_vector).label("distance")
    stmt = (
        select(Chunk, Document, distance)
        .join(Document, Chunk.document_id == Document.id)
    )
    if selected_doc_id:
        stmt = stmt.where(Document.id == selected_doc_id)
    stmt = stmt.order_by(distance).limit(6)

    rows = db.execute(stmt).all()

    citations = []
    context_snippets = []
    for chunk, document, dist in rows:
        similarity = max(0.0, min(1.0, 1 - float(dist)))
        doc_title = document.extracted_data.get("title") or document.name
        citations.append(
            {
                "doc_id": document.id,
                "doc_title": doc_title,
                "doc_type": document.type,
                "chunk_id": chunk.id,
                "page": chunk.page,
                "similarity_score": round(similarity, 3),
                "text_excerpt": chunk.content[:220],
            }
        )
        context_snippets.append(f"[{doc_title} | page {chunk.page}] {chunk.content}")

    answer = _synthesize_answer(question, context_snippets, citations)
    latency_ms = int((time.perf_counter() - start) * 1000)

    return {
        "id": f"query-{int(time.time() * 1000)}",
        "question": question,
        "timestamp": datetime.now().strftime("%H:%M"),
        "answer": answer,
        "citations": citations,
        "generated_sql": _sql_preview(selected_doc_id),
        "matched_count": len(citations),
        "vector_search_details": {
            "metric": "cosine",
            "top_k": 6,
            "latency_ms": latency_ms,
            "matched_chunks": len(citations),
            "embedding_model": (
                settings.gemini_embedding_model
                if settings.gemini_api_key
                else "fallback-hash-embedding (768d, offline)"
            ),
            "pgvector_index": "hnsw_chunks_embedding_idx",
        },
    }
