import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  FileCode, 
  Workflow, 
  ShieldCheck, 
  Cloud, 
  Copy, 
  Check, 
  ArrowDown, 
  ArrowRight,
  Boxes,
  Zap
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'pydantic' | 'pgvector' | 'docker'>('diagram');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const fastApiCode = `# app/main.py - Enterprise FastAPI Document Intelligence Service
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
import pgvector
import asyncpg

app = FastAPI(
    title="AI Document Intelligence Platform",
    version="1.0.0",
    description="Python FastAPI + PostgreSQL pgvector RAG Backend"
)

class ExtractedContract(BaseModel):
    title: str = Field(..., description="Extracted contractual document title")
    counterparty: str = Field(..., description="Counterparty enterprise or vendor")
    expiry_date: Optional[str] = Field(None, description="ISO expiration date")
    payment_terms: Optional[str] = Field(None, description="Extracted Net 30/45/60 payment clause")
    supplier_obligations: List[str] = Field(default_factory=list)
    confidence_score: float = Field(..., ge=0.0, le=1.0)

class ExtractedInvoice(BaseModel):
    invoice_number: str
    counterparty: str
    total_amount: float
    currency: str = Field(..., example="MAD")
    due_date: str
    payment_terms: str

class RAGQueryRequest(BaseModel):
    question: str
    filter_type: Optional[str] = None
    min_similarity: float = 0.65
    top_k: int = 5

@app.post("/v1/documents/process")
async def process_document(file: UploadFile = File(...), bg_tasks: BackgroundTasks = None):
    """
    1. Parse file via PyMuPDF (PDF) or python-docx (DOCX)
    2. Extract structural sections and metadata
    3. Generate 768-dimension embeddings
    4. Store chunks into PostgreSQL pgvector
    """
    return {"status": "queued", "filename": file.filename}

@app.post("/v1/rag/query")
async def rag_query(request: RAGQueryRequest):
    """
    Hybrid search: Relational SQL filters + pgvector cosine similarity
    Followed by LLM synthesis with citations
    """
    return {"status": "success", "question": request.question}
`;

  const pgvectorCode = `-- PostgreSQL schema with pgvector extension enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents metadata table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'contract', 'invoice', 'technical_doc'
    counterparty VARCHAR(255),
    total_amount NUMERIC(15, 2),
    currency VARCHAR(10) DEFAULT 'MAD',
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Semantic chunks table with 768-dim embeddings
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    page_number INT NOT NULL,
    clause_type VARCHAR(100),
    chunk_text TEXT NOT NULL,
    embedding vector(768) NOT NULL -- Storing Google GenAI / modern embedding dims
);

-- High-performance HNSW index for sub-20ms cosine distance retrieval
CREATE INDEX hnsw_chunks_embedding_idx 
ON document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Example: "Show me all invoices above 50,000 MAD"
SELECT d.filename, d.counterparty, d.total_amount, d.currency, d.expiry_date
FROM documents d
WHERE d.document_type = 'invoice'
  AND d.total_amount > 50000
  AND d.currency = 'MAD'
ORDER BY d.total_amount DESC;

-- Example: Hybrid Vector + Metadata Search
SELECT 
    d.filename, 
    c.page_number,
    c.chunk_text,
    1 - (c.embedding <=> $1) AS cosine_similarity
FROM document_chunks c
JOIN documents d ON d.id = c.document_id
WHERE d.document_type = 'contract'
  AND c.clause_type ILIKE '%payment%'
ORDER BY c.embedding <=> $1 ASC
LIMIT 5;
`;

  const dockerCode = `# Dockerfile for FastAPI + Python + PyMuPDF Backend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for OCR and PDF rendering
RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    libpq-dev \\
    tesseract-ocr \\
    libgl1-mesa-glx \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run with Uvicorn production server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60">
                End-to-End Enterprise Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono">Project 3 Full-Stack Spec</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              AI Document Intelligence Platform
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Next.js & React Frontend communicating with high-performance Python FastAPI services, asynchronous Document Ingestion (OCR/DOCX), and PostgreSQL with pgvector for Hybrid RAG queries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              Next.js + React
            </span>
            <span className="px-3 py-1 text-xs font-mono rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800">
              Python FastAPI
            </span>
            <span className="px-3 py-1 text-xs font-mono rounded-lg bg-blue-950 text-blue-300 border border-blue-800">
              PostgreSQL + pgvector
            </span>
            <span className="px-3 py-1 text-xs font-mono rounded-lg bg-purple-950 text-purple-300 border border-purple-800">
              LLM API + RAG
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('diagram')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'diagram'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Workflow className="w-4 h-4" />
          Interactive System Topology
        </button>
        <button
          onClick={() => setActiveTab('pydantic')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'pydantic'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          FastAPI & Pydantic Engine
        </button>
        <button
          onClick={() => setActiveTab('pgvector')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'pgvector'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          PostgreSQL & pgvector DDL
        </button>
        <button
          onClick={() => setActiveTab('docker')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'docker'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Docker & Cloud AWS Topology
        </button>
      </div>

      {/* Tab 1: Diagram View */}
      {activeTab === 'diagram' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-cyan-400" />
              Runtime Dataflow & Dual-Pipeline Architecture
            </h2>

            {/* Visual Block Diagram */}
            <div className="flex flex-col items-center max-w-4xl mx-auto space-y-6">
              
              {/* Layer 1: Frontend */}
              <div className="w-full max-w-md bg-gradient-to-r from-slate-800 to-slate-800/80 border-2 border-cyan-500/50 rounded-xl p-4 text-center shadow-lg shadow-cyan-950/20">
                <div className="flex items-center justify-center gap-2 font-bold text-cyan-400 text-base">
                  <FileCode className="w-5 h-5" />
                  Frontend Layer: Next.js + React + TypeScript
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Document Explorer, Natural Language Chat, Citation Deep-linking, Query Inspector
                </p>
              </div>

              {/* Connector */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-cyan-500"></div>
                <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-300 border border-slate-700">
                  HTTP / REST + WebSocket Streaming
                </span>
                <div className="w-0.5 h-6 bg-cyan-500"></div>
                <ArrowDown className="w-4 h-4 text-cyan-400 -mt-1" />
              </div>

              {/* Layer 2: FastAPI */}
              <div className="w-full max-w-lg bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-blue-500/60 rounded-xl p-5 text-center shadow-xl">
                <div className="flex items-center justify-center gap-2 font-bold text-blue-400 text-base">
                  <Server className="w-5 h-5" />
                  Backend Service: Python FastAPI
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Pydantic v2 validation, Background Tasks, Token budget management, Rate Limiting
                </p>
              </div>

              {/* Connector Branch */}
              <div className="w-full max-w-2xl flex items-center justify-center relative">
                <div className="w-0.5 h-6 bg-slate-700"></div>
              </div>
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                
                {/* Branch Left: Document Processing */}
                <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-5 flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400 font-bold">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-300 text-sm">1. Document Processing Pipeline</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      PyMuPDF (PDF) • python-docx • Tesseract OCR v5.3 • LayoutLM Table Extraction
                    </p>
                  </div>
                  <div className="w-full bg-slate-950/80 rounded-lg p-3 text-left font-mono text-[11px] text-slate-400 space-y-1">
                    <div>→ 512-Token Window Chunking</div>
                    <div>→ 64-Token Stride Overlap</div>
                    <div>→ Pydantic Structured Metadata Validation</div>
                  </div>
                  <ArrowDown className="w-4 h-4 text-amber-400" />
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-xs font-bold text-slate-200">PostgreSQL + pgvector</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Metadata tables & HNSW Cosine Index (m=16, ef=64)
                    </p>
                  </div>
                </div>

                {/* Branch Right: AI Pipeline */}
                <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-5 flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400 font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-300 text-sm">2. AI & RAG Pipeline</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      768d Vector Embeddings • Hybrid Metadata SQL • LLM Synthesis & Verification
                    </p>
                  </div>
                  <div className="w-full bg-slate-950/80 rounded-lg p-3 text-left font-mono text-[11px] text-slate-400 space-y-1">
                    <div>→ Vector Cosine Similarity Search</div>
                    <div>→ Citation Extraction & Deep Links</div>
                    <div>→ Grounded Answers with Document Proof</div>
                  </div>
                  <ArrowDown className="w-4 h-4 text-purple-400" />
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-xs font-bold text-slate-200">LLM API (Gemini / Claude / OpenAI)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Prompt Engineering with Strict Context Grounding
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Key Differentiators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1">
                <Zap className="w-4 h-4" />
                <span>Hybrid Relational + Vector</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Executes metadata filters (e.g. invoices &gt; 50,000 MAD) natively in PostgreSQL alongside pgvector cosine similarity in a single query.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Hallucination Citations</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every generated answer links back to the specific chunk ID, page number, and similarity score with direct document deep-linking.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-1">
                <Cloud className="w-4 h-4" />
                <span>Cloud-Native & Production-Ready</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Containerized with Docker, automated CI/CD via GitHub Actions, and deployed on AWS ECS / Aurora PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: FastAPI & Pydantic Code */}
      {activeTab === 'pydantic' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">app/main.py (FastAPI + Pydantic v2)</span>
            </div>
            <button
              onClick={() => handleCopy(fastApiCode, 'fastapi')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all font-mono"
            >
              {copiedCode === 'fastapi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'fastapi' ? 'Copied' : 'Copy Python Code'}</span>
            </button>
          </div>
          <pre className="p-6 text-xs font-mono text-slate-300 overflow-x-auto bg-slate-950/90 leading-relaxed">
            {fastApiCode}
          </pre>
        </div>
      )}

      {/* Tab 3: pgvector & SQL */}
      {activeTab === 'pgvector' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">schema.sql (PostgreSQL + pgvector HNSW)</span>
            </div>
            <button
              onClick={() => handleCopy(pgvectorCode, 'pgvector')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all font-mono"
            >
              {copiedCode === 'pgvector' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'pgvector' ? 'Copied' : 'Copy SQL Schema'}</span>
            </button>
          </div>
          <pre className="p-6 text-xs font-mono text-cyan-300/90 overflow-x-auto bg-slate-950/90 leading-relaxed">
            {pgvectorCode}
          </pre>
        </div>
      )}

      {/* Tab 4: Docker & Infrastructure */}
      {activeTab === 'docker' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Dockerfile (FastAPI + OCR runtime)</span>
            </div>
            <button
              onClick={() => handleCopy(dockerCode, 'docker')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all font-mono"
            >
              {copiedCode === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'docker' ? 'Copied' : 'Copy Dockerfile'}</span>
            </button>
          </div>
          <pre className="p-6 text-xs font-mono text-emerald-300/90 overflow-x-auto bg-slate-950/90 leading-relaxed">
            {dockerCode}
          </pre>
        </div>
      )}

    </div>
  );
};
