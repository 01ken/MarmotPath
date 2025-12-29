import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { CourseNodeData } from '../../types';

function CourseNode({ data, selected }: NodeProps<CourseNodeData>) {
  const { course, stageNumber, isCompleted } = data;

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 shadow-lg min-w-[250px] max-w-[280px]
        ${isCompleted ? 'bg-green-50 border-green-400' : 'bg-white border-blue-400'}
        ${selected ? 'ring-4 ring-blue-300' : ''}
        hover:shadow-xl transition-all cursor-pointer
      `}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />

      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="text-xs font-semibold text-blue-600 mb-1">
            Stage {stageNumber}
          </div>
          <h3 className="font-bold text-sm text-gray-800 leading-tight">
            {course.name}
          </h3>
        </div>
        {isCompleted && (
          <div className="ml-2 flex-shrink-0">
            <span className="text-2xl">✓</span>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-600 mt-2">
        ⏱️ {course.estimated_hours}時間
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {course.skills_acquired.length}スキル獲得
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  );
}

export default memo(CourseNode);
