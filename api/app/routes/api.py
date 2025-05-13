import asyncio
from flask import Blueprint, jsonify, current_app
from typing import Tuple
from flask_pydantic import validate
from crawl4ai import (
    LLMExtractionStrategy,
    LLMConfig,
    BrowserConfig,
    CrawlerRunConfig,
    CacheMode,
)

from app.schemas import HealthResponse, ErrorResponse, CrawlRequest, CrawlResponse
from app.utils import (
    generate_model,
    make_request,
)

bp = Blueprint("api", __name__, url_prefix="/api")

base_browser_config = BrowserConfig(
    headless=True,
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    # proxy=""
    # proxy_config=""
)

@bp.route("/health")
def health_check() -> Tuple[dict, int]:
    response = HealthResponse(status="healthy")
    return jsonify(response.model_dump()), 200


@bp.route("/crawl", methods=["POST"])
@validate()
def crawl(body: CrawlRequest) -> Tuple[dict, int]:
    schema = generate_model("schema", body.schema)

    # Set a long timeout for the route
    # Note: This only helps if you're using a WSGI server that respects these settings
    from flask import request
    request.environ.get('werkzeug.server.shutdown')

    try:
        # Explicitly set a longer timeout for the asyncio.run
        # Create a new event loop with custom timeout
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        task = loop.create_task(
            make_request(
                endpoint="/crawl",
                payload={
                    "browser_config": base_browser_config.dump(),
                    "crawler_config": CrawlerRunConfig(
                        word_count_threshold=100,
                        remove_forms=True,
                        cache_mode=CacheMode.BYPASS,
                        check_robots_txt=True,
                        only_text=True,
                        extraction_strategy=LLMExtractionStrategy(
                            llm_config=LLMConfig(
                                provider=body.provider,
                                api_token=body.api_key,
                            ),
                            instruction=body.instructions,
                            schema=body.schema,
                            extraction_type="schema",
                            chunk_token_threshold=500,
                        ),
                    ).dump(),
                    "urls": [body.url],
                },
            )
        )

        # Run with timeout of 5 minutes (300 seconds)
        result, duration = loop.run_until_complete(asyncio.wait_for(task, timeout=300))
        loop.close()

        if result is not None:
            return jsonify({"results": result, "duration_ms": int(duration.total_seconds() * 1000)}), 200
        else:
            return jsonify({"error": "Failed to get response from crawl service"}), 502
    except asyncio.TimeoutError:
        current_app.logger.error("Request timed out after 5 minutes")
        return jsonify({"error": "Request timed out. The operation took too long to complete."}), 504
    except Exception as e:
        current_app.logger.error(f"Crawl request failed: {str(e)}")
        return jsonify({"error": f"Request processing error: {str(e)}"}), 500


@bp.errorhandler(Exception)
def handle_error(error: Exception) -> Tuple[dict, int]:
    current_app.logger.error(error)
    response = ErrorResponse(
        error=str(error),
        code=getattr(error, "code", 500),
        details=getattr(error, "details", None),
    )
    return jsonify(response.model_dump()), getattr(error, "code", 500)
