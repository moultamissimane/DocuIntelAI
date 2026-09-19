def chunk_pages(pages: list[str], chunk_size: int = 400, overlap: int = 50) -> list[dict]:
    """Recursive-style word-window chunking, tracking the source page per chunk."""
    chunks: list[dict] = []
    idx = 1

    for page_num, page_text in enumerate(pages, start=1):
        words = page_text.split()
        if not words:
            continue

        start = 0
        while start < len(words):
            end = min(start + chunk_size, len(words))
            chunks.append(
                {
                    "chunk_index": idx,
                    "page": page_num,
                    "content": " ".join(words[start:end]),
                    "token_count": end - start,
                }
            )
            idx += 1
            if end == len(words):
                break
            start = end - overlap

    if not chunks:
        chunks.append({"chunk_index": 1, "page": 1, "content": "", "token_count": 0})

    return chunks
