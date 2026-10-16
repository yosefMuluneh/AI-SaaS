from fastapi import APIRouter
from app.api.v1.endpoints import keywords, workspaces

api_router = APIRouter()
api_router.include_router(workspaces.router)
api_router.include_router(keywords.router)
