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
    <div className="relative w-full h-[650px] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl border-3 border-purple-200 shadow-inner overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background
          color="#E9D5FF"
          gap={20}
          size={1}
        />
        <Controls className="!bg-white/80 !border-purple-200 !shadow-lg !rounded-xl" />
        <MiniMap
          className="!bg-white/80 !border-2 !border-purple-200 !shadow-lg !rounded-xl"
          nodeColor={(node) => {
            return node.data.isCompleted
              ? 'rgb(251, 207, 232)' // pink-200
              : 'rgb(221, 214, 254)'; // purple-200
          }}
          maskColor="rgb(249, 168, 212, 0.3)"
        />
      </ReactFlow>

      <CourseDetailPanel
        courseId={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
}
