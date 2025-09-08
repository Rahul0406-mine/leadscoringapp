
import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Send Email' } },
  { id: '3', position: { x: 0, y: 200 }, data: { label: 'Wait 1 Day' } },
  { id: '4', position: { x: 0, y: 300 }, data: { label: 'End' } },
];
const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
];

let id = 5;
const getId = () => `${id++}`;

const FlowBuilderPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addSmsNode = useCallback(() => {
    const newNodeId = getId();
    const newNode = {
      id: newNodeId,
      position: { x: 0, y: 150 },
      data: { label: 'Send SMS' },
    };

    setNodes((nds) => {
        const newNodes = nds.map((node) => {
            if (node.id === '3' || node.id === '4') { // move nodes 3 and 4 down
                return {...node, position: {...node.position, y: node.position.y + 100}}
            }
            return node
        })
        return [...newNodes, newNode]
    });

    setEdges((eds) => {
      return eds.filter((edge) => edge.id !== 'e2-3').concat([
          { id: `e2-${newNodeId}`, source: '2', target: newNodeId },
          { id: `e${newNodeId}-3`, source: newNodeId, target: '3' },
        ]);
    });
  }, [setNodes, setEdges]);

  return (
    <div style={{ height: '100vh' }}>
        <button onClick={addSmsNode} className="absolute top-4 left-4 z-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Send SMS Node
        </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default FlowBuilderPage;
