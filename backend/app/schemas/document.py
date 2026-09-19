from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class KeyClause(CamelModel):
    name: str
    text: str
    page: int


class ExtractedMetadata(CamelModel):
    title: str
    counterparty: Optional[str] = None
    invoice_number: Optional[str] = None
    total_amount: Optional[float] = None
    currency: Optional[str] = None
    effective_date: Optional[str] = None
    expiry_date: Optional[str] = None
    days_until_expiry: Optional[int] = None
    payment_terms: Optional[str] = None
    supplier_obligations: Optional[list[str]] = None
    client_obligations: Optional[list[str]] = None
    key_clauses: Optional[list[KeyClause]] = None
    summary: str
    confidence_score: float
    ocr_engine: str
    pydantic_validated: bool = True
    processing_time_ms: int


class DocumentChunkSchema(CamelModel):
    id: str
    chunk_index: int
    page: int
    content: str
    token_count: int
    embedding_sample: list[float]
    clause_type: Optional[str] = None


class DocumentItem(CamelModel):
    id: str
    name: str
    type: Literal["contract", "invoice", "technical_doc", "specification"]
    file_format: Literal["pdf", "docx", "txt"]
    file_size: str
    upload_date: str
    status: Literal["indexed", "processing", "error"]
    extracted_data: ExtractedMetadata
    chunks: list[DocumentChunkSchema]
    raw_text: str
