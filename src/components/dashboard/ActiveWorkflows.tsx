import React from 'react';
import { Play, Pause, Edit, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '../common/Card';
import { mockWorkflows } from '../../services/mockData';

const ActiveWorkflows: React.FC = () => {
  return (
    <Card title="Active Workflows" className="h-full">
      <div className="space-y-4">
        {mockWorkflows.map((workflow) => (
          <div 
            key={workflow.id} 
            className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 w-3 h-3 rounded-full ${workflow.status === 'active' ? 'bg-success-500' : 'bg-gray-300'}`}></div>
                <div>
                  <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded hover:bg-gray-100">
                  {workflow.status === 'active' ? (
                    <Pause size={18} className="text-gray-500" />
                  ) : (
                    <Play size={18} className="text-gray-500" />
                  )}
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Edit size={18} className="text-gray-500" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <MoreVertical size={18} className="text-gray-500" />
                </button>
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
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all workflows
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ActiveWorkflows;