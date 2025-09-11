import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: 'start', position: { x: 0, y: 0 }, data: { label: 'Start' } },
  { id: 'email', position: { x: 0, y: 100 }, data: { label: 'Send Email' } },
  { id: 'wait', position: { x: 0, y: 200 }, data: { label: 'Wait 1 Day' } },
  { id: 'end', position: { x: 0, y: 300 }, data: { label: 'End' } },
];

const initialEdges = [
  { id: 'e-start-email', source: 'start', target: 'email' },
  { id: 'e-email-wait', source: 'email', target: 'wait' },
  { id: 'e-wait-end', source: 'wait', target: 'end' },
];

const FlowBuilderPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addSmsNode = useCallback(() => {
    const newNodeId = uuidv4();
    const insertAfterNodeId = 'email';
    const moveDownNodeIds = ['wait', 'end'];
    const yOffset = 100;
    
    // Find the position to insert the new node
    const insertAfterNode = nodes.find(node => node.id === insertAfterNodeId);
    if (!insertAfterNode) return;
    
    const newNode = {
      id: newNodeId,
      position: { x: insertAfterNode.position.x, y: insertAfterNode.position.y + yOffset },
      data: { label: 'Send SMS' },
    };

    // Update nodes: move specified nodes down and add the new node
    setNodes((currentNodes) => {
      const updatedNodes = currentNodes.map((node) => {
        if (moveDownNodeIds.includes(node.id)) {
          return {
            ...node,
            position: {
              ...node.position,
              y: node.position.y + yOffset
            }
          };
        }
        return node;
      });
      return [...updatedNodes, newNode];
    });

    // Update edges: remove old connection and add new connections
    setEdges((currentEdges) => {
      const edgeToRemove = `e-${insertAfterNodeId}-wait`;
      const filteredEdges = currentEdges.filter((edge) => edge.id !== edgeToRemove);
      
      const newEdges = [
        { id: `e-${insertAfterNodeId}-${newNodeId}`, source: insertAfterNodeId, target: newNodeId },
        { id: `e-${newNodeId}-wait`, source: newNodeId, target: 'wait' },
      ];
      
      return [...filteredEdges, ...newEdges];
    });
  }, [nodes, setNodes, setEdges]);

  const addWaitNode = useCallback(() => {
    const newNodeId = uuidv4();
    const insertAfterNodeId = 'wait';
    const moveDownNodeIds = ['end'];
    const yOffset = 100;
    
    const insertAfterNode = nodes.find(node => node.id === insertAfterNodeId);
    if (!insertAfterNode) return;
    
    const newNode = {
      id: newNodeId,
      position: { x: insertAfterNode.position.x, y: insertAfterNode.position.y + yOffset },
      data: { label: 'Wait 2 Days' },
    };

    setNodes((currentNodes) => {
      const updatedNodes = currentNodes.map((node) => {
        if (moveDownNodeIds.includes(node.id)) {
          return {
            ...node,
            position: {
              ...node.position,
              y: node.position.y + yOffset
            }
          };
        }
        return node;
      });
      return [...updatedNodes, newNode];
    });

    setEdges((currentEdges) => {
      const edgeToRemove = `e-${insertAfterNodeId}-end`;
      const filteredEdges = currentEdges.filter((edge) => edge.id !== edgeToRemove);
      
      const newEdges = [
        { id: `e-${insertAfterNodeId}-${newNodeId}`, source: insertAfterNodeId, target: newNodeId },
        { id: `e-${newNodeId}-end`, source: newNodeId, target: 'end' },
      ];
      
      return [...filteredEdges, ...newEdges];
    });
  }, [nodes, setNodes, setEdges]);

  return (
    <div style={{ height: '100vh' }} className="relative">
      <div className="absolute top-4 left-4 z-10 space-x-2">
        <button 
          onClick={addSmsNode} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Add SMS Node
        </button>
        <button 
          onClick={addWaitNode} 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Add Wait Node
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default FlowBuilderPage;