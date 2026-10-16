from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.crud import crud_keyword
from app.schemas.keyword import KeywordCreate, KeywordResponse

router = APIRouter(prefix="/keywords", tags=["Keywords"])


@router.post("/", response_model=KeywordResponse, status_code=status.HTTP_201_CREATED)
async def create_keyword(keyword_in: KeywordCreate, db: AsyncSession = Depends(get_db)):
    return await crud_keyword.create_keyword(db=db, obj_in=keyword_in)


@router.get("/workspace/{workspace_id}", response_model=list[KeywordResponse])
async def read_keywords_by_workspace(
    workspace_id: int, db: AsyncSession = Depends(get_db)
):
    return await crud_keyword.get_keywords_by_workspace(
        db=db, workspace_id=workspace_id
    )
