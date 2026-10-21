@echo off
echo ===================================================
echo   Starting AI SaaS Services (Docker, API, Celery)
echo ===================================================

:: 1. Ensure Docker Compose services (PostgreSQL & Redis) are running
echo.
echo [1/3] Ensuring PostgreSQL and Redis Docker containers are active...
docker-compose up -d

:: 2. Launch Celery Worker in a separate terminal window
echo.
echo [2/3] Launching Celery background worker in new window...
start "Celery Worker" cmd /k "cd backend && venv\Scripts\activate && celery -A app.worker.celery_app worker --loglevel=info -P solo"

:: 3. Launch FastAPI Uvicorn Server in current window
echo.
echo [3/3] Starting FastAPI Uvicorn application on http://localhost:8000...
cd backend
call venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

pause
