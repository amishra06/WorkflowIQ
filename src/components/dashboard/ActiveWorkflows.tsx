import React, { useState } from 'react';
import { Play, Pause, Edit, MoreVertical, CheckCircle2, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { mockWorkflows } from '../../services/mockData';

const ActiveWorkflows: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleWorkflow = async (workflowId: string, currentStatus: string) => {
    setLoading(workflowId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWorkflows(prev => prev.map(workflow => 
        workflow.id === workflowId 
          ? { ...workflow, status: currentStatus === 'active' ? 'inactive' : 'active' }
          : workflow
      ));
    } catch (error) {
      console.error('Failed to toggle workflow:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleEditWorkflow = (workflowId: string) => {
    navigate('/workflows');
  };

  const handleViewWorkflow = (workflowId: string) => {
    navigate('/workflows');
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      setLoading(workflowId);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowId));
      } catch (error) {
        console.error('Failed to delete workflow:', error);
      } finally {
        setLoading(null);
      }
    }
  };

  const handleViewAllWorkflows = () => {
    navigate('/workflows');
  };

  if (workflows.length === 0) {
    return (
      <Card title="Active Workflows" className="h-full">
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
            <Play size={24} />
          </div>
          <h4 className="text-gray-900 font-medium mb-1">No Workflows</h4>
          <p className="text-sm text-gray-500 mb-4">
            You haven't created any workflows yet.
          </p>
          <Button onClick={() => navigate('/workflows')}>
            Create Your First Workflow
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Active Workflows" className="h-full">
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div 
            key={workflow.id} 
            className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`mt-0.5 w-3 h-3 rounded-full ${workflow.status === 'active' ? 'bg-success-500' : 'bg-gray-300'}`}></div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleWorkflow(workflow.id, workflow.status)}
                  loading={loading === workflow.id}
                  disabled={loading === workflow.id}
                  icon={workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  title={workflow.status === 'active' ? 'Pause workflow' : 'Start workflow'}
                />
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewWorkflow(workflow.id)}
                  icon={<Eye size={16} />}
                  title="View workflow"
                />
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditWorkflow(workflow.id)}
                  icon={<Edit size={16} />}
                  title="Edit workflow"
                />
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteWorkflow(workflow.id)}
                  icon={<Trash2 size={16} />}
                  title="Delete workflow"
                  className="text-red-500 hover:text-red-700"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
              <div>
                <p className="text-gray-500">Executions</p>
                <p className="font-medium">{workflow.executionCount}</p>
              </div>
              <div>
                <p className="text-gray-500">Success Rate</p>
                <div className="flex items-center">
                  <span className="font-medium">{workflow.successRate}%</span>
                  {workflow.successRate > 95 ? (
                    <CheckCircle2 size={14} className="ml-1 text-success-500" />
                  ) : (
                    <AlertCircle size={14} className="ml-1 text-warning-500" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-500">Time Saved</p>
                <p className="font-medium">{workflow.timeSaved} min/week</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {new Date(workflow.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <Button 
            variant="outline"
            onClick={handleViewAllWorkflows}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all workflows
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ActiveWorkflows;