from crawl4ai import BrowserConfig, CrawlerRunConfig, CacheMode


class Config:
    SECRET_KEY = "dev"
    DEBUG = True
    CORS_ORIGINS = ["*"]

    CRAWL4AI_BASE_URL = "http://localhost:11235/"

    BASE_BROWSER_CONFIG = BrowserConfig(
        headless=True,
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        # proxy=""
        # proxy_config=""
    )
    BASE_CRAWLER_RUN_CONFIG = CrawlerRunConfig(
        word_count_threshold=100,
        excluded_tags=["script", "style", "header", "footer", "nav", "meta"],
        remove_forms=True,
        remove_overlay_elements=True,
        cache_mode=CacheMode.BYPASS,
        check_robots_txt=True,
        simulate_user=True,
        wait_until="networkidle",
    )
