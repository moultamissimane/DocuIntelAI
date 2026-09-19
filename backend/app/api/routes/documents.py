import time
from datetime import date

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.document import Chunk, Document
from app.schemas.document import DocumentItem
from app.services.chunking import chunk_pages
from app.services.embeddings import embed_text
from app.services.extraction import extract_metadata
from app.services.parsing import extract_pages

router = APIRouter()


def _document_to_schema(document: Document) -> DocumentItem:
    return DocumentItem.model_validate(
        {
            "id": document.id,
            "name": document.name,
            "type": document.type,
            "file_format": document.file_format,
            "file_size": document.file_size,
            "upload_date": document.upload_date,
            "status": document.status,
            "extracted_data": document.extracted_data,
            "raw_text": document.raw_text,
            "chunks": [
                {
                    "id": c.id,
                    "chunk_index": c.chunk_index,
                    "page": c.page,
                    "content": c.content,
                    "token_count": c.token_count,
                    "embedding_sample": list(c.embedding[:5]) if c.embedding is not None else [],
                    "clause_type": c.clause_type,
                }
                for c in document.chunks
            ],
        }
    )


@router.get("/documents", response_model=list[DocumentItem])
def list_documents(db: Session = Depends(get_db)):
    documents = db.execute(select(Document).order_by(Document.created_at.desc())).scalars().all()
    return [_document_to_schema(d) for d in documents]


@router.get("/documents/{document_id}", response_model=DocumentItem)
def get_document(document_id: str, db: Session = Depends(get_db)):
    document = db.get(Document, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return _document_to_schema(document)


@router.post("/documents/upload", response_model=DocumentItem)
async def upload_document(
    file: UploadFile = File(...),
    doc_type: str = Form("contract"),
    db: Session = Depends(get_db),
):
    content = await file.read()
    if len(content) > settings.max_upload_size_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {settings.max_upload_size_mb}MB limit")

    start = time.perf_counter()
    pages, file_format = extract_pages(file.filename, content)
    raw_text = "\n\n".join(pages).strip()
    chunk_defs = chunk_pages(pages)

    metadata = extract_metadata(file.filename, doc_type, raw_text)
    metadata["processing_time_ms"] = int((time.perf_counter() - start) * 1000)

    document = Document(
        name=file.filename,
        type=doc_type,
        file_format=file_format,
        file_size=f"{len(content) / 1024:.1f} KB",
        upload_date=date.today().isoformat(),
        status="indexed",
        raw_text=raw_text or "(no extractable text)",
        extracted_data=metadata,
    )

    for chunk_def in chunk_defs:
        document.chunks.append(
            Chunk(
                chunk_index=chunk_def["chunk_index"],
                page=chunk_def["page"],
                content=chunk_def["content"],
                token_count=chunk_def["token_count"],
                clause_type=None,
                embedding=embed_text(chunk_def["content"]),
            )
        )

    db.add(document)
    db.commit()
    db.refresh(document)
    return _document_to_schema(document)


@router.delete("/documents/{document_id}", status_code=204)
def delete_document(document_id: str, db: Session = Depends(get_db)):
    document = db.get(Document, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(document)
    db.commit()
