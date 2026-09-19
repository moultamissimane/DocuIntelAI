from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.query import QueryRequest, RagQueryResponse
from app.services.rag import run_query

router = APIRouter()


@router.post("/query", response_model=RagQueryResponse)
def query(payload: QueryRequest, db: Session = Depends(get_db)):
    result = run_query(db, payload.question, payload.selected_doc_id)
    return RagQueryResponse.model_validate(result)
