from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.crud import crud_campaign
from app.schemas.campaign import CampaignResponse

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


@router.get("/keyword/{keyword_id}", response_model=list[CampaignResponse])
async def read_campaigns_by_keyword(
    keyword_id: int, db: AsyncSession = Depends(get_db)
):
    return await crud_campaign.get_campaigns_by_keyword(db=db, keyword_id=keyword_id)
