import os
import json
from typing import Dict, Any, List, Literal
from fastapi import APIRouter
from pydantic import BaseModel, Field
from crawl4ai import (
    Crawl4aiDockerClient,
    BrowserConfig,
    CrawlerRunConfig,
    CacheMode,
    CrawlResult,
    LLMExtractionStrategy,
    LLMConfig,
)

from .utils import json_to_csv, process_domain_results, ProcessedChunk

crawl_router = APIRouter(prefix="/crawl", tags=["crawl"])

browser_config = BrowserConfig(
    headless=True,
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
)


class CrawlRequest(BaseModel):
    task_id: str
    url: str
    instruction: str
    data_schema: Dict[str, Any]
    output_type: Literal["json", "csv"] = "json"
    screenshot: bool = False


class CrawlResponse(BaseModel):
    message: str
    task_id: str
    response: List[Dict[str, Any]] | None = None


@crawl_router.post("/", response_model=CrawlResponse)
async def crawl(payload: CrawlRequest) -> CrawlResponse:
    req = payload.model_dump()

    async with Crawl4aiDockerClient(
        base_url="http://crawl4ai:11235",
        verbose=True,
        timeout=600,
        verify_ssl=False,
    ) as client:
        # For some reason, this is required to be called
        await client.authenticate("hello@example.com")

        results: CrawlResult = await client.crawl(
            [req["url"]],
            browser_config=browser_config,
            crawler_config=CrawlerRunConfig(
                cache_mode=CacheMode.BYPASS,
                only_text=True,
                remove_forms=True,
                simulate_user=True,
                screenshot=req["screenshot"],
                check_robots_txt=True,
                extraction_strategy=LLMExtractionStrategy(
                    llm_config=LLMConfig(
                        api_token=os.getenv("OPENAI_API_KEY"),
                    ),
                    schema=req["data_schema"],
                    instruction=req["instruction"],
                ),
                scan_full_page=True,
                scroll_delay=1,
                remove_overlay_elements=True,
                magic=True,
            ),
        )

        if not results.success:
            return CrawlResponse(
                message="Crawl request failed",
                task_id=req["task_id"],
                response=results.error_message,
            )

        output = json.loads(results.extracted_content)

        if payload.output_type == "json":
            return CrawlResponse(
                message="Crawl request received",
                task_id=req["task_id"],
                response=output,
            )

        if payload.output_type == "csv":
            return CrawlResponse(
                message="Crawl request received",
                task_id=req["task_id"],
                response=json_to_csv(output),
            )

        return CrawlResponse(
            message="Crawl request received",
            task_id=req["task_id"],
            response=output,
        )


class DomainCrawlerRequest(BaseModel):
    task_id: str
    urls: List[str]


class DomainCrawlerResponse(BaseModel):
    task_id: str
    success: bool
    output: List[List[ProcessedChunk]] = Field(default_factory=list)


@crawl_router.post("/domain", response_model=DomainCrawlerResponse)
async def crawl_domain(payload: DomainCrawlerRequest):
    req = payload.model_dump()

    async with Crawl4aiDockerClient(
        base_url="http://crawl4ai:11235", verbose=True, timeout=600
    ) as client:
        # For some reason, this is required to be called
        await client.authenticate("hello@example.com")

        results: List[CrawlResult] | CrawlResult = await client.crawl(
            req["urls"],
            browser_config=browser_config,
            crawler_config=CrawlerRunConfig(
                only_text=True,
                remove_forms=True,
                simulate_user=True,
                check_robots_txt=True,
                magic=True,
            ),
        )

        if type(results) == CrawlResult:
            results = [results]

        output: List[List[ProcessedChunk]] = await process_domain_results(results)

        return DomainCrawlerResponse(
            task_id=req["task_id"],
            success=True,
            output=output,
        )
