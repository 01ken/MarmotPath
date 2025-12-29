from pydantic import BaseModel
from typing import List

class OptimizationRequest(BaseModel):
    career_name: str
    num_reads: int = 10

class OptimizationResponse(BaseModel):
    career_name: str
    recommended_course_ids: List[str]
    total_courses: int
