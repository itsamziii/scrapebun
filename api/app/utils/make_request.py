import time
import requests
import httpx
from datetime import timedelta
from flask import current_app
from typing import Dict, Any, Optional, List, Tuple

from .logger import get_logger

logger = get_logger(__name__)


async def make_request(
    endpoint: str, payload: Dict[str, Any]
) -> Optional[Tuple[List[Dict[str, Any]], timedelta]]:
    start_time = time.perf_counter()
    end_time = start_time

    try:
        async with httpx.AsyncClient(
            base_url=current_app.config["CRAWL4AI_BASE_URL"],
            timeout=120,
        ) as client:
            logger.info(f"Making request to {endpoint} with payload: {payload}")

            start_time = time.perf_counter()
            response = await client.post(endpoint, json=payload)
            end_time = time.perf_counter()

            request_time = timedelta(seconds=end_time - start_time)
            logger.info(f"Request to {endpoint} completed in {request_time}")

            # First raise_for_status to catch HTTP errors before trying to parse JSON
            response.raise_for_status()

            try:
                response_data = response.json()
            except Exception as e:
                logger.error(f"Failed to parse JSON response: {e}")
                logger.debug(
                    f"Response content: {response.text[:500]}..."
                )
                return None, request_time

            log_data = response_data.copy() if isinstance(response_data, dict) else {}
            if isinstance(log_data, dict) and "results" in log_data:
                result_count = (
                    len(log_data["results"])
                    if isinstance(log_data["results"], list)
                    else "not a list"
                )
                log_data["results"] = f"[{result_count} items]"
            logger.info(f"Response data: {log_data}")

            if response_data.get("success", False):
                return response_data.get("results", []), request_time
            else:
                logger.error(
                    f"Request to {endpoint} failed with message: {response_data.get('message', 'No error message provided')}"
                )
                return None, request_time

    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error occurred: {e} - Status {e.response.status_code}")
        return None, timedelta(seconds=end_time - start_time)

    except httpx.RequestError as e:
        logger.error(f"Request error occurred: {e}")
        return None, timedelta(seconds=end_time - start_time)

    except Exception as e:
        logger.error(f"Unexpected error in make_request: {e}")
        return None, timedelta(seconds=end_time - start_time)
