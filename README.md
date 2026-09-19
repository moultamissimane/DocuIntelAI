# DocuIntel AI — Document Intelligence Platform

Enterprise RAG platform for extracting structured data from contracts,
invoices, and technical documentation, then querying them in natural
language with grounded citations.

## Architecture

```
frontend/   React + TypeScript + Vite, talks to the backend via /api
backend/    FastAPI + Pydantic + SQLAlchemy + pgvector, Gemini for
            embeddings/LLM synthesis with an offline heuristic fallback
```

See `frontend/src/components/ArchitectureView.tsx` for the full diagram
rendered in-app.

## Run everything with Docker

```bash
cp backend/.env.example backend/.env   # add GEMINI_API_KEY to enable real embeddings/LLM
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api (docs at /docs)
- Postgres+pgvector: localhost:5432

On first boot the backend runs Alembic migrations and seeds 6 demo
documents (contracts, invoices, a technical spec) so the RAG assistant
has something to query immediately.

Without a `GEMINI_API_KEY`, the backend still fully works: it falls
back to a deterministic local embedding and a heuristic
regex-based extraction/answer engine, so upload → chunk → embed →
retrieve → cite all function offline. Set the key to get real Gemini
embeddings and LLM-synthesized answers.

## Run locally without Docker

Backend:
```bash
cd backend
python -m venv .venv && .venv/Scripts/activate   # or source .venv/bin/activate
pip install -r requirements.txt
# point DATABASE_URL at a local Postgres with the pgvector extension
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev   # proxies /api to http://localhost:8000
```

## Tests

```bash
cd backend && pytest
cd frontend && npm run lint   # tsc --noEmit
```
