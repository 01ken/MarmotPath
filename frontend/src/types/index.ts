export interface Career {
  id: number;
  name: string;
  description: string;
  required_skills: string[];
}

export interface Course {
  id: number;
  course_id: string;
  name: string;
  description: string;
  prerequisites: string[];
  skills_acquired: string[];
  estimated_hours: number;
}

export interface CourseDetail extends Course {
  recommended_combinations: string[];
}

export interface Skill {
  id: number;
  skill_id: string;
  name: string;
  category: string;
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

// ReactFlow用の型
export interface CourseNodeData {
  course: Course;
  stageNumber: number;
  isCompleted: boolean;
  isRecommended: boolean;
}

