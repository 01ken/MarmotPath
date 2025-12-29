import type { Course, StageInfo } from '../types';
import type { Node, Edge } from 'reactflow';
import type { CourseNodeData } from '../types';

/**
 * スキルツリーのノードとエッジを生成
 */
export function buildSkillTree(
  courses: Course[],
  stages: StageInfo[],
  completedCourses: string[]
): { nodes: Node<CourseNodeData>[]; edges: Edge[] } {
  const nodes: Node<CourseNodeData>[] = [];
  const edges: Edge[] = [];

  // Course IDからCourseオブジェクトへのマップ
  const courseMap = new Map<string, Course>();
  courses.forEach((course) => {
    courseMap.set(course.course_id, course);
  });

  // ステージごとにノードを配置
  const STAGE_HEIGHT = 200;
  const NODE_WIDTH = 280;
  const HORIZONTAL_SPACING = 50;

  stages.forEach((stage) => {
    const y = (stage.stage_number - 1) * STAGE_HEIGHT;
    const coursesInStage = stage.course_ids.length;
    const totalWidth = coursesInStage * NODE_WIDTH + (coursesInStage - 1) * HORIZONTAL_SPACING;
    const startX = -totalWidth / 2;

    stage.course_ids.forEach((courseId, index) => {
      const course = courseMap.get(courseId);
      if (!course) return;

      const x = startX + index * (NODE_WIDTH + HORIZONTAL_SPACING);

      nodes.push({
        id: courseId,
        type: 'courseNode',
        position: { x, y },
        data: {
          course,
          stageNumber: stage.stage_number,
          isCompleted: completedCourses.includes(courseId),
          isRecommended: true, // 最適化結果なので全て推奨
        },
      });
    });
  });

  // エッジの生成（前提条件に基づく）
  nodes.forEach((node) => {
    const course = node.data.course;

    // 前提スキルを持つ講座を探す
    course.prerequisites.forEach((prereqSkill) => {
      // このスキルを提供する講座を探す
      nodes.forEach((sourceNode) => {
        if (sourceNode.id === node.id) return; // 自分自身は除外

        const sourceCourse = sourceNode.data.course;
        if (sourceCourse.skills_acquired.includes(prereqSkill)) {
          edges.push({
            id: `${sourceNode.id}-${node.id}`,
            source: sourceNode.id,
            target: node.id,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#94a3b8' },
          });
        }
      });
    });
  });

  return { nodes, edges };
}
