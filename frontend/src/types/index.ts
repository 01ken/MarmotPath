export interface Career {
  id: number;
  name: string;
  description: string;
  required_skills: string[];
}

export interface StageInfo {
  stage_number: number;
  course_ids: string[];
}

export interface OptimizationResult {
  career_name: string;
  stages: StageInfo[];
  total_courses: number;
}
