import asyncio
from dotenv import load_dotenv
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerHTTP

load_dotenv()

TASK_ID = "bf5c3144-63d2-42d8-860a-d6256bb6e279"

server = MCPServerHTTP(url="http://localhost:8000/sse")
agent = Agent(
    "openai:gpt-4o",
    mcp_servers=[server],
    system_prompt="""
You are a helpful assistant that can answer questions about the user's task.
The task_id is 8a61bc88-20ce-44d0-84b5-908b05be9328.
""",
)


async def main():
    async with agent.run_mcp_servers():
        result = await agent.run("How can I implement the a2a using pydantic_ai?")
        print(result.output)


if __name__ == "__main__":
    asyncio.run(main())
