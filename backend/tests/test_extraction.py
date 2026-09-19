from app.services.extraction import _heuristic_extract


def test_heuristic_extract_finds_amount_and_currency():
    text = "Total Amount: 74,500 MAD. Payment due Net 30 days upon delivery."

    result = _heuristic_extract("Invoice_INV-2024-8891.pdf", "invoice", text)

    assert result["total_amount"] == 74500
    assert result["currency"] == "MAD"
    assert "Net 30 days" in result["payment_terms"]


def test_heuristic_extract_falls_back_gracefully_on_empty_text():
    result = _heuristic_extract("Empty_Doc.txt", "technical_doc", "")

    assert result["total_amount"] is None
    assert result["confidence_score"] < 0.5
    assert result["title"] == "Empty Doc"
