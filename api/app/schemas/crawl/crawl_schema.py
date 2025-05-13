from pydantic import BaseModel, Field


class CrawlRequest(BaseModel):
    url: str
    instructions: str
    schema: str
    provider: str
    api_key: str
    screenshot: bool


class CrawlResponse(BaseModel):
    output: str = Field(..., description="The data of returned data")
