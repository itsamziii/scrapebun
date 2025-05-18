from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from dataclasses import dataclass

from mcp.server.fastmcp import FastMCP, Context
from supabase import AsyncClient
from openai import AsyncOpenAI

from server.logger import logger
from server.supabase import create_supabase_client


@dataclass
class FastMCPContext:
    supabase: AsyncClient
    openai: AsyncOpenAI


@asynccontextmanager
async def lifespan(app: FastMCP) -> AsyncIterator[FastMCPContext]:
    logger.info("Starting server...")
    supabase_client = await create_supabase_client()
    openai_client = AsyncOpenAI()
    try:
        yield FastMCPContext(supabase=supabase_client, openai=openai_client)
    finally:
        logger.info("Shutting down server...")


mcp = FastMCP(
    name="mcp",
    description="MCP Server for Supabase",
    lifespan=lifespan,
)


@mcp.tool(
    name="get_relevant_docs",
    description="Retrieve relevant documentation chunks based on the query using RAG.",
)
async def get_relevant_docs(ctx: Context, task_id: str, query: str) -> str:
    """
    Retrieve relevant documentation chunks based on the query using RAG.

    Args:
        ctx: The tool context, containing request_context and lifespan_context.
        task_id: The ID of the task to retrieve documentation for.
        query: The user's input question or search string.

    Returns:
        A formatted string of the most relevant documentation chunks.
    """
    if not task_id:
        raise ValueError("Task ID is required")

    try:
        logger.info(f"Getting relevant docs for task {task_id} with query {query}")
        openai_client = ctx.request_context.lifespan_context.openai
        supabase_client = ctx.request_context.lifespan_context.supabase

        # Get query embedding from OpenAI
        embedding_response = await openai_client.embeddings.create(
            input=query,
            model="text-embedding-3-small",
        )
        embedding = embedding_response.data[0].embedding

        logger.info("Generated embedding for query")

        # Query Supabase using the embedding and task ID
        result = await supabase_client.rpc(
            "match_multiple_scrape_results",
            {
                "query_embedding": str(embedding),
                "input_task_id": task_id,
            },
        ).execute()

        if not result.data:
            return "No relevant documentation chunks found"

        # Format results
        formatted = "\n\n---\n\n".join(
            f"**{row['title']}**\n{row['text']}\nSource: {row['url']}"
            for row in result.data
        )

        logger.info(f"Found {len(result.data)} relevant documentation chunks.")

        return formatted

    except Exception as e:
        logger.exception("Failed to get relevant documentation")
        return "Error getting relevant documentation from database"


def run_server() -> None:
    logger.info("Starting Supabase MCP server")
    mcp.run(transport="sse")
    logger.info("Supabase MCP server has exited")
