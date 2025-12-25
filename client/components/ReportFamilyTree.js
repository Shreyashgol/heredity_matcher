'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node component for family members
const FamilyMemberNode = ({ data }) => {
  const hasConditions = data.conditions && data.conditions.length > 0;
  
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 shadow-lg min-w-[180px] ${
        hasConditions
          ? 'bg-red-50 border-red-400'
          : 'bg-blue-50 border-blue-400'
      }`}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="text-center">
        <p className="font-bold text-gray-900 text-sm">{data.name}</p>
        <p className="text-xs text-gray-600 mt-1">{data.gender}</p>
        
        {data.generation !== undefined && (
          <p className="text-xs text-gray-500 mt-1">Gen: {data.generation}</p>
        )}
        
        {hasConditions && (
          <div className="mt-2 pt-2 border-t border-red-200">
            <p className="text-xs font-semibold text-red-700">Conditions:</p>
            {data.conditions.map((condition, idx) => (
              <p key={idx} className="text-xs text-red-600">
                • {condition.condition_name}
              </p>
            ))}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  familyMember: FamilyMemberNode,
};

export default function ReportFamilyTree({ treeData, patientName }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!treeData || treeData.length === 0) return;

    // Create nodes from tree data
    const newNodes = treeData.map((person, index) => {
      const hasConditions = person.conditions && person.conditions.length > 0;
      
      // Calculate position based on generation level
      const yPosition = person.generation_level * 200;
      const xPosition = index * 250;

      return {
        id: person.id.toString(),
        type: 'familyMember',
        position: { x: xPosition, y: yPosition },
        data: {
          name: person.name,
          gender: person.gender,
          generation: person.generation_level,
          conditions: person.conditions || [],
          isPatient: person.name === patientName,
        },
        style: {
          background: hasConditions ? '#fef2f2' : '#eff6ff',
          border: hasConditions ? '2px solid #dc2626' : '2px solid #3b82f6',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '180px',
          boxShadow: person.name === patientName ? '0 0 0 3px #fbbf24' : 'none',
        },
      };
    });

    // Create edges (connections between generations)
    const newEdges = [];
    for (let i = 0; i < treeData.length - 1; i++) {
      const current = treeData[i];
      const next = treeData[i + 1];
      
      // Connect parent to child (next generation)
      if (current.generation_level < next.generation_level) {
        newEdges.push({
          id: `e${current.id}-${next.id}`,
          source: next.id.toString(),
          target: current.id.toString(),
          animated: true,
          style: {
            stroke: '#3b82f6',
            strokeWidth: 2,
          },
          markerEnd: {
            type: 'arrowclosed',
            color: '#3b82f6',
          },
        });
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [treeData, patientName, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (!treeData || treeData.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <p className="text-gray-600">No family tree data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
