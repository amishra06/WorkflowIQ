import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return 'just now';
};

const initialActivities = [
  {
    id: '1',
    type: 'pattern_detected',
    title: 'New Pattern Detected',
    description: 'Weekly expense reporting could be automated',
    time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    icon: <Clock size={16} className="text-primary-500" />,
  },
  {
    id: '2',
    type: 'workflow_success',
    title: 'Workflow Executed',
    description: 'Email categorization workflow ran successfully',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    icon: <CheckCircle2 size={16} className="text-success-500" />,
  },
  {
    id: '3',
    type: 'integration_connected',
    title: 'Integration Connected',
    description: 'Connected Google Sheets integration',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    icon: <CheckCircle2 size={16} className="text-success-500" />,
  },
  {
    id: '4',
    type: 'workflow_error',
    title: 'Workflow Error',
    description: 'CRM data sync workflow failed',
    time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    icon: <AlertCircle size={16} className="text-danger-500" />,
  },
  {
    id: '5',
    type: 'pattern_detected',
    title: 'New Pattern Detected',
    description: 'Client email responses could be automated',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    icon: <Clock size={16} className="text-primary-500" />,
  },
];

const ActivityTimeline: React.FC = () => {
  const [activities, setActivities] = useState(initialActivities);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call to refresh activities
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add a new mock activity
      const newActivity = {
        id: Date.now().toString(),
        type: 'workflow_success',
        title: 'Workflow Executed',
        description: 'Data backup workflow completed successfully',
        time: new Date().toISOString(),
        icon: <CheckCircle2 size={16} className="text-success-500" />,
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Failed to refresh activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllActivity = () => {
    alert('View all activity - This would navigate to a detailed activity log page');
  };

  if (activities.length === 0) {
    return (
      <Card title="Recent Activity" className="h-full">
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
            <Clock size={24} />
          </div>
          <h4 className="text-gray-900 font-medium mb-1">No Recent Activity</h4>
          <p className="text-sm text-gray-500">
            Activity will appear here as you use the platform.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            loading={loading}
            icon={<RefreshCw size={16} />}
            title="Refresh activity"
          />
        </div>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {activity.icon}
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{timeAgo(activity.time)}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 mt-4 border-t border-gray-100">
          <Button 
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleViewAllActivity}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all activity
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ActivityTimeline;