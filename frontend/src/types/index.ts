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
  estimated_hours: int;
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

export interface OptimizationResult {
  career_name: string;
  recommended_course_ids: string[];
  total_courses: number;
}

// ReactFlow用の型
export interface CourseNodeData {
  course: Course;
  layer: number; // ステージではなく依存関係の階層
  isCompleted: boolean;
  isRecommended: boolean;
}

