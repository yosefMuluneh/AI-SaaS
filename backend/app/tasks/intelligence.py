import time

from app.core.database import SyncSessionLocal
from app.models.campaign import GeneratedCampaign
from app.models.keyword import Keyword
from app.worker import celery_app


@celery_app.task(name="tasks.run_competitor_analysis")
def run_competitor_analysis(
    keyword_id: int, keyword_text: str, target_url: str | None = None
):
    """
    Background task: Scrapes competitor data, synthesizes AI campaign,
    and persists the results into PostgreSQL.
    """
    print(
        f"[AI Agent] Starting analysis for keyword: '{keyword_text}' (ID: {keyword_id})"
    )

    # 1. Simulate scraping & AI synthesis
    time.sleep(3)

    campaign_title = f"Data-Driven Guide to {keyword_text}"
    generated_content = (
        f"# Content Strategy for {keyword_text}\n\n"
        f"Target URL Analyzed: {target_url or 'N/A'}\n\n"
        "## Key Competitor Insights\n"
        "- Competitor content gaps identified in technical depth.\n"
        "- High-intent keyword opportunity for conversion landing pages.\n\n"
        "## Recommended Content Outline\n"
        "1. Executive Summary\n"
        "2. Core Feature Comparison\n"
        "3. ROI Analysis & Pricing Models\n"
    )

    # 2. Persist to PostgreSQL via synchronous session
    db = SyncSessionLocal()
    try:
        # Fetch the keyword to get its workspace_id
        keyword_obj = db.get(Keyword, keyword_id)
        workspace_id = keyword_obj.workspace_id if keyword_obj else 1

        campaign = GeneratedCampaign(
            workspace_id=workspace_id,
            keyword_id=keyword_id,
            title=campaign_title,
            content=generated_content,
            status="completed",
        )
        db.add(campaign)
        db.commit()
        db.refresh(campaign)

        print(f"[AI Agent] Successfully saved Campaign ID {campaign.id} to database.")
        return {
            "status": "success",
            "campaign_id": campaign.id,
            "title": campaign.title,
        }
    except Exception as e:
        db.rollback()
        print(f"[AI Agent Error] Failed to persist campaign: {e}")
        raise
    finally:
        db.close()
