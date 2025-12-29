from fastapi import APIRouter
from app.services.data_loader import data_loader
from app.schemas.career import Career, CareerListResponse

router = APIRouter()


@router.get("/careers", response_model=CareerListResponse)
async def get_careers():
    """全職業の一覧を取得"""
    data = data_loader.load_careers()
    careers = []

    for name, info in data["career_goals"].items():
        careers.append(Career(
            id=info["id"],
            name=name,
            description=info["description"],
            required_skills=info["required_skills"]
        ))

    # IDでソート
    careers.sort(key=lambda x: x.id)

    return CareerListResponse(careers=careers)
