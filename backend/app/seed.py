"""Populate the database with representative enterprise documents for demoing the RAG assistant.

Run with: python -m app.seed
"""
from datetime import date, timedelta

from app.core.database import Base, SessionLocal, engine
from app.models.document import Chunk, Document
from app.services.embeddings import embed_text

TODAY = date.today()


def _in_days(n: int) -> str:
    return (TODAY + timedelta(days=n)).isoformat()


SEED_DOCUMENTS = [
    {
        "id": "ctr-atlas-001",
        "name": "Atlas_Cloud_SaaS_Master_Agreement_2024.pdf",
        "type": "contract",
        "file_format": "pdf",
        "file_size": "2.4 MB",
        "upload_date": _in_days(-40),
        "extracted_data": {
            "title": "Enterprise Cloud Infrastructure Master Service Agreement",
            "counterparty": "Atlas Cloud Solutions SARL",
            "effective_date": _in_days(-370),
            "expiry_date": _in_days(16),
            "payment_terms": (
                "Net 45 calendar days following receipt of undisputed monthly invoice. "
                "Late payments accrue interest at 1.5% per month."
            ),
            "supplier_obligations": [
                "Maintain an operational platform availability SLA of at least 99.95% measured monthly.",
                "Execute automated geo-redundant database backups every 6 hours with an RPO under 15 minutes.",
                "Provide 24/7 incident resolution with a maximum 30-minute response time for Severity-1 outages.",
                "Ensure SOC-2 Type II and ISO 27001 compliance with data residency in local data centers.",
            ],
            "client_obligations": [
                "Pay all validated recurring compute fees within the designated Net 45 schedule.",
                "Designate a primary engineering point of contact for scheduled maintenance windows.",
            ],
            "key_clauses": [
                {
                    "name": "Section 4.2 - Payment Terms & Audit",
                    "text": (
                        "Customer shall remit payment in full within Net forty-five (45) calendar days "
                        "from receipt of invoice. Overdue balances accrue a 1.5% monthly late charge."
                    ),
                    "page": 4,
                },
                {
                    "name": "Section 7.1 - Service Level Obligations",
                    "text": (
                        "Atlas Cloud warrants that the Vector Database and Ingestion API endpoints "
                        "shall maintain 99.95% monthly uptime."
                    ),
                    "page": 7,
                },
                {
                    "name": "Section 12.4 - Term & Termination",
                    "text": "This agreement expires unless renewed in writing 60 days prior to expiration.",
                    "page": 12,
                },
            ],
            "summary": (
                "Comprehensive enterprise SaaS agreement for cloud hosting, dedicated pgvector clusters, "
                "and API orchestration with Atlas Cloud Solutions."
            ),
            "confidence_score": 0.985,
            "ocr_engine": "PyMuPDF + Tesseract v5.3 OCR Engine",
            "pydantic_validated": True,
            "processing_time_ms": 412,
        },
        "chunks": [
            {
                "page": 1,
                "content": (
                    'MASTER SERVICES AGREEMENT between Enterprise Systems Corp ("Client") and Atlas '
                    'Cloud Solutions SARL ("Supplier"), headquartered in Boulevard d\'Anfa, Casablanca, Morocco.'
                ),
                "clause_type": "Preamble & Parties",
            },
            {
                "page": 4,
                "content": (
                    "SECTION 4. PAYMENT TERMS AND BILLING SCHEDULE: Invoices for cloud infrastructure "
                    "usage, vector search indexing, and managed services shall be issued on the 1st day "
                    "of each billing cycle. Customer agrees to pay the total invoiced amount within Net "
                    "forty-five (45) calendar days from invoice date. Overdue amounts incur interest at "
                    "a rate of 1.5% per 30-day period."
                ),
                "clause_type": "Payment Terms",
            },
            {
                "page": 7,
                "content": (
                    "SECTION 7. SUPPLIER OBLIGATIONS AND SERVICE LEVELS: Supplier shall guarantee "
                    "high-availability multi-zone deployment with 99.95% uptime for document embedding "
                    "APIs and PostgreSQL pgvector endpoints. Supplier must perform automated continuous "
                    "backups with an RPO under 15 minutes and provide 24/7 support with a 30-minute "
                    "initial response for critical Severity 1 incidents."
                ),
                "clause_type": "Supplier's Obligations",
            },
            {
                "page": 12,
                "content": (
                    "SECTION 12. DURATION, TERMINATION, AND EXPIRY: This Agreement shall expire "
                    f"automatically on {_in_days(16)}. Renewal requires written agreement by both parties."
                ),
                "clause_type": "Term & Expiration",
            },
        ],
        "raw_text": (
            "MASTER SERVICES AGREEMENT between Enterprise Systems Corp and Atlas Cloud Solutions SARL. "
            "Payment terms: Net 45 calendar days. Supplier guarantees 99.95% uptime, 15-minute RPO, "
            f"and 24/7 support. Expiry: {_in_days(16)}."
        ),
    },
    {
        "id": "ctr-maghreb-412",
        "name": "Maghreb_Facilities_Maintenance_Contract.docx",
        "type": "contract",
        "file_format": "docx",
        "file_size": "1.1 MB",
        "upload_date": _in_days(-36),
        "extracted_data": {
            "title": "Commercial Facilities & Infrastructure SLA Agreement",
            "counterparty": "Maghreb Facility Services SA",
            "effective_date": _in_days(-360),
            "expiry_date": _in_days(11),
            "payment_terms": "Net 30 days upon validated monthly facilities inspection report.",
            "supplier_obligations": [
                "Deploy certified on-site mechanical and electrical engineers 24/7 at data center hubs.",
                "Execute preventive maintenance on backup diesel generators every 14 days.",
                "Guarantee a 2-hour on-site arrival SLA for HVAC or electrical distribution interruptions.",
                "Maintain minimum professional liability coverage of 15,000,000 MAD.",
            ],
            "client_obligations": [
                "Provide biometric security clearance and unhindered facility access for engineers.",
            ],
            "key_clauses": [
                {
                    "name": "Clause 3.1 - Compensation & Net 30 Terms",
                    "text": "Payment terms are Net thirty (30) days from formal presentation of the monthly audit.",
                    "page": 2,
                },
                {
                    "name": "Clause 5.4 - Mandatory Supplier Obligations",
                    "text": "Supplier warrants 24/7 licensed engineers and guaranteed 2-hour cooling emergency response.",
                    "page": 5,
                },
            ],
            "summary": (
                "Data center critical infrastructure and physical engineering maintenance contract "
                "with Maghreb Facility Services."
            ),
            "confidence_score": 0.991,
            "ocr_engine": "python-docx XML Parser & Normalizer",
            "pydantic_validated": True,
            "processing_time_ms": 290,
        },
        "chunks": [
            {
                "page": 1,
                "content": (
                    "FACILITY SERVICES MASTER AGREEMENT entered into by and between Enterprise "
                    "Operations LLC and Maghreb Facility Services SA, Casablanca Technopark."
                ),
                "clause_type": "Parties",
            },
            {
                "page": 2,
                "content": (
                    "CLAUSE 3. BILLING AND REMITTANCE: Compensation for routine monthly maintenance is "
                    "fixed at 45,000 MAD per month. All payments shall be processed strictly on Net "
                    "thirty (30) day terms following validation of the facility engineer inspection log."
                ),
                "clause_type": "Payment Terms",
            },
            {
                "page": 5,
                "content": (
                    "CLAUSE 5. THE SUPPLIER'S OBLIGATIONS: Maghreb Facility Services is obligated to "
                    "provide 24/7 on-site certified engineering staff for uninterrupted HVAC and "
                    "precision cooling, guaranteeing technician mobilization in under 120 minutes."
                ),
                "clause_type": "Supplier's Obligations",
            },
            {
                "page": 8,
                "content": (
                    "CLAUSE 9. EXPIRATION AND RENEWAL NOTICES: This contract term expires on "
                    f"{_in_days(11)}. Absent a written extension, services wind down with a 30-day "
                    "knowledge transfer period."
                ),
                "clause_type": "Expiration",
            },
        ],
        "raw_text": (
            "FACILITY SERVICES MASTER AGREEMENT. Supplier obligations: 24/7 on-site technicians, "
            "bi-weekly generator tests, 2-hour cooling response. Payment terms Net 30 days. "
            f"Expiration date: {_in_days(11)}."
        ),
    },
    {
        "id": "inv-atlas-8891",
        "name": "Invoice_INV-2024-8891_AtlasDataCenter.pdf",
        "type": "invoice",
        "file_format": "pdf",
        "file_size": "680 KB",
        "upload_date": _in_days(-30),
        "extracted_data": {
            "title": "Monthly Dedicated pgvector & GPU Cluster Compute Invoice",
            "counterparty": "Atlas Data Centers SARL",
            "invoice_number": "INV-2024-8891",
            "total_amount": 74500,
            "currency": "MAD",
            "effective_date": _in_days(-30),
            "expiry_date": _in_days(0),
            "payment_terms": "Due upon receipt, maximum Net 30 days. Bank wire transfer.",
            "summary": (
                "Invoice for 3x Dedicated NVIDIA L40S Vector Embeddings Server Cluster and 500GB "
                "pgvector High-IOPS NVMe storage."
            ),
            "confidence_score": 0.994,
            "ocr_engine": "Tesseract OCR + LayoutLM Form Parser",
            "pydantic_validated": True,
            "processing_time_ms": 185,
        },
        "chunks": [
            {
                "page": 1,
                "content": (
                    "INVOICE NUMBER: INV-2024-8891. Vendor: Atlas Data Centers SARL. Total Due: "
                    "74,500 MAD (TTC). Line Items: 1) Dedicated GPU Compute Cluster (NVIDIA L40S) - "
                    "58,000 MAD. 2) High-Throughput NVMe Vector Storage 500GB - 16,500 MAD."
                ),
                "clause_type": "Invoice Line Items & Total",
            },
        ],
        "raw_text": (
            "INVOICE INV-2024-8891. Vendor: Atlas Data Centers SARL. Total Amount: 74,500 MAD. "
            "GPU Vector Cluster and NVMe Storage."
        ),
    },
    {
        "id": "inv-oracle-9104",
        "name": "Invoice_INV-2024-9104_EnterpriseDatabaseSupport.pdf",
        "type": "invoice",
        "file_format": "pdf",
        "file_size": "820 KB",
        "upload_date": _in_days(-40),
        "extracted_data": {
            "title": "Quarterly High-Availability PostgreSQL Support & DB Tuning",
            "counterparty": "North Africa Digital Systems",
            "invoice_number": "INV-2024-9104",
            "total_amount": 128400,
            "currency": "MAD",
            "effective_date": _in_days(-40),
            "expiry_date": _in_days(-10),
            "payment_terms": "Net 30 days via direct corporate bank transfer. Subject to 20% Moroccan VAT.",
            "summary": (
                "High availability database support, pgvector indexing tuning, and automated replica "
                "failover configuration."
            ),
            "confidence_score": 0.988,
            "ocr_engine": "PyMuPDF + Tesseract OCR",
            "pydantic_validated": True,
            "processing_time_ms": 210,
        },
        "chunks": [
            {
                "page": 1,
                "content": (
                    "TAX INVOICE: INV-2024-9104. Issuer: North Africa Digital Systems. Total Amount: "
                    "128,400 MAD (Net: 107,000 MAD, VAT 20%: 21,400 MAD). Services: PostgreSQL 16 "
                    "Enterprise HA Support, pgvector HNSW indexing optimization."
                ),
                "clause_type": "Invoice Header & Amounts",
            },
        ],
        "raw_text": "TAX INVOICE INV-2024-9104. North Africa Digital Systems. Total: 128,400 MAD. PostgreSQL pgvector optimization.",
    },
    {
        "id": "inv-rabat-6500",
        "name": "Invoice_INV-2024-6500_OfficeHardware.pdf",
        "type": "invoice",
        "file_format": "pdf",
        "file_size": "390 KB",
        "upload_date": _in_days(-55),
        "extracted_data": {
            "title": "Ergonomic Workstations & Development Monitors",
            "counterparty": "Rabat Tech Solutions",
            "invoice_number": "INV-2024-6500",
            "total_amount": 14200,
            "currency": "MAD",
            "effective_date": _in_days(-55),
            "expiry_date": _in_days(-25),
            "payment_terms": "Immediate upon delivery (Settled).",
            "summary": "Dual-monitor developer setups and accessories for engineering workstation upgrades.",
            "confidence_score": 0.985,
            "ocr_engine": "Tesseract OCR v5.3",
            "pydantic_validated": True,
            "processing_time_ms": 120,
        },
        "chunks": [
            {
                "page": 1,
                "content": "RECEIPT INVOICE: INV-2024-6500. Rabat Tech Solutions. Total: 14,200 MAD. Paid in full via CMI payment gateway.",
                "clause_type": "Settled Invoice",
            },
        ],
        "raw_text": "INVOICE INV-2024-6500. Rabat Tech Solutions. Total: 14,200 MAD. Status: Paid.",
    },
    {
        "id": "doc-rag-spec-01",
        "name": "Enterprise_FastAPI_pgvector_Architecture_Spec.docx",
        "type": "technical_doc",
        "file_format": "docx",
        "file_size": "3.1 MB",
        "upload_date": _in_days(-25),
        "extracted_data": {
            "title": "Enterprise Document Intelligence & pgvector RAG Architecture Specification",
            "counterparty": "Internal Engineering Team / Python & FastAPI Core",
            "effective_date": _in_days(-25),
            "summary": (
                "Complete technical architecture guide covering FastAPI async endpoints, Pydantic v2 "
                "data models, pgvector HNSW indexing, chunking window parameters, and deployment."
            ),
            "confidence_score": 0.998,
            "ocr_engine": "python-docx AST Extractor + Markdown Tokenizer",
            "pydantic_validated": True,
            "processing_time_ms": 440,
        },
        "chunks": [
            {
                "page": 1,
                "content": (
                    "ARCHITECTURE OVERVIEW: The platform frontend (Next.js / React / TypeScript) "
                    "interfaces with a high-throughput Python FastAPI backend. The FastAPI layer "
                    "orchestrates asynchronous document parsing pipelines (PyMuPDF for PDF, "
                    "python-docx for DOCX) and validates extracted structures via Pydantic v2 models."
                ),
                "clause_type": "System Architecture",
            },
            {
                "page": 2,
                "content": (
                    "POSTGRESQL + PGVECTOR SPECIFICATION: Documents are split into semantic chunks "
                    "using a 400-word window with 50-word overlap. Vectors are embedded via "
                    "768-dimensional models and stored in PostgreSQL with the pgvector extension. "
                    "The database employs an HNSW index with parameters m=16, ef_construction=64, "
                    "and utilizes cosine distance (<=>) for sub-20ms nearest-neighbor retrieval."
                ),
                "clause_type": "Vector Search Benchmark",
            },
            {
                "page": 3,
                "content": (
                    "HYBRID QUERY PIPELINE: Queries combining metadata filters (e.g., invoices > "
                    "50,000 MAD, or contracts expiring <= 30 days) execute as compound queries in "
                    "PostgreSQL combining relational WHERE clauses with vector similarity ranking, "
                    "followed by LLM synthesis and citation grounding."
                ),
                "clause_type": "Hybrid RAG Pipeline",
            },
        ],
        "raw_text": (
            "TECHNICAL SPECIFICATION: Next.js + FastAPI + PostgreSQL pgvector. 400-word chunking, "
            "768-dimension embeddings, HNSW index m=16, cosine distance. Hybrid metadata + vector queries."
        ),
    },
]


