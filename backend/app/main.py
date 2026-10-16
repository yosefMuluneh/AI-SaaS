from fastapi import FastAPI

app = FastAPI(
    title="AI-SaaS Competitor Intelligence API",
    version="1.0.0",
    description="Backend API powering multi-tenant competitor research and agentic content generation."
)

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "FastAPI Backend is running"}