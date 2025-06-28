import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '../common/Card';

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

const activities = [
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
  return (
    <Card title="Recent Activity" className="h-full">
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
                <span className="text-xs text-gray-500">{timeAgo(activity.time)}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{activity.description}</p>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ActivityTimeline;