import React from 'react';
import { Settings, RefreshCw, AlertCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { mockIntegrations } from '../../services/mockData';
import * as Icons from 'lucide-react';

const IntegrationList: React.FC = () => {
  // Function to dynamically get an icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || Icons.Box;
    return <IconComponent size={20} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Connected Integrations</h2>
        <Button variant="outline" size="sm">
          Add New Integration
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockIntegrations.map((integration) => {
          const statusColors = {
            connected: 'text-success-500',
            disconnected: 'text-gray-400',
            error: 'text-danger-500',
          };
          
          return (
            <Card key={integration.id} className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                      {getIconComponent(integration.icon)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-1.5 ${statusColors[integration.status]}`}></div>
                        <span className="text-sm text-gray-500 capitalize">{integration.status}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-md hover:bg-gray-100">
                    <Settings size={16} className="text-gray-500" />
                  </button>
                </div>
                
                <div className="mt-4 flex-grow">
                  {integration.status === 'connected' && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span>Last synced</span>
                        <span className="text-gray-900">
                          {new Date(integration.lastSyncedAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {integration.config.account && (
                        <div className="flex items-center justify-between mb-2">
                          <span>Account</span>
                          <span className="text-gray-900">{integration.config.account}</span>
                        </div>
                      )}
                      {integration.config.workspace && (
                        <div className="flex items-center justify-between mb-2">
                          <span>Workspace</span>
                          <span className="text-gray-900">{integration.config.workspace}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {integration.status === 'error' && (
                    <div className="bg-danger-50 text-danger-700 p-2 rounded text-sm flex items-start">
                      <AlertCircle size={16} className="mr-1.5 flex-shrink-0 mt-0.5" />
                      <span>Connection error. Authentication token expired.</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {integration.status === 'connected' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      fullWidth
                      icon={<RefreshCw size={16} />}
                    >
                      Sync Now
                    </Button>
                  )}
                  
                  {integration.status === 'disconnected' && (
                    <Button 
                      size="sm" 
                      fullWidth
                    >
                      Connect
                    </Button>
                  )}
                  
                  {integration.status === 'error' && (
                    <Button 
                      size="sm" 
                      fullWidth
                    >
                      Reconnect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationList;