import React from 'react';
import { Helmet } from 'react-helmet';
import IntegrationList from '../components/integrations/IntegrationList';

const IntegrationsPage: React.FC = () => {
  console.log('🔍 IntegrationsPage component rendered');
  
  return (
    <>
      <Helmet>
        <title>Integrations | WorkflowIQ</title>
      </Helmet>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">
            Connect your business tools to enable powerful workflow automations.
          </p>
        </div>
        
        <IntegrationList />
      </div>
    </>
  );
};

export default IntegrationsPage;