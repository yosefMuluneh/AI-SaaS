from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.config import settings

import app.models

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Welcome to AI-SaaS Competitor Intelligence Engine API"}
