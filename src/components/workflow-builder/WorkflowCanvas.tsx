import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  NodeProps,
  Handle,
  Position,
  useReactFlow,
} from 'reactflow';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { NodeResizer } from '@reactflow/node-resizer';
import { nanoid } from 'nanoid';
import {
  Play,
  Pause,
  Edit,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Mail,
  Clock,
  FileText,
  MessageSquare,
  Database,
  Send,
  BarChart2,
  Trash2,
  Plus,
  Save,
  PlayCircle,
} from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';

// Custom node types
const CustomNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`relative p-3 rounded-lg shadow-sm cursor-pointer transition-all ${
      selected ? 'border-2 border-primary-500 bg-white' : 'border border-gray-200 bg-white hover:border-primary-300'
    }`}>
      <NodeResizer
        isVisible={selected}
        minWidth={180}
        minHeight={50}
      />
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
          data.type.startsWith('trigger') ? 'bg-primary-100 text-primary-600' : 'bg-success-100 text-success-600'
        }`}>
          {data.icon}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium text-gray-900">{data.label}</p>
          <p className="text-xs text-gray-500">
            {data.type.startsWith('trigger') ? 'Trigger' : 'Action'}
          </p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Draggable node component
const DraggableNode: React.FC<{
  type: string;
  label: string;
  icon: React.ReactNode;
}> = ({ type, label, icon }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `${type}-${label}`,
    data: { type, label, icon },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center p-2 bg-white border border-gray-200 rounded-md hover:border-primary-300 hover:bg-primary-50 cursor-move"
    >
      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
};

const WorkflowCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const type = active.data.current?.type;
      const label = active.data.current?.label;
      const icon = active.data.current?.icon;

      if (!type || !label || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.delta.x - bounds.left,
        y: event.delta.y - bounds.top,
      });

      const newNode: Node = {
        id: nanoid(),
        type: 'custom',
        position,
        data: { label, type, icon },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [project, setNodes],
  );

  const nodeTypes = {
    trigger: [
      { type: 'trigger-email', label: 'Email Trigger', icon: <Mail size={16} /> },
      { type: 'trigger-schedule', label: 'Schedule', icon: <Clock size={16} /> },
    ],
    action: [
      { type: 'action-create-task', label: 'Create Task', icon: <FileText size={16} /> },
      { type: 'action-send-notification', label: 'Send Notification', icon: <MessageSquare size={16} /> },
      { type: 'action-update-database', label: 'Update Database', icon: <Database size={16} /> },
      { type: 'action-send-email', label: 'Send Email', icon: <Send size={16} /> },
      { type: 'action-generate-report', label: 'Generate Report', icon: <BarChart2 size={16} /> },
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-4">
            <BarChart2 size={24} className="text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Email to Task Automation</h2>
            <p className="text-sm text-gray-500">Convert client emails to tasks automatically</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" icon={<Save size={16} />}>
            Save
          </Button>
          <Button size="sm" icon={<PlayCircle size={16} />}>
            Test Run
          </Button>
        </div>
      </div>

      <div className="flex-grow flex">
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-3">Workflow Nodes</h3>

          <DndContext onDragEnd={onDragEnd}>
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Triggers</h4>
              <div className="space-y-2">
                {nodeTypes.trigger.map((node) => (
                  <DraggableNode key={node.type} {...node} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Actions</h4>
              <div className="space-y-2">
                {nodeTypes.action.map((node) => (
                  <DraggableNode key={node.type} {...node} />
                ))}
              </div>
            </div>
          </DndContext>
        </div>

        <div className="flex-grow bg-gray-100 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node.id)}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        <div className="w-72 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-4">Properties</h3>

          {selectedNode ? (
            <div>
              <Card className="mb-4">
                <h4 className="font-medium text-sm mb-3">Configuration</h4>
                {/* Node-specific configuration UI */}
              </Card>

              <Card>
                <h4 className="font-medium text-sm mb-3">Testing</h4>
                <Button size="sm" variant="outline" fullWidth>
                  Run This Step
                </Button>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
                <Plus size={24} />
              </div>
              <h4 className="text-gray-900 font-medium mb-1">No Step Selected</h4>
              <p className="text-sm text-gray-500">
                Select a step in the workflow to view and edit its properties
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowCanvas;