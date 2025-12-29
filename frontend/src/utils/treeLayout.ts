import type { Course } from '../types';
import type { Node, Edge } from 'reactflow';
import type { CourseNodeData } from '../types';
import { analyzeDependencies } from './dependencyAnalyzer';

/**
 * スキルツリーのノードとエッジを生成（依存関係ベース）
 */
export function buildSkillTree(
  courses: Course[],
  recommendedCourseIds: string[],
  completedCourses: string[]
): { nodes: Node<CourseNodeData>[]; edges: Edge[] } {
  // 依存関係を解析して階層を取得
  const layers = analyzeDependencies(courses, recommendedCourseIds);

  // Course IDからCourseオブジェクトへのマップ
  const courseMap = new Map<string, Course>();
  courses.forEach((course) => {
    courseMap.set(course.course_id, course);
  });

  // 階層ごとに講座をグループ化
  const layerGroups = new Map<number, string[]>();
  layers.forEach((layer, courseId) => {
    if (!layerGroups.has(layer)) {
      layerGroups.set(layer, []);
    }
    layerGroups.get(layer)!.push(courseId);
  });

  // レイアウト設定
  const LAYER_HEIGHT = 220;
  const NODE_WIDTH = 280;
  const HORIZONTAL_SPACING = 60;

  const nodes: Node<CourseNodeData>[] = [];

  // 各階層でノードを配置
  layerGroups.forEach((courseIds, layer) => {
    const y = layer * LAYER_HEIGHT;
    const coursesInLayer = courseIds.length;
    const totalWidth = coursesInLayer * NODE_WIDTH + (coursesInLayer - 1) * HORIZONTAL_SPACING;
    const startX = -totalWidth / 2;

    courseIds.forEach((courseId, index) => {
      const course = courseMap.get(courseId);
      if (!course) return;

      const x = startX + index * (NODE_WIDTH + HORIZONTAL_SPACING);

      nodes.push({
        id: courseId,
        type: 'courseNode',
        position: { x, y },
        data: {
          course,
          layer,
          isCompleted: completedCourses.includes(courseId),
          isRecommended: true,
        },
      });
    });
  });

  // エッジの生成（依存関係に基づく）
  const edges: Edge[] = [];
  const skillProviders = new Map<string, string[]>();

  // スキルを提供する講座のマップを作成
  recommendedCourseIds.forEach((courseId) => {
    const course = courseMap.get(courseId);
    if (!course) return;

    course.skills_acquired.forEach((skill) => {
      if (!skillProviders.has(skill)) {
        skillProviders.set(skill, []);
      }
      skillProviders.get(skill)!.push(courseId);
    });
  });

  // 各講座の前提スキルに基づいてエッジを作成
  recommendedCourseIds.forEach((courseId) => {
    const course = courseMap.get(courseId);
    if (!course) return;

    course.prerequisites.forEach((requiredSkill) => {
      const providers = skillProviders.get(requiredSkill) || [];
      providers.forEach((providerId) => {
        if (providerId !== courseId) {
          edges.push({
            id: `${providerId}-${courseId}`,
            source: providerId,
            target: courseId,
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: '#EC4899', // ピンク系
              strokeWidth: 2,
            },
            markerEnd: {
              type: 'arrowclosed',
              color: '#EC4899',
            },
          });
        }
      });
    });
  });

  return { nodes, edges };
}
