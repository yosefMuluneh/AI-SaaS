from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.crud import crud_keyword
from app.schemas.keyword import KeywordCreate, KeywordResponse
from app.tasks.intelligence import run_competitor_analysis

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


@router.post("/{keyword_id}/analyze", status_code=status.HTTP_202_ACCEPTED)
async def trigger_keyword_analysis(keyword_id: int, db: AsyncSession = Depends(get_db)):
    """
    Triggers an asynchronous background task (Celery worker) to scrape
    competitor intelligence and generate AI content campaigns.
    """
    keywords = await crud_keyword.get_keyword(db=db, keyword_id=keyword_id)
    # dispatch the background task to Celery/Redis
    task = run_competitor_analysis.delay(
        keyword_id=keyword_id,
        keyword_text=keywords.keyword,
        target_url=keywords.target_url,
    )

    return {
        "message": f"Competitor analysis for keyword ID {keyword_id} has been queued.",
        "task_id": task.id,
        "status": "pending",
    }
