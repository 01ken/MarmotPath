from fastapi import APIRouter, HTTPException
from app.services.quantum_wrapper import quantum_service
from app.schemas.optimization import (
    OptimizationRequest,
    OptimizationResponse,
    StageInfo
)

router = APIRouter()


@router.post("/optimize", response_model=OptimizationResponse)
async def optimize_learning_path(request: OptimizationRequest):
    """
    職業に基づいて最適な学習パスを取得
    """
    try:
        # 量子アニーリングで最適化
        result = quantum_service.optimize_for_career(
            career_name=request.career_name,
            num_reads=request.num_reads
        )

        # レスポンス形式に変換
        stages = []
        total_courses = 0

        for stage_name, course_ids in result.items():
            stage_num = int(stage_name.replace("stage", ""))
            stages.append(StageInfo(
                stage_number=stage_num,
                course_ids=course_ids
            ))
            total_courses += len(course_ids)

        # ステージ番号でソート
        stages.sort(key=lambda x: x.stage_number)

        return OptimizationResponse(
            career_name=request.career_name,
            stages=stages,
            total_courses=total_courses
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
