import React from 'react';
import { Helmet } from 'react-helmet';
import MetricsOverview from '../components/dashboard/MetricsOverview';
import AutomationOpportunities from '../components/dashboard/AutomationOpportunities';
import ActiveWorkflows from '../components/dashboard/ActiveWorkflows';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import SmartSuggestions from '../components/dashboard/SmartSuggestions';

const DashboardPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | WorkflowIQ</title>
      </Helmet>
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's an overview of your automation performance.
            </p>
          </div>
        </div>
        
        <MetricsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AutomationOpportunities />
          </div>
          <div className="space-y-6">
            <SmartSuggestions limit={3} />
            <ActivityTimeline />
          </div>
        </div>
        
        <div>
          <ActiveWorkflows />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;