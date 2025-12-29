from fastapi import APIRouter
from app.services.data_loader import data_loader
from app.schemas.skill import Skill, SkillListResponse

router = APIRouter()


@router.get("/skills", response_model=SkillListResponse)
async def get_skills():
    """全スキルの一覧を取得"""
    data = data_loader.load_skills()
    skills = []

    for skill_id, info in data["skills_master"].items():
        skills.append(Skill(
            id=info["id"],
            skill_id=skill_id,
            name=info["name"],
            category=info["category"]
        ))

    # IDでソート
    skills.sort(key=lambda x: x.id)

    return SkillListResponse(skills=skills)

