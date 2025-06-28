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

// Custom node types
const CustomNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`relative p-3 rounded-lg shadow-sm cursor-pointer transition-all min-w-[180px] ${
      selected ? 'border-2 border-primary-500 bg-white' : 'border border-gray-200 bg-white hover:border-primary-300'
    }`}>
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
          data.type?.startsWith('trigger') ? 'bg-primary-100 text-primary-600' : 'bg-success-100 text-success-600'
        }`}>
          {data.icon}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium text-gray-900">{data.label}</p>
          <p className="text-xs text-gray-500">
            {data.type?.startsWith('trigger') ? 'Trigger' : 'Action'}
          </p>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
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
  onDragStart: (event: React.DragEvent, nodeType: string, label: string, icon: React.ReactNode) => void;
}> = ({ type, label, icon, onDragStart }) => {
  const handleDragStart = (event: React.DragEvent) => {
    onDragStart(event, type, label, icon);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center p-2 bg-white border border-gray-200 rounded-md hover:border-primary-300 hover:bg-primary-50 cursor-move transition-colors"
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
  const [draggedNodeType, setDraggedNodeType] = useState<{
    type: string;
    label: string;
    icon: React.ReactNode;
  } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragStart = (event: React.DragEvent, type: string, label: string, icon: React.ReactNode) => {
    setDraggedNodeType({ type, label, icon });
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!draggedNodeType || !reactFlowWrapper.current) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: nanoid(),
        type: 'custom',
        position,
        data: { 
          label: draggedNodeType.label, 
          type: draggedNodeType.type, 
          icon: draggedNodeType.icon 
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setDraggedNodeType(null);
    },
    [draggedNodeType, screenToFlowPosition, setNodes],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedNode(node.id);
  }, []);

  // Clear selection when clicking on canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode && edge.target !== selectedNode));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const nodeTypeDefinitions = {
    trigger: [
      { type: 'trigger-email', label: 'Email Trigger', icon: <Mail size={16} /> },
      { type: 'trigger-schedule', label: 'Schedule', icon: <Clock size={16} /> },
      { type: 'trigger-webhook', label: 'Webhook', icon: <MessageSquare size={16} /> },
    ],
    action: [
      { type: 'action-create-task', label: 'Create Task', icon: <FileText size={16} /> },
      { type: 'action-send-notification', label: 'Send Notification', icon: <MessageSquare size={16} /> },
      { type: 'action-update-database', label: 'Update Database', icon: <Database size={16} /> },
      { type: 'action-send-email', label: 'Send Email', icon: <Send size={16} /> },
      { type: 'action-generate-report', label: 'Generate Report', icon: <BarChart2 size={16} /> },
    ],
  };

  const handleSave = () => {
    const workflowData = {
      nodes,
      edges,
      name: 'Email to Task Automation',
      description: 'Convert client emails to tasks automatically'
    };
    console.log('Saving workflow:', workflowData);
    // Here you would typically save to your backend
  };

  const handleTestRun = () => {
    console.log('Running test with nodes:', nodes, 'and edges:', edges);
    // Here you would typically trigger a test execution
  };

  // Get selected node data for properties panel
  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

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
          {selectedNode && (
            <Button 
              variant="danger" 
              size="sm" 
              icon={<Trash2 size={16} />}
              onClick={deleteSelectedNode}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Node
            </Button>
          )}
          <Button variant="outline" size="sm" icon={<Save size={16} />} onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" icon={<PlayCircle size={16} />} onClick={handleTestRun}>
            Test Run
          </Button>
        </div>
      </div>

      <div className="flex-grow flex">
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-3">Workflow Nodes</h3>

          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Triggers</h4>
            <div className="space-y-2">
              {nodeTypeDefinitions.trigger.map((node) => (
                <DraggableNode 
                  key={node.type} 
                  {...node} 
                  onDragStart={onDragStart}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Actions</h4>
            <div className="space-y-2">
              {nodeTypeDefinitions.action.map((node) => (
                <DraggableNode 
                  key={node.type} 
                  {...node} 
                  onDragStart={onDragStart}
                />
              ))}
            </div>
          </div>
        </div>

        <div 
          className="flex-grow bg-gray-100 relative" 
          ref={reactFlowWrapper}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        <div className="w-72 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-4">Properties</h3>

          {selectedNodeData ? (
            <div>
              <Card className="mb-4">
                <div className="p-4">
                  <h4 className="font-medium text-sm mb-3">Node Configuration</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Node Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        defaultValue={selectedNodeData.data.label || ''}
                        placeholder="Enter node name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        rows={3}
                        placeholder="Enter node description..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Node Type
                      </label>
                      <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {selectedNodeData.data.type || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="mb-4">
                <div className="p-4">
                  <h4 className="font-medium text-sm mb-3">Actions</h4>
                  <div className="space-y-2">
                    <Button size="sm" variant="outline" fullWidth>
                      Configure Settings
                    </Button>
                    <Button size="sm" variant="outline" fullWidth>
                      Test This Node
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      fullWidth
                      icon={<Trash2 size={14} />}
                      onClick={deleteSelectedNode}
                    >
                      Delete Node
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
                <Plus size={24} />
              </div>
              <h4 className="text-gray-900 font-medium mb-1">No Node Selected</h4>
              <p className="text-sm text-gray-500">
                Click on a node in the canvas to view and edit its properties, or drag nodes from the left panel to add them to your workflow.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowCanvas;