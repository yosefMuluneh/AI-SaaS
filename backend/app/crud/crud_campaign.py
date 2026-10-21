from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.campaign import GeneratedCampaign


async def get_campaigns_by_keyword(
    db: AsyncSession, keyword_id: int
) -> list[GeneratedCampaign]:
    result = await db.execute(
        select(GeneratedCampaign).where(GeneratedCampaign.keyword_id == keyword_id)
    )
    return list(result.scalars().all())
