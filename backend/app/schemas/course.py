from pydantic import BaseModel
from typing import List

class Course(BaseModel):
    id: int
    course_id: str
    name: str
    description: str
    prerequisites: List[str]
    skills_acquired: List[str]
    estimated_hours: int

class CourseListResponse(BaseModel):
    courses: List[Course]

class CourseDetailResponse(Course):
    recommended_combinations: List[str] = []
