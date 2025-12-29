from pydantic import BaseModel
from typing import List

class Career(BaseModel):
    id: int
    name: str
    description: str
    required_skills: List[str]

class CareerListResponse(BaseModel):
    careers: List[Career]