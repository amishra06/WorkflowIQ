import React from 'react';
import { Helmet } from 'react-helmet';
import { Code, Copy, Key } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { apiSpec } from '../../services/api/docs';

const APIDocsPage: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>API Documentation | WorkflowIQ</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-gray-600">
            Integrate WorkflowIQ into your applications using our REST API.
          </p>
        </div>

        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
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
              onClick={() => {/* Navigate to API keys management */}}
            >
              Manage API Keys
            </Button>
          </div>
        </Card>

        <div className="space-y-8">
          {Object.entries(apiSpec.paths).map(([path, methods]) => (
            <Card key={path}>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">{path}</h3>
                <div className="space-y-6">
                  {Object.entries(methods).map(([method, endpoint]) => (
                    <div key={method}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`uppercase font-mono text-sm px-2 py-1 rounded ${
                          method === 'get' ? 'bg-blue-100 text-blue-700' :
                          method === 'post' ? 'bg-green-100 text-green-700' :
                          method === 'put' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {method}
                        </span>
                        <span className="text-gray-600">{endpoint.summary}</span>
                      </div>

                      {endpoint.parameters && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Parameters
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-md">
                            {endpoint.parameters.map((param: any) => (
                              <div key={param.name} className="mb-2 last:mb-0">
                                <code className="text-sm">
                                  {param.name}
                                  {param.required && '*'}
                                </code>
                                <span className="text-sm text-gray-600 ml-2">
                                  {param.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Example Request
                        </h4>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <div className="flex items-center justify-between">
                            <pre className="text-sm">
                              <code>
                                curl -X {method.toUpperCase()} \{'\n'}
                                {'  '}-H "X-API-Key: wiq_your_api_key" \{'\n'}
                                {'  '}-H "Content-Type: application/json" \{'\n'}
                                {'  '}https://api.workflowiq.com/v1{path}
                              </code>
                            </pre>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Copy size={16} />}
                              onClick={() => copyToClipboard(`curl -X ${method.toUpperCase()} \\
-H "X-API-Key: wiq_your_api_key" \\
-H "Content-Type: application/json" \\
https://api.workflowiq.com/v1${path}`)}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Response
                        </h4>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <pre className="text-sm">
                            <code>
                              {JSON.stringify(
                                endpoint.responses['200']?.content?.['application/json']?.schema,
                                null,
                                2
                              )}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default APIDocsPage;