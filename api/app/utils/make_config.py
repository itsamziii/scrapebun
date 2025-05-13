from typing import Dict, Any
from crawl4ai import BrowserConfig, CrawlerRunConfig, CacheMode

base_browser_config = BrowserConfig(
    headless=True,
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    # proxy=""
    # proxy_config=""
)

base_crawler_config = CrawlerRunConfig(
    word_count_threshold=100,
    excluded_tags=["script", "style", "header", "footer", "nav", "meta"],
    remove_forms=True,
    remove_overlay_elements=True,
    cache_mode=CacheMode.BYPASS,
    check_robots_txt=True,
    simulate_user=True,
    wait_until="networkidle",
)
