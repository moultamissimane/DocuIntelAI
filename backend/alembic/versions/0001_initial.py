"""initial schema: documents, chunks, pgvector HNSW index

Revision ID: 0001_initial
Revises:
Create Date: 2026-09-19

"""
import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "documents",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("name", sa.String(512), nullable=False),
        sa.Column("type", sa.String(32), nullable=False),
        sa.Column("file_format", sa.String(16), nullable=False),
        sa.Column("file_size", sa.String(32), nullable=False),
        sa.Column("upload_date", sa.String(32), nullable=False),
        sa.Column("status", sa.String(16), nullable=False, server_default="indexed"),
        sa.Column("raw_text", sa.Text, nullable=False),
        sa.Column("extracted_data", sa.JSON, nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "chunks",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column(
            "document_id",
            sa.String(64),
            sa.ForeignKey("documents.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("chunk_index", sa.Integer, nullable=False),
        sa.Column("page", sa.Integer, nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("token_count", sa.Integer, nullable=False),
        sa.Column("clause_type", sa.String(128), nullable=True),
        sa.Column("embedding", Vector(768), nullable=False),
    )

    op.create_index("ix_chunks_document_id", "chunks", ["document_id"])
    op.execute(
        "CREATE INDEX hnsw_chunks_embedding_idx ON chunks "
        "USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64)"
    )


def downgrade():
    op.drop_index("hnsw_chunks_embedding_idx", table_name="chunks")
    op.drop_index("ix_chunks_document_id", table_name="chunks")
    op.drop_table("chunks")
    op.drop_table("documents")
    op.execute("DROP EXTENSION IF EXISTS vector")
