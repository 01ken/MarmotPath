from fastapi import APIRouter, HTTPException
from app.services.quantum_wrapper import quantum_service
from app.schemas.optimization import (
    OptimizationRequest,
    OptimizationResponse,
)

router = APIRouter()


@router.post("/optimize", response_model=OptimizationResponse)
async def optimize_learning_path(request: OptimizationRequest):
    """
    職業に基づいて最適な学習パスを取得（フラットなリスト）
    """
    try:
        # 量子アニーリングで最適化（フラット化されたリスト）
        course_ids = quantum_service.optimize_for_career(
            career_name=request.career_name,
            num_reads=request.num_reads
        )

        return OptimizationResponse(
            career_name=request.career_name,
            recommended_course_ids=course_ids,
            total_courses=len(course_ids)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
