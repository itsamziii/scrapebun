import os
from supabase import create_async_client, AsyncClient


async def create_supabase_client() -> AsyncClient:
    return await create_async_client(
        supabase_key=os.getenv("SUPABASE_KEY"),
        supabase_url=os.getenv("SUPABASE_URL"),
    )
