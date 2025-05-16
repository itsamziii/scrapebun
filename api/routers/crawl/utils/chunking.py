import asyncio
import urllib.parse
from typing import List
from openai import AsyncOpenAI

openai_client = AsyncOpenAI()


def chunk_text(markdown: str, size: int = 5_000) -> List[str]:
    chunks = []
    start = 0
    text_length = len(markdown)

    while start < text_length:
        end = start + size

        # If we're at the end of the text, just take what's left
        if end >= text_length:
            chunks.append(markdown[start:].strip())
            break

        # Try to find a code block boundary first (```)
        chunk = markdown[start:end]
        code_block = chunk.rfind("```")
        if code_block != -1 and code_block > size * 0.3:
            end = start + code_block  # If no code block, try to break at a paragraph
        elif "\n\n" in chunk:
            last_break = chunk.rfind("\n\n")
            if last_break > size * 0.3:  # Only break if we're past 30% of size
                end = (
                    start + last_break
                )  # If no paragraph break, try to break at a sentence
        elif ". " in chunk:
            last_period = chunk.rfind(". ")
            if last_period > size * 0.3:  # Only break if we're past 30% of size
                end = start + last_period + 1  # Extract chunk and clean it up
        chunk = markdown[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = max(start + 1, end)

    return chunks


async def get_embeddings(text: str) -> List[float]:
    try:

        response = await openai_client.embeddings.create(
            model="text-embedding-3-small", input=text
        )

        return response.data[0].embedding
    except Exception as e:
        print(f"Error getting embedding: {e}")
        return [0] * 1536


async def process_and_save_markdown(markdown: str, url: str):
    chunks = chunk_text(markdown)

    real_url = urllib.parse.urlparse(url)
    title = real_url.path.replace("/", "_")

    tasks = [
        {
            "embedding": get_embeddings(chunk),
            "text": chunk,
            "chunk_number": idx,
            "title": title,
            "url": real_url.geturl(),
        }
        for idx, chunk in enumerate(chunks)
    ]

    processed_tasks = await asyncio.gather(*tasks)

    return processed_tasks
