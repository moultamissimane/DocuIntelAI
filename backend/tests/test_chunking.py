from app.services.chunking import chunk_pages


def test_chunk_pages_splits_long_page_with_overlap():
    words = [f"word{i}" for i in range(900)]
    page_text = " ".join(words)

    chunks = chunk_pages([page_text], chunk_size=400, overlap=50)

    assert len(chunks) == 3
    assert chunks[0]["page"] == 1
    assert chunks[0]["token_count"] == 400
    assert chunks[1]["content"].split()[0] == "word350"


def test_chunk_pages_tracks_page_numbers():
    chunks = chunk_pages(["short page one", "short page two"], chunk_size=400, overlap=50)

    assert [c["page"] for c in chunks] == [1, 2]


def test_chunk_pages_handles_empty_input():
    chunks = chunk_pages([""])

    assert chunks == [{"chunk_index": 1, "page": 1, "content": "", "token_count": 0}]
