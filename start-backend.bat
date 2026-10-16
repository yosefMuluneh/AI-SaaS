@echo off
echo ========================================
echo Starting FastAPI Backend Server...
echo ========================================

cd /d "%~dp0backend"

if not exist "venv" (
    echo Virtual environment not found in backend folder!
    pause
    exit /b
)

call venv\Scripts\activate.bat
uvicorn app.main:app --reload --port 8000
pause