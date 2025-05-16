import os
from typing import Dict, Any, List
from fastapi import APIRouter
from pydantic import BaseModel
from crawl4ai import (
    Crawl4aiDockerClient,
    BrowserConfig,
    CrawlerRunConfig,
    CacheMode,
    CrawlResult,
    LLMExtractionStrategy,
    LLMConfig,
)

crawl_router = APIRouter(prefix="/crawl", tags=["crawl"])

browser_config = BrowserConfig(
    headless=True,
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
)


class CrawlRequest(BaseModel):
    url: str
    instruction: str
    data_schema: Dict[str, Any]
    screenshot: bool = False


class CrawlResponse(BaseModel):
    message: str
    response: Dict[str, Any] | None = None


@crawl_router.post("/", response_model=CrawlResponse)
async def crawl(payload: CrawlRequest) -> CrawlResponse:
    req = payload.model_dump()

    async with Crawl4aiDockerClient(
        base_url="http://localhost:11235", verbose=True, timeout=600
    ) as client:
        # For some reason, this is required to be called
        await client.authenticate("hello@example.com")

        results: CrawlRequest = await client.crawl(
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
                    schema=req["schema"],
                    instruction=req["instruction"],
                ),
                scan_full_page=True,
                scroll_delay=1,
                remove_overlay_elements=True,
                magic=True,
            ),
        )

        # "fit_html" is a property that is not serializable
        results.fit_html = None

        output = results.extracted_content

        if results and results.success:
            return CrawlResponse(
                message="Crawl request received",
                response=results.model_dump(),
            )
        else:
            return CrawlResponse(
                message="Crawl request failed",
            )


class DomainCrawlerRequest(BaseModel):
    urls: List[str]


@crawl_router.post("/domain")
async def crawl_domain(payload: DomainCrawlerRequest):
    req = payload.model_dump()

    async with Crawl4aiDockerClient(
        base_url="http://localhost:11235", verbose=True, timeout=600
    ) as client:
        # For some reason, this is required to be called
        await client.authenticate("hello@example.com")

        results: List[CrawlResult] = await client.crawl(
            req["urls"],
            browser_config=browser_config,
            crawler_config=CrawlerRunConfig(
                only_text=True,
                remove_forms=True,
                simulate_user=True,
                check_robots_txt=True,
            ),
        )

        for res in results:
            res.fit_html = None

        return {"success": "hello!"}