def seed():
    Base.metadata.create_all(bind=engine, checkfirst=True)
    db = SessionLocal()
    try:
        if db.query(Document).count() > 0:
            print("Documents already present, skipping seed.")
            return

        for doc_def in SEED_DOCUMENTS:
            extracted = dict(doc_def["extracted_data"])
            expiry = extracted.get("expiry_date")
            if expiry:
                y, m, d = map(int, expiry.split("-"))
                extracted["days_until_expiry"] = (date(y, m, d) - TODAY).days

            document = Document(
                id=doc_def["id"],
                name=doc_def["name"],
                type=doc_def["type"],
                file_format=doc_def["file_format"],
                file_size=doc_def["file_size"],
                upload_date=doc_def["upload_date"],
                status="indexed",
                raw_text=doc_def["raw_text"],
                extracted_data=extracted,
            )

            for idx, chunk_def in enumerate(doc_def["chunks"], start=1):
                document.chunks.append(
                    Chunk(
                        chunk_index=idx,
                        page=chunk_def["page"],
                        content=chunk_def["content"],
                        token_count=len(chunk_def["content"].split()),
                        clause_type=chunk_def.get("clause_type"),
                        embedding=embed_text(chunk_def["content"]),
                    )
                )

            db.add(document)

        db.commit()
        print(f"Seeded {len(SEED_DOCUMENTS)} documents.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
