from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class HealthResponse(BaseModel):
    status: str = Field(..., description="Health status of the API")
    timestamp: datetime = Field(
        default_factory=datetime.utcnow, description="Current UTC timestamp"
    )


class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    code: int = Field(..., description="Error code")
    details: Optional[Dict[str, Any]] = Field(
        None, description="Additional error details"
    )
