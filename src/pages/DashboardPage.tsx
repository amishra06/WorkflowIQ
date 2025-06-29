import React from 'react';
import { Helmet } from 'react-helmet';
import MetricsOverview from '../components/dashboard/MetricsOverview';
import AutomationOpportunities from '../components/dashboard/AutomationOpportunities';
import ActiveWorkflows from '../components/dashboard/ActiveWorkflows';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import SmartSuggestions from '../components/dashboard/SmartSuggestions';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

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
              Here's an overview of your automation performance and opportunities.
            </p>
          </div>
        </div>
        
        <MetricsOverview />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <AutomationOpportunities />
          </div>
          <div className="space-y-8">
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