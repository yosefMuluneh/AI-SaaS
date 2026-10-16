from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.keyword import Keyword
from app.schemas.keyword import KeywordCreate


async def get_keywords_by_workspace(
    db: AsyncSession, workspace_id: int
) -> list[Keyword]:
    result = await db.execute(
        select(Keyword).where(Keyword.workspace_id == workspace_id)
    )
    return list(result.scalars().all())


async def create_keyword(db: AsyncSession, obj_in: KeywordCreate) -> Keyword:
    db_obj = Keyword(
        keyword=obj_in.keyword,
        target_url=obj_in.target_url,
        search_volume=obj_in.search_volume,
        status=obj_in.status,
        workspace_id=obj_in.workspace_id,
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
