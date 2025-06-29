import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Play, 
  Pause,
  Plus,
  Zap,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  executionCount: number;
  successRate: number;
  timeSaved: number;
  lastRun: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon, trend, trendValue }) => {
  return (
    <Card className="h-full">
      <div className="p-6">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="flex items-baseline mt-1">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {trend && (
                <span className={`ml-2 text-sm font-medium ${trend === 'up' ? 'text-success-500' : 'text-danger-500'}`}>
                  {trend === 'up' ? '↑' : '↓'} {trendValue}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with demo data
  useEffect(() => {
    const demoWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Email to Task Converter',
        description: 'Automatically converts client emails to project tasks',
        status: 'active',
        executionCount: 47,
        successRate: 98.5,
        timeSaved: 120,
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Weekly Report Generator',
        description: 'Compiles weekly status reports from multiple sources',
        status: 'active',
        executionCount: 12,
        successRate: 100,
        timeSaved: 180,
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    setWorkflows(demoWorkflows);
  }, []);

  const handleToggleWorkflow = async (workflowId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWorkflows(prev => prev.map(workflow => 
        workflow.id === workflowId 
          ? { ...workflow, status: workflow.status === 'active' ? 'inactive' : 'active' }
          : workflow
      ));
    } catch (error) {
      console.error('Failed to toggle workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalTimeSaved = workflows.reduce((sum, w) => sum + w.timeSaved, 0);
  const activeWorkflows = workflows.filter(w => w.status === 'active').length;
  const totalExecutions = workflows.reduce((sum, w) => sum + w.executionCount, 0);
  const avgSuccessRate = workflows.length > 0 
    ? workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length 
    : 0;

  return (
    <>
      <Helmet>
        <title>Dashboard | WorkflowIQ</title>
      </Helmet>
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back{user?.fullName ? `, ${user.fullName}` : ''}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's an overview of your automation performance.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/workflows')}
            icon={<Plus size={16} />}
          >
            Create Workflow
          </Button>
        </div>
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Time Saved"
            value={`${Math.floor(totalTimeSaved / 60)}h ${totalTimeSaved % 60}m`}
            description="Total time saved this month"
            icon={<Clock size={20} />}
            trend="up"
            trendValue="12%"
          />
          <MetricCard
            title="Active Workflows"
            value={activeWorkflows}
            description={`Out of ${workflows.length} total workflows`}
            icon={<TrendingUp size={20} />}
          />
          <MetricCard
            title="Successful Executions"
            value={totalExecutions}
            description={`${avgSuccessRate.toFixed(1)}% success rate`}
            icon={<CheckCircle size={20} />}
            trend="up"
            trendValue="3.2%"
          />
          <MetricCard
            title="Automation Score"
            value="A+"
            description="Based on efficiency metrics"
            icon={<BarChart3 size={20} />}
          />
        </div>

        {/* Active Workflows */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Active Workflows</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/workflows')}
              >
                View All
              </Button>
            </div>

            {workflows.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
                  <Zap size={24} />
                </div>
                <h4 className="text-gray-900 font-medium mb-1">No Workflows</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Create your first workflow to start automating tasks.
                </p>
                <Button onClick={() => navigate('/workflows')}>
                  Create Your First Workflow
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div 
                    key={workflow.id} 
                    className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`mt-0.5 w-3 h-3 rounded-full ${
                          workflow.status === 'active' ? 'bg-success-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleWorkflow(workflow.id)}
                          loading={loading}
                          disabled={loading}
                          icon={workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                          title={workflow.status === 'active' ? 'Pause workflow' : 'Start workflow'}
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
                            <CheckCircle size={14} className="ml-1 text-success-500" />
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
                        <p className="text-gray-500">Last Run</p>
                        <p className="font-medium">
                          {new Date(workflow.lastRun).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => navigate('/workflows')}
              >
                <Zap size={24} className="mb-2" />
                <span>Create Workflow</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => alert('Feature coming soon!')}
              >
                <BarChart3 size={24} className="mb-2" />
                <span>View Analytics</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => alert('Feature coming soon!')}
              >
                <TrendingUp size={24} className="mb-2" />
                <span>Optimize Workflows</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;