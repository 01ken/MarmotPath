import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { CourseNodeData } from '../../types';

function CourseNode({ data, selected }: NodeProps<CourseNodeData>) {
  const { course, layer, isCompleted } = data;

  return (
    <div
      className={`
        px-5 py-4 rounded-2xl border-2 shadow-lg min-w-[260px] max-w-[280px]
        transition-all duration-300 cursor-pointer
        ${isCompleted
          ? 'bg-gradient-to-br from-pink-50 to-rose-100 border-pink-300 shadow-pink-200'
          : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-300 shadow-purple-200'
        }
        ${selected ? 'ring-4 ring-pink-400 scale-105' : 'hover:scale-102'}
        hover:shadow-2xl
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gradient-to-r !from-pink-400 !to-purple-400 !w-3 !h-3 !border-2 !border-white"
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              Level {layer + 1}
            </span>
            {isCompleted && (
              <span className="text-xl animate-bounce">✨</span>
            )}
          </div>
          <h3 className="font-bold text-sm text-gray-800 leading-tight">
            {course.name}
          </h3>
        </div>
        {isCompleted && (
          <div className="ml-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              ✓
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-600 mt-3">
        <div className="flex items-center gap-1">
          <span className="text-pink-500">⏱️</span>
          <span className="font-semibold">{course.estimated_hours}h</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-purple-500">🎯</span>
          <span className="font-semibold">{course.skills_acquired.length}スキル</span>
        </div>
      </div>

      {course.prerequisites.length > 0 && (
        <div className="mt-2 text-xs text-rose-600 font-medium">
          📋 前提: {course.prerequisites.length}個
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gradient-to-r !from-pink-400 !to-purple-400 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(CourseNode);
