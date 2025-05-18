from typing import List, Dict, Optional, Union
import requests
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
from xml.etree import ElementTree
from urllib.parse import urlparse, ParseResult


# Response models
class SitemapResponse(BaseModel):
    urls: List[str]


class ErrorResponse(BaseModel):
    error: str


domain_router = APIRouter(prefix="/domain", tags=["domain"])


@domain_router.get(
    "/sitemap/",
    response_model=Union[SitemapResponse, ErrorResponse],
)
async def get_sitemap(url: HttpUrl):
    try:
        parsed_url: ParseResult = urlparse(str(url))

        scheme: str = parsed_url.scheme
        netloc: str = parsed_url.netloc
        path: str = parsed_url.path

        if path.endswith("/"):
            path = path[:-1]

        base_url: str = f"{scheme}://{netloc}{path}"

        sitemap_url: str = f"{base_url}/sitemap.xml"

        response: requests.Response = requests.get(sitemap_url, timeout=10)

        if response.status_code != 200:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"error": f"Sitemap not found at {sitemap_url}"},
            )

        root: ElementTree.Element = ElementTree.fromstring(response.content)
        ns: Dict[str, str] = {"ns": root.tag.split("}")[0].strip("{")}

        urls: List[Optional[str]] = [loc.text for loc in root.findall(".//ns:loc", ns)]

        valid_urls: List[str] = [
            url_item
            for url_item in urls
            if url_item is not None and "sitemap" not in str(url_item).lower()
        ]

        return {"urls": valid_urls[:2]}

    except ElementTree.ParseError as e:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"error": f"Invalid XML sitemap format: {str(e)}"},
        )
    except requests.RequestException as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"error": f"Error fetching sitemap: {str(e)}"},
        )
    except Exception as e:
        print(f"Unexpected error fetching sitemap: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"error": str(e)}
        )
