from datetime import datetime
from pydantic import BaseModel, ConfigDict


class KeywordBase(BaseModel):
    keyword: str
    target_url: str | None = None
    search_volume: int | None = None
    status: str | None = "active"


class KeywordCreate(KeywordBase):
    workspace_id: int


class KeywordResponse(KeywordBase):
    id: int
    workspace_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
