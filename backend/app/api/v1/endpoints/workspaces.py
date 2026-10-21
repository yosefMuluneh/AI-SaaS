from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.crud import crud_workspace
from app.models.user import User
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


@router.get("/", response_model=list[WorkspaceResponse])
async def read_workspaces(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return await crud_workspace.get_workspaces_by_user(db=db, user_id=current_user.id)


@router.post("/", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    workspace_in: WorkspaceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await crud_workspace.create_workspace(
        db=db, obj_in=workspace_in, user_id=current_user.id
    )
