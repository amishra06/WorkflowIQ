import React from 'react';
import { Helmet } from 'react-helmet';
import ROIDashboard from '../components/analytics/ROIDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Analytics | WorkflowIQ</title>
      </Helmet>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & ROI</h1>
          <p className="text-gray-600 mt-1">
            Track the impact of your workflow automations and calculate time and cost savings.
          </p>
        </div>
        
        <ROIDashboard />
      </div>
    </>
  );
};

export default AnalyticsPage;