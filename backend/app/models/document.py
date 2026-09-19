import uuid
from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.config import settings
from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"doc-{uuid.uuid4().hex[:12]}"
    )
    name: Mapped[str] = mapped_column(String(512))
    type: Mapped[str] = mapped_column(String(32))
    file_format: Mapped[str] = mapped_column(String(16))
    file_size: Mapped[str] = mapped_column(String(32))
    upload_date: Mapped[str] = mapped_column(String(32))
    status: Mapped[str] = mapped_column(String(16), default="indexed")
    raw_text: Mapped[str] = mapped_column(Text)
    extracted_data: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    chunks: Mapped[list["Chunk"]] = relationship(
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="Chunk.chunk_index",
    )


class Chunk(Base):
    __tablename__ = "chunks"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: f"chk-{uuid.uuid4().hex[:12]}"
    )
    document_id: Mapped[str] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE")
    )
    chunk_index: Mapped[int] = mapped_column(Integer)
    page: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text)
    token_count: Mapped[int] = mapped_column(Integer)
    clause_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    embedding: Mapped[list[float]] = mapped_column(Vector(settings.embedding_dim))

    document: Mapped["Document"] = relationship(back_populates="chunks")
