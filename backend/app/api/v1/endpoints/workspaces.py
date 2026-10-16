from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.crud import crud_workspace
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


@router.post("/", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    workspace_in: WorkspaceCreate, db: AsyncSession = Depends(get_db)
):
    return await crud_workspace.create_workspace(db=db, obj_in=workspace_in)


@router.get("/", response_model=list[WorkspaceResponse])
async def read_workspaces(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    return await crud_workspace.get_workspaces(db=db, skip=skip, limit=limit)


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def read_workspace(workspace_id: str, db: AsyncSession = Depends(get_db)):
    workspace = await crud_workspace.get_workspace(db=db, workspace_id=workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace
