import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Plus, 
  Play, 
  Save, 
  Mail, 
  FileText, 
  MessageSquare, 
  Clock,
  ArrowRight,
  Trash2,
  Settings
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action';
  name: string;
  icon: React.ReactNode;
  config: Record<string, any>;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'draft' | 'active';
}

const WorkflowBuilderPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Email to Task Converter',
      description: 'Automatically converts client emails to project tasks',
      status: 'active',
      steps: [
        {
          id: 'trigger-1',
          type: 'trigger',
          name: 'Email Received',
          icon: <Mail size={16} />,
          config: { folder: 'inbox', subject: 'contains:project' }
        },
        {
          id: 'action-1',
          type: 'action',
          name: 'Create Task',
          icon: <FileText size={16} />,
          config: { project: 'client-projects', assignee: 'auto' }
        },
        {
          id: 'action-2',
          type: 'action',
          name: 'Send Notification',
          icon: <MessageSquare size={16} />,
          config: { channel: 'slack', message: 'New task created' }
        }
      ]
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    steps: [] as WorkflowStep[]
  });

  const availableSteps = {
    triggers: [
      { type: 'trigger', name: 'Email Received', icon: <Mail size={16} /> },
      { type: 'trigger', name: 'Schedule', icon: <Clock size={16} /> },
      { type: 'trigger', name: 'Webhook', icon: <MessageSquare size={16} /> },
    ],
    actions: [
      { type: 'action', name: 'Create Task', icon: <FileText size={16} /> },
      { type: 'action', name: 'Send Email', icon: <Mail size={16} /> },
      { type: 'action', name: 'Send Notification', icon: <MessageSquare size={16} /> },
    ]
  };

  const handleCreateWorkflow = () => {
    setIsCreating(true);
    setSelectedWorkflow(null);
    setNewWorkflow({ name: '', description: '', steps: [] });
  };

  const handleSaveWorkflow = () => {
    if (!newWorkflow.name.trim()) return;

    const workflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      steps: newWorkflow.steps,
      status: 'draft'
    };

    setWorkflows(prev => [...prev, workflow]);
    setIsCreating(false);
    setSelectedWorkflow(workflow.id);
  };

  const handleAddStep = (stepTemplate: any) => {
    const step: WorkflowStep = {
      id: `${stepTemplate.type}-${Date.now()}`,
      type: stepTemplate.type,
      name: stepTemplate.name,
      icon: stepTemplate.icon,
      config: {}
    };

    if (isCreating) {
      setNewWorkflow(prev => ({
        ...prev,
        steps: [...prev.steps, step]
      }));
    } else if (selectedWorkflow) {
      setWorkflows(prev => prev.map(w => 
        w.id === selectedWorkflow 
          ? { ...w, steps: [...w.steps, step] }
          : w
      ));
    }
  };

  const handleRemoveStep = (stepId: string) => {
    if (isCreating) {
      setNewWorkflow(prev => ({
        ...prev,
        steps: prev.steps.filter(s => s.id !== stepId)
      }));
    } else if (selectedWorkflow) {
      setWorkflows(prev => prev.map(w => 
        w.id === selectedWorkflow 
          ? { ...w, steps: w.steps.filter(s => s.id !== stepId) }
          : w
      ));
    }
  };

  const handleTestWorkflow = async (workflowId: string) => {
    alert('Testing workflow... This would execute the workflow in test mode.');
  };

  const handleToggleWorkflow = async (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: w.status === 'active' ? 'draft' : 'active' }
        : w
    ));
  };

  const currentWorkflow = selectedWorkflow 
    ? workflows.find(w => w.id === selectedWorkflow)
    : null;

  const currentSteps = isCreating ? newWorkflow.steps : currentWorkflow?.steps || [];

  return (
    <>
      <Helmet>
        <title>Workflow Builder | WorkflowIQ</title>
      </Helmet>
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
            <p className="text-gray-600 mt-1">
              Create and manage your automated workflows.
            </p>
          </div>
          <Button onClick={handleCreateWorkflow} icon={<Plus size={16} />}>
            Create Workflow
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflow List */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Workflows</h2>
                <div className="space-y-3">
                  {workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedWorkflow === workflow.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      onClick={() => {
                        setSelectedWorkflow(workflow.id);
                        setIsCreating(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          workflow.status === 'active' 
                            ? 'bg-success-100 text-success-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {workflow.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{workflow.steps.length} steps</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Workflow Builder */}
          <div className="lg:col-span-2">
            {isCreating || selectedWorkflow ? (
              <div className="space-y-6">
                {/* Workflow Header */}
                <Card>
                  <div className="p-6">
                    {isCreating ? (
                      <div className="space-y-4">
                        <Input
                          label="Workflow Name"
                          value={newWorkflow.name}
                          onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter workflow name"
                        />
                        <Input
                          label="Description"
                          value={newWorkflow.description}
                          onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter workflow description"
                        />
                        <div className="flex space-x-3">
                          <Button onClick={handleSaveWorkflow} disabled={!newWorkflow.name.trim()}>
                            Save Workflow
                          </Button>
                          <Button variant="outline" onClick={() => setIsCreating(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : currentWorkflow ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{currentWorkflow.name}</h2>
                          <p className="text-gray-600 mt-1">{currentWorkflow.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTestWorkflow(currentWorkflow.id)}
                            icon={<Play size={16} />}
                          >
                            Test
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleToggleWorkflow(currentWorkflow.id)}
                            variant={currentWorkflow.status === 'active' ? 'warning' : 'success'}
                          >
                            {currentWorkflow.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Card>

                {/* Workflow Steps */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Steps</h3>
                    
                    {currentSteps.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No steps added yet. Add a trigger to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentSteps.map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                  step.type === 'trigger' ? 'bg-primary-100 text-primary-600' : 'bg-success-100 text-success-600'
                                }`}>
                                  {step.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{step.name}</h4>
                                  <p className="text-sm text-gray-500 capitalize">{step.type}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<Settings size={14} />}
                                    onClick={() => alert('Step configuration coming soon!')}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<Trash2 size={14} />}
                                    onClick={() => handleRemoveStep(step.id)}
                                  />
                                </div>
                              </div>
                            </div>
                            {index < currentSteps.length - 1 && (
                              <ArrowRight size={20} className="text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Available Steps */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Steps</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Triggers</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {availableSteps.triggers.map((step, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="h-16 flex-col"
                              onClick={() => handleAddStep(step)}
                            >
                              {step.icon}
                              <span className="mt-1 text-xs">{step.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Actions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {availableSteps.actions.map((step, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="h-16 flex-col"
                              onClick={() => handleAddStep(step)}
                            >
                              {step.icon}
                              <span className="mt-1 text-xs">{step.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card>
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                    <Plus size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Workflow Selected</h3>
                  <p className="text-gray-500 mb-6">
                    Select a workflow from the list or create a new one to get started.
                  </p>
                  <Button onClick={handleCreateWorkflow}>
                    Create New Workflow
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowBuilderPage;