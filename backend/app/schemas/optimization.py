from pydantic import BaseModel
from typing import List, Dict

class OptimizationRequest(BaseModel):
    career_name: str
    num_reads: int = 10

class StageInfo(BaseModel):
    stage_number: int
    course_ids: List[str]

class OptimizationResponse(BaseModel):
    career_name: str
    stages: List[StageInfo]
    total_courses: int
