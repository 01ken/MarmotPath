import type { Course } from '../types';

/**
 * トポロジカルソートで依存関係の階層を計算
 */
export function analyzeDependencies(
  courses: Course[],
  recommendedCourseIds: string[]
): Map<string, number> {
  // 推奨講座のみをフィルタリング
  const relevantCourses = courses.filter((c) =>
    recommendedCourseIds.includes(c.course_id)
  );

  // Course IDからCourseオブジェクトへのマップ
  const courseMap = new Map<string, Course>();
  relevantCourses.forEach((course) => {
    courseMap.set(course.course_id, course);
  });

  // スキルを提供する講座のマップ（スキルID -> 講座ID[]）
  const skillProviders = new Map<string, string[]>();
  relevantCourses.forEach((course) => {
    course.skills_acquired.forEach((skill) => {
      if (!skillProviders.has(skill)) {
        skillProviders.set(skill, []);
      }
      skillProviders.get(skill)!.push(course.course_id);
    });
  });

  // 各講座の依存する講座を計算
  const dependencies = new Map<string, Set<string>>();
  relevantCourses.forEach((course) => {
    dependencies.set(course.course_id, new Set());

    course.prerequisites.forEach((requiredSkill) => {
      const providers = skillProviders.get(requiredSkill) || [];
      providers.forEach((providerId) => {
        if (providerId !== course.course_id) {
          dependencies.get(course.course_id)!.add(providerId);
        }
      });
    });
  });

  // トポロジカルソートで階層を決定
  const layers = new Map<string, number>();
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(courseId: string): number {
    if (visited.has(courseId)) {
      return layers.get(courseId)!;
    }

    if (visiting.has(courseId)) {
      // 循環依存がある場合は0を返す
      console.warn(`Circular dependency detected for ${courseId}`);
      return 0;
    }

    visiting.add(courseId);

    const deps = dependencies.get(courseId) || new Set();
    let maxDependencyLayer = -1;

    deps.forEach((depId) => {
      const depLayer = visit(depId);
      maxDependencyLayer = Math.max(maxDependencyLayer, depLayer);
    });

    const layer = maxDependencyLayer + 1;
    layers.set(courseId, layer);
    visiting.delete(courseId);
    visited.add(courseId);

    return layer;
  }

  // 全ての講座を訪問
  relevantCourses.forEach((course) => {
    visit(course.course_id);
  });

  return layers;
}
