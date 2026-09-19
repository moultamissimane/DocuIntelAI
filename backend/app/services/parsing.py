import io

import docx
import fitz


def extract_pages(filename: str, content: bytes) -> tuple[list[str], str]:
    """Returns (text per page, detected file format)."""
    lower = filename.lower()

    if lower.endswith(".pdf"):
        pdf = fitz.open(stream=content, filetype="pdf")
        pages = [page.get_text().strip() for page in pdf]
        return (pages or [""]), "pdf"

    if lower.endswith(".docx"):
        document = docx.Document(io.BytesIO(content))
        text = "\n".join(p.text for p in document.paragraphs)
        return [text], "docx"

    text = content.decode("utf-8", errors="ignore")
    return [text], "txt"
