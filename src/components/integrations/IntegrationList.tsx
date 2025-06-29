import React, { useState } from 'react';
import { Settings, RefreshCw, AlertCircle, CheckCircle, Plus, ExternalLink, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { mockIntegrations } from '../../services/mockData';
import * as Icons from 'lucide-react';

const IntegrationList: React.FC = () => {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [syncingIntegrations, setSyncingIntegrations] = useState<Set<string>>(new Set());
  const [connectingIntegrations, setConnectingIntegrations] = useState<Set<string>>(new Set());

  // Function to dynamically get an icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || Icons.Box;
    return <IconComponent size={20} />;
  };

  const handleSync = async (integrationId: string) => {
    setSyncingIntegrations(prev => new Set(prev).add(integrationId));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, lastSyncedAt: new Date().toISOString() }
          : integration
      ));
      
      console.log(`Syncing integration: ${integrationId}`);
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed. Please try again.');
    } finally {
      setSyncingIntegrations(prev => {
        const newSet = new Set(prev);
        newSet.delete(integrationId);
        return newSet;
      });
    }
  };

  const handleConnect = async (integrationId: string) => {
    setConnectingIntegrations(prev => new Set(prev).add(integrationId));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: 'connected',
              lastSyncedAt: new Date().toISOString(),
              config: { ...integration.config, account: 'user@example.com' }
            }
          : integration
      ));
      
      console.log(`Connecting integration: ${integrationId}`);
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Connection failed. Please try again.');
    } finally {
      setConnectingIntegrations(prev => {
        const newSet = new Set(prev);
        newSet.delete(integrationId);
        return newSet;
      });
    }
  };

  const handleReconnect = async (integrationId: string) => {
    setConnectingIntegrations(prev => new Set(prev).add(integrationId));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: 'connected',
              lastSyncedAt: new Date().toISOString()
            }
          : integration
      ));
      
      console.log(`Reconnecting integration: ${integrationId}`);
    } catch (error) {
      console.error('Reconnection failed:', error);
      alert('Reconnection failed. Please try again.');
    } finally {
      setConnectingIntegrations(prev => {
        const newSet = new Set(prev);
        newSet.delete(integrationId);
        return newSet;
      });
    }
  };

  const handleSettings = (integrationId: string, integrationName: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      const settings = prompt(
        `Configure ${integrationName} settings:\n\nCurrent config: ${JSON.stringify(integration.config, null, 2)}\n\nEnter new configuration (JSON):`,
        JSON.stringify(integration.config, null, 2)
      );
      
      if (settings) {
        try {
          const newConfig = JSON.parse(settings);
          setIntegrations(prev => prev.map(int => 
            int.id === integrationId 
              ? { ...int, config: newConfig }
              : int
          ));
          alert(`Settings updated for ${integrationName}`);
        } catch (error) {
          alert('Invalid JSON configuration');
        }
      }
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    if (window.confirm('Are you sure you want to disconnect this integration?')) {
      setConnectingIntegrations(prev => new Set(prev).add(integrationId));
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { 
                ...integration, 
                status: 'disconnected',
                lastSyncedAt: undefined,
                config: {}
              }
            : integration
        ));
      } catch (error) {
        console.error('Disconnection failed:', error);
      } finally {
        setConnectingIntegrations(prev => {
          const newSet = new Set(prev);
          newSet.delete(integrationId);
          return newSet;
        });
      }
    }
  };

  const handleAddNewIntegration = () => {
    const integrationName = prompt('Enter integration name:');
    if (integrationName) {
      const newIntegration = {
        id: Date.now().toString(),
        name: integrationName,
        type: 'custom',
        icon: 'box',
        status: 'disconnected' as const,
        config: {}
      };
      
      setIntegrations(prev => [...prev, newIntegration]);
    }
  };

  const handleViewDocumentation = (integrationName: string) => {
    alert(`Opening documentation for ${integrationName}...`);
    // In a real app, this would open the integration's documentation
  };

  if (integrations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Connected Integrations</h2>
          <Button 
            variant="primary" 
            size="sm"
            icon={<Plus size={16} />}
            onClick={handleAddNewIntegration}
          >
            Add New Integration
          </Button>
        </div>
        
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <Plus size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Integrations</h3>
            <p className="text-gray-500 mb-6">
              Connect your favorite tools to start automating your workflows.
            </p>
            <Button onClick={handleAddNewIntegration}>
              Add Your First Integration
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Connected Integrations</h2>
        <Button 
          variant="primary" 
          size="sm"
          icon={<Plus size={16} />}
          onClick={handleAddNewIntegration}
        >
          Add New Integration
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const statusColors = {
            connected: 'text-success-500',
            disconnected: 'text-gray-400',
            error: 'text-danger-500',
          };

          const isLoading = syncingIntegrations.has(integration.id) || connectingIntegrations.has(integration.id);
          
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
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSettings(integration.id, integration.name)}
                      disabled={isLoading}
                      icon={<Settings size={14} />}
                      title="Settings"
                    />
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDocumentation(integration.name)}
                      icon={<ExternalLink size={14} />}
                      title="Documentation"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex-grow">
                  {integration.status === 'connected' && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span>Last synced</span>
                        <span className="text-gray-900">
                          {integration.lastSyncedAt ? 
                            new Date(integration.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                            'Never'
                          }
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

                  {integration.status === 'disconnected' && (
                    <div className="bg-gray-50 text-gray-600 p-2 rounded text-sm">
                      <span>This integration is not connected. Click connect to set it up.</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    {integration.status === 'connected' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          icon={<RefreshCw size={16} />}
                          onClick={() => handleSync(integration.id)}
                          loading={syncingIntegrations.has(integration.id)}
                          disabled={isLoading}
                        >
                          {syncingIntegrations.has(integration.id) ? 'Syncing...' : 'Sync'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDisconnect(integration.id)}
                          loading={connectingIntegrations.has(integration.id)}
                          disabled={isLoading}
                          icon={<Trash2 size={16} />}
                          title="Disconnect"
                        />
                      </>
                    )}
                    
                    {integration.status === 'disconnected' && (
                      <Button 
                        variant="primary"
                        size="sm" 
                        fullWidth
                        icon={<CheckCircle size={16} />}
                        onClick={() => handleConnect(integration.id)}
                        loading={connectingIntegrations.has(integration.id)}
                        disabled={isLoading}
                      >
                        {connectingIntegrations.has(integration.id) ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                    
                    {integration.status === 'error' && (
                      <Button 
                        variant="warning"
                        size="sm" 
                        fullWidth
                        icon={<RefreshCw size={16} />}
                        onClick={() => handleReconnect(integration.id)}
                        loading={connectingIntegrations.has(integration.id)}
                        disabled={isLoading}
                      >
                        {connectingIntegrations.has(integration.id) ? 'Reconnecting...' : 'Reconnect'}
                      </Button>
                    )}
                  </div>
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