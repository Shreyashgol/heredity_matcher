'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

export default function FamilyTreeGraph({ treeData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!treeData || treeData.length === 0) return;

    // Create nodes from tree data
    const newNodes = treeData.map((person, index) => {
      const hasConditions = person.conditions && person.conditions.length > 0;
      const conditionNames = hasConditions
        ? person.conditions.map((c) => c.condition_name).join(', ')
        : 'No conditions';

      return {
        id: person.id.toString(),
        type: 'default',
        position: {
          x: index * 250,
          y: person.generation_level * 150,
        },
        data: {
          label: (
            <div className="text-center">
              <div className="font-bold text-sm">{person.name}</div>
              <div className="text-xs text-gray-600">{person.gender}</div>
              <div className="text-xs text-gray-500">
                Gen: {person.generation_level}
              </div>
              {hasConditions && (
                <div className="text-xs text-red-600 font-semibold mt-1">
                  ⚠️ {conditionNames}
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: hasConditions ? '#fee2e2' : '#dbeafe',
          border: hasConditions ? '2px solid #dc2626' : '2px solid #3b82f6',
          borderRadius: '8px',
          padding: '10px',
          width: 200,
        },
      };
    });

    // Create edges (connections between generations)
    const newEdges = [];
    for (let i = 0; i < treeData.length - 1; i++) {
      if (treeData[i].generation_level < treeData[i + 1].generation_level) {
        newEdges.push({
          id: `e${treeData[i].id}-${treeData[i + 1].id}`,
          source: treeData[i + 1].id.toString(),
          target: treeData[i].id.toString(),
          animated: true,
          style: { stroke: '#3b82f6' },
        });
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [treeData, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-[600px] border-2 border-gray-300 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
