import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CourseNode from './CourseNode';
import CourseDetailPanel from './CourseDetailPanel';
import type { Node, Edge } from 'reactflow';
import type { CourseNodeData } from '../../types';

// NodeTypesを直接定義（型エラーを回避）
const nodeTypes = {
  courseNode: CourseNode,
};

interface Props {
  initialNodes: Node<CourseNodeData>[];
  initialEdges: Edge[];
}

export default function SkillTreeCanvas({ initialNodes, initialEdges }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedCourse(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedCourse(null);
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-lg border-2 border-gray-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            return node.data.isCompleted ? '#86efac' : '#93c5fd';
          }}
        />
      </ReactFlow>

      <CourseDetailPanel
        courseId={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
}
