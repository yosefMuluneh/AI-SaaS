from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CampaignResponse(BaseModel):
    id: int
    keyword_id: int
    title: str
    content: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
