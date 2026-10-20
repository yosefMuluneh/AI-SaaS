import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.workspace import Workspace
from app.schemas.workspace import WorkspaceCreate


async def get_workspace(db: AsyncSession, workspace_id: int) -> Workspace | None:
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id))
    return result.scalars().first()


async def get_workspaces_by_user(
    db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100
) -> list[Workspace]:
    result = await db.execute(
        select(Workspace).where(Workspace.user_id == user_id).offset(skip).limit(limit)
    )
    return list(result.scalars().all())


async def create_workspace(
    db: AsyncSession, obj_in: WorkspaceCreate, user_id: int
) -> Workspace:
    base_slug = obj_in.name.lower().replace(" ", "-")
    slug = base_slug

    # Check for collision and make slug unique if needed
    existing = await db.execute(select(Workspace).where(Workspace.slug == slug))
    if existing.scalars().first():
        slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

    db_obj = Workspace(name=obj_in.name, slug=slug, user_id=user_id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
