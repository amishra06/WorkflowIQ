import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Code, Copy, Key, ArrowLeft, ExternalLink, Book, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Navbar from '../../components/landing/Navbar';

const APIDocsPage: React.FC = () => {
  console.log('🔍 APIDocsPage component rendered');
  
  const navigate = useNavigate();
  const [activeEndpoint, setActiveEndpoint] = useState('workflows');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const apiEndpoints = {
    workflows: {
      title: 'Workflows',
      description: 'Manage and execute workflows',
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/workflows',
          description: 'List all workflows',
          parameters: [
            { name: 'status', type: 'string', required: false, description: 'Filter by workflow status' },
            { name: 'limit', type: 'number', required: false, description: 'Number of results to return' }
          ],
          example: `curl -X GET \\
  -H "X-API-Key: wiq_your_api_key" \\
  -H "Content-Type: application/json" \\
  https://api.workflowiq.com/v1/workflows`,
          response: {
            "workflows": [
              {
                "id": "wf_123",
                "name": "Email Processor",
                "status": "active",
                "created_at": "2024-01-15T10:30:00Z"
              }
            ]
          }
        },
        {
          method: 'POST',
          path: '/api/v1/workflows',
          description: 'Create a new workflow',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Workflow name' },
            { name: 'description', type: 'string', required: false, description: 'Workflow description' },
            { name: 'config', type: 'object', required: true, description: 'Workflow configuration' }
          ],
          example: `curl -X POST \\
  -H "X-API-Key: wiq_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Workflow", "config": {...}}' \\
  https://api.workflowiq.com/v1/workflows`,
          response: {
            "id": "wf_124",
            "name": "My Workflow",
            "status": "draft",
            "created_at": "2024-01-15T11:00:00Z"
          }
        }
      ]
    },
    integrations: {
      title: 'Integrations',
      description: 'Manage third-party integrations',
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/integrations',
          description: 'List all integrations',
          parameters: [
            { name: 'type', type: 'string', required: false, description: 'Filter by integration type' }
          ],
          example: `curl -X GET \\
  -H "X-API-Key: wiq_your_api_key" \\
  https://api.workflowiq.com/v1/integrations`,
          response: {
            "integrations": [
              {
                "id": "int_123",
                "name": "Slack",
                "type": "communication",
                "status": "connected"
              }
            ]
          }
        }
      ]
    },
    analytics: {
      title: 'Analytics',
      description: 'Access workflow analytics and metrics',
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/analytics/workflows/{id}',
          description: 'Get workflow analytics',
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'Workflow ID' },
            { name: 'period', type: 'string', required: false, description: 'Time period (7d, 30d, 90d)' }
          ],
          example: `curl -X GET \\
  -H "X-API-Key: wiq_your_api_key" \\
  https://api.workflowiq.com/v1/analytics/workflows/wf_123`,
          response: {
            "executions": 150,
            "success_rate": 98.5,
            "avg_execution_time": 1250,
            "time_saved": 2400
          }
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>API Documentation | WorkflowIQ</title>
      </Helmet>

      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => {
                console.log('🔍 APIDocsPage - Back to Resources clicked');
                navigate('/resources');
              }}
              icon={<ArrowLeft size={16} />}
            >
              Back to Resources
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                API Documentation
              </h1>
              <p className="text-gray-600 text-lg">
                Integrate WorkflowIQ into your applications using our REST API.
              </p>
            </div>

            {/* Authentication Section */}
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Key className="mr-2" size={20} />
                  Authentication
                </h2>
                <p className="text-gray-600 mb-4">
                  All API requests must include your API key in the X-API-Key header:
                </p>
                <div className="bg-gray-100 p-4 rounded-md font-mono text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <code>X-API-Key: wiq_your_api_key</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Copy size={16} />}
                      onClick={() => copyToClipboard('X-API-Key: wiq_your_api_key')}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  icon={<Key size={16} />}
                  onClick={() => navigate('/settings')}
                >
                  Manage API Keys
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <Card>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Endpoints</h3>
                    <nav className="space-y-2">
                      {Object.entries(apiEndpoints).map(([key, section]) => (
                        <button
                          key={key}
                          onClick={() => setActiveEndpoint(key)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            activeEndpoint === key
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {section.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {Object.entries(apiEndpoints).map(([key, section]) => (
                  activeEndpoint === key && (
                    <div key={key} className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {section.title}
                        </h2>
                        <p className="text-gray-600">{section.description}</p>
                      </div>

                      {section.endpoints.map((endpoint, index) => (
                        <Card key={index}>
                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <span className={`uppercase font-mono text-sm px-2 py-1 rounded ${
                                endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                                endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {endpoint.method}
                              </span>
                              <code className="text-gray-700 font-mono">{endpoint.path}</code>
                            </div>

                            <p className="text-gray-600 mb-4">{endpoint.description}</p>

                            {endpoint.parameters && endpoint.parameters.length > 0 && (
                              <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">
                                  Parameters
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-md">
                                  {endpoint.parameters.map((param, paramIndex) => (
                                    <div key={paramIndex} className="mb-3 last:mb-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <code className="text-sm font-mono text-gray-800">
                                          {param.name}
                                        </code>
                                        <span className="text-xs text-gray-500">
                                          {param.type}
                                        </span>
                                        {param.required && (
                                          <span className="text-xs bg-red-100 text-red-700 px-1 rounded">
                                            required
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600">{param.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mb-6">
                              <h4 className="text-sm font-medium text-gray-700 mb-3">
                                Example Request
                              </h4>
                              <div className="bg-gray-900 p-4 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-gray-400 text-sm">cURL</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-white"
                                    icon={<Copy size={16} />}
                                    onClick={() => copyToClipboard(endpoint.example)}
                                  >
                                    Copy
                                  </Button>
                                </div>
                                <pre className="text-sm text-gray-100 overflow-x-auto">
                                  <code>{endpoint.example}</code>
                                </pre>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-3">
                                Example Response
                              </h4>
                              <div className="bg-gray-100 p-4 rounded-md">
                                <pre className="text-sm text-gray-800 overflow-x-auto">
                                  <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <Card className="mt-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <Book size={20} className="text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">SDK Libraries</p>
                      <p className="text-sm text-gray-600">Coming soon</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap size={20} className="text-success-600" />
                    <div>
                      <p className="font-medium text-gray-900">Webhooks</p>
                      <p className="text-sm text-gray-600">Real-time notifications</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ExternalLink size={20} className="text-warning-600" />
                    <div>
                      <p className="font-medium text-gray-900">Postman Collection</p>
                      <p className="text-sm text-gray-600">Test our API easily</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocsPage;