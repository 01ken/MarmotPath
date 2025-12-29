from pydantic import BaseModel
from typing import List

class Skill(BaseModel):
    id: int
    skill_id: str
    name: str
    category: str

class SkillListResponse(BaseModel):
    skills: List[Skill]
