import asyncio
import urllib.parse
import logging
from typing import List, Dict
from openai import AsyncOpenAI
from crawl4ai import CrawlResult
from dataclasses import dataclass

# Initialize OpenAI client and logging
openai_client = AsyncOpenAI()
logging.basicConfig(level=logging.INFO)

EMBEDDING_DIMENSION = 1536


@dataclass
class ProcessedChunk:
    embedding: List[float]
    text: str
    chunk_number: int
    title: str
    url: str


def chunk_text(markdown: str, size: int = 5_000) -> List[str]:
    """
    Splits the input markdown into semantically meaningful chunks of approximately `size` characters.
    """
    chunks = []
    start = 0
    text_length = len(markdown)

    while start < text_length:
        end = start + size
        if end >= text_length:
            chunks.append(markdown[start:].strip())
            break

        chunk = markdown[start:end]
        code_block = chunk.rfind("```")
        if code_block != -1 and code_block > size * 0.3:
            end = start + code_block
        elif "\n\n" in chunk:
            last_break = chunk.rfind("\n\n")
            if last_break > size * 0.3:
                end = start + last_break
        elif ". " in chunk:
            last_period = chunk.rfind(". ")
            if last_period > size * 0.3:
                end = start + last_period + 1

        chunk = markdown[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = max(start + 1, end)

    return chunks


async def get_embeddings(text: str, retries: int = 3) -> List[float]:
    """
    Calls OpenAI's embedding API and returns the embedding for the given text.
    Retries on failure.
    """
    for attempt in range(1, retries + 1):
        try:
            response = await openai_client.embeddings.create(
                model="text-embedding-3-small", input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logging.warning(f"Attempt {attempt}: Error getting embedding - {e}")
            await asyncio.sleep(2**attempt)

    logging.error(f"Failed to get embedding after {retries} attempts.")
    return [0.0] * EMBEDDING_DIMENSION


async def process_and_save_markdown(markdown: str, url: str) -> List[ProcessedChunk]:
    """
    Chunks the markdown, generates embeddings, and returns metadata for each chunk.
    """
    chunks = chunk_text(markdown)
    real_url = urllib.parse.urlparse(url)
    title = real_url.path.strip("/").replace("/", "_") or real_url.netloc

    # Get embeddings concurrently
    embeddings = await asyncio.gather(*(get_embeddings(chunk) for chunk in chunks))

    processed_tasks = [
        ProcessedChunk(
            embedding=embedding,
            text=chunk,
            chunk_number=idx,
            title=title,
            url=real_url.geturl(),
        )
        for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings))
    ]

    return processed_tasks


async def process_domain_results(results: List[CrawlResult]) -> List[List[ProcessedChunk]]:
    """
    Processes a list of CrawlResult objects concurrently and returns structured data.
    """
    tasks = [
        process_and_save_markdown(res.markdown.raw_markdown, res.url) for res in results
    ]
    return await asyncio.gather(*tasks)
