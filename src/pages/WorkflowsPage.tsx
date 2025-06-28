import React from 'react';
import { Helmet } from 'react-helmet';
import { ReactFlowProvider } from 'reactflow';
import WorkflowCanvas from '../components/workflow-builder/WorkflowCanvas';

const WorkflowsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Workflow Builder | WorkflowIQ</title>
      </Helmet>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-6rem)]">
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default WorkflowsPage;