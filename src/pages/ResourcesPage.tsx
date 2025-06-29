import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  BookOpen,
  Video,
  FileText,
  Users,
  ArrowRight,
  PlayCircle,
  Download,
  ExternalLink,
  Code,
  Zap,
  Settings,
  Mail,
  BarChart,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import BackButton from '../components/common/BackButton';
import Navbar from '../components/landing/Navbar';
import DocsViewer from '../components/documentation/DocsViewer';
import TemplateLibrary from '../components/documentation/TemplateLibrary';

const ResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'getting-started' | 'api-docs' | 'integration-guides' | 'templates'>('overview');

  const resources = {
    documentation: [
      {
        title: 'Getting Started Guide',
        description: 'Learn the basics of WorkflowIQ and set up your first automation',
        icon: <BookOpen size={24} />,
        link: () => {
          console.log('🔍 Getting Started Guide clicked - setting activeSection to getting-started');
          setActiveSection('getting-started');
        },
        isInternal: true,
      },
      {
        title: 'API Documentation',
        description: 'Detailed API reference for developers',
        icon: <FileText size={24} />,
        link: () => {
          console.log('🔍 API Documentation clicked - setting activeSection to api-docs');
          setActiveSection('api-docs');
        },
        isInternal: true,
      },
      {
        title: 'Integration Guides',
        description: 'Connect WorkflowIQ with your favorite tools',
        icon: <Users size={24} />,
        link: () => {
          console.log('🔍 Integration Guides clicked - setting activeSection to integration-guides');
          setActiveSection('integration-guides');
        },
        isInternal: true,
      },
    ],
    tutorials: [
      {
        title: 'Email Automation Workflow',
        duration: '15 min',
        thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Build an automated email processing workflow',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Beginner',
      },
      {
        title: 'Data Entry Automation',
        duration: '12 min',
        thumbnail: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Automate repetitive data entry tasks',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Intermediate',
      },
      {
        title: 'Custom Integration Setup',
        duration: '20 min',
        thumbnail: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Create custom integrations with external systems',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Advanced',
      },
      {
        title: 'Workflow Testing & Debugging',
        duration: '18 min',
        thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Learn how to test and debug your workflows effectively',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Intermediate',
      },
      {
        title: 'Advanced Pattern Detection',
        duration: '25 min',
        thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Understand how AI pattern detection works and optimize it',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Advanced',
      },
      {
        title: 'Team Collaboration Features',
        duration: '14 min',
        thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Collaborate with your team on workflow development',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Beginner',
      },
    ],
    templates: [
      {
        id: '1',
        title: 'Client Onboarding',
        category: 'Business Process',
        downloads: 2500,
        description: 'Streamline your client onboarding process with automated welcome emails, document collection, and task assignment.',
        complexity: 'Beginner',
        estimatedTime: '30 minutes',
        tags: ['onboarding', 'email', 'tasks'],
        author: 'WorkflowIQ Team',
        rating: 4.8,
        lastUpdated: '2024-01-15',
      },
      {
        id: '2',
        title: 'Weekly Report Generator',
        category: 'Reporting',
        downloads: 1800,
        description: 'Automated report generation and distribution from multiple data sources.',
        complexity: 'Intermediate',
        estimatedTime: '45 minutes',
        tags: ['reporting', 'data', 'automation'],
        author: 'Sarah Chen',
        rating: 4.6,
        lastUpdated: '2024-01-12',
      },
      {
        id: '3',
        title: 'Invoice Processing',
        category: 'Finance',
        downloads: 3200,
        description: 'Automate invoice handling, approval workflows, and payment tracking.',
        complexity: 'Advanced',
        estimatedTime: '60 minutes',
        tags: ['finance', 'approval', 'tracking'],
        author: 'Michael Rodriguez',
        rating: 4.9,
        lastUpdated: '2024-01-18',
      },
      {
        id: '4',
        title: 'Lead Qualification',
        category: 'Sales',
        downloads: 1950,
        description: 'Automatically score and route leads based on predefined criteria.',
        complexity: 'Intermediate',
        estimatedTime: '40 minutes',
        tags: ['sales', 'leads', 'scoring'],
        author: 'Emily Thompson',
        rating: 4.7,
        lastUpdated: '2024-01-10',
      },
      {
        id: '5',
        title: 'Social Media Scheduler',
        category: 'Marketing',
        downloads: 1650,
        description: 'Schedule and publish content across multiple social media platforms.',
        complexity: 'Beginner',
        estimatedTime: '25 minutes',
        tags: ['social-media', 'content', 'scheduling'],
        author: 'David Kim',
        rating: 4.5,
        lastUpdated: '2024-01-08',
      },
      {
        id: '6',
        title: 'IT Ticket Routing',
        category: 'IT Support',
        downloads: 1420,
        description: 'Automatically categorize and route IT support tickets to appropriate teams.',
        complexity: 'Advanced',
        estimatedTime: '55 minutes',
        tags: ['it-support', 'routing', 'categorization'],
        author: 'Alex Johnson',
        rating: 4.8,
        lastUpdated: '2024-01-14',
      },
    ],
  };

  const handleVideoPlay = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  const handleTemplateUse = (templateId: string) => {
    // Navigate to workflow builder with template
    navigate(`/workflows?template=${templateId}`);
  };

  const renderGettingStartedGuide = () => (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Getting Started with WorkflowIQ</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to WorkflowIQ!</h2>
            <p className="text-gray-600 mb-6">
              This guide will help you get up and running quickly with our AI-powered workflow automation platform.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Start</h3>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li>Create your first workflow using our visual builder</li>
              <li>Connect integrations to your favorite tools</li>
              <li>Set up triggers to start your workflows automatically</li>
              <li>Add actions to perform tasks</li>
              <li>Test and deploy your automation</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Concepts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Workflows</h4>
                <p className="text-sm text-gray-600">Automated sequences of actions triggered by specific events</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Triggers</h4>
                <p className="text-sm text-gray-600">Events that start your workflow execution</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Actions</h4>
                <p className="text-sm text-gray-600">Tasks performed by your workflow</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Integrations</h4>
                <p className="text-sm text-gray-600">Connections to external services and tools</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Your First Workflow</h3>
            <p className="text-gray-600 mb-4">
              Let's create a simple email automation workflow:
            </p>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li>Go to the Workflow Builder</li>
              <li>Drag an "Email Trigger" from the sidebar</li>
              <li>Add a "Create Task" action</li>
              <li>Connect them with an edge</li>
              <li>Configure the trigger and action settings</li>
              <li>Test your workflow</li>
              <li>Save and activate</li>
            </ol>

            <div className="bg-primary-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-primary-800 mb-2">💡 Pro Tip</h4>
              <p className="text-primary-700 text-sm">
                Start with simple workflows and gradually add complexity. Our AI will learn from your patterns and suggest optimizations.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Next Steps</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Explore our template library for pre-built workflows</li>
              <li>Connect your most-used tools in the Integrations section</li>
              <li>Check the Analytics dashboard to track your time savings</li>
              <li>Join our community for tips and best practices</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAPIDocumentation = () => (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">API Documentation</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">WorkflowIQ REST API</h2>
            <p className="text-gray-600 mb-6">
              Integrate WorkflowIQ into your applications using our comprehensive REST API.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Authentication</h3>
            <p className="text-gray-600 mb-4">
              All API requests must include your API key in the X-API-Key header:
            </p>
            <div className="bg-gray-900 p-4 rounded-lg mb-6">
              <code className="text-green-400">X-API-Key: wiq_your_api_key</code>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Base URL</h3>
            <div className="bg-gray-900 p-4 rounded-lg mb-6">
              <code className="text-blue-400">https://api.workflowiq.com/v1</code>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Endpoints</h3>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono mr-2">GET</span>
                  <code className="text-gray-700">/workflows</code>
                </div>
                <p className="text-gray-600 mb-2">List all workflows</p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium text-gray-700 mb-1">Parameters:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><code>status</code> (optional) - Filter by workflow status</li>
                    <li><code>limit</code> (optional) - Number of results to return</li>
                  </ul>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-mono mr-2">POST</span>
                  <code className="text-gray-700">/workflows</code>
                </div>
                <p className="text-gray-600 mb-2">Create a new workflow</p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium text-gray-700 mb-1">Body Parameters:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><code>name</code> (required) - Workflow name</li>
                    <li><code>description</code> (optional) - Workflow description</li>
                    <li><code>config</code> (required) - Workflow configuration</li>
                  </ul>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono mr-2">GET</span>
                  <code className="text-gray-700">/integrations</code>
                </div>
                <p className="text-gray-600 mb-2">List all integrations</p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium text-gray-700 mb-1">Parameters:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><code>type</code> (optional) - Filter by integration type</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">Example Request</h3>
            <div className="bg-gray-900 p-4 rounded-lg mb-6">
              <pre className="text-green-400 text-sm">
{`curl -X GET \\
  -H "X-API-Key: wiq_your_api_key" \\
  -H "Content-Type: application/json" \\
  https://api.workflowiq.com/v1/workflows`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Response Format</h3>
            <div className="bg-gray-900 p-4 rounded-lg mb-6">
              <pre className="text-blue-400 text-sm">
{`{
  "workflows": [
    {
      "id": "wf_123",
      "name": "Email Processor",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}`}
              </pre>
            </div>

            <div className="bg-warning-50 p-4 rounded-lg">
              <h4 className="font-semibold text-warning-800 mb-2">📚 Complete Documentation</h4>
              <p className="text-warning-700 text-sm">
                For the complete API reference with all endpoints, parameters, and examples, visit our{' '}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-warning-700 underline p-0 h-auto"
                  onClick={() => navigate('/api-docs')}
                >
                  detailed API documentation
                </Button>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderIntegrationGuides = () => (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Integration Guides</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Connect Your Favorite Tools</h2>
            <p className="text-gray-600 mb-6">
              Learn how to integrate WorkflowIQ with popular services and tools to create powerful automations.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Popular Integrations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Gmail Integration</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Automate email processing, send notifications, and manage your inbox.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Send automated emails</li>
                  <li>• Process incoming messages</li>
                  <li>• Create tasks from emails</li>
                  <li>• Filter and organize messages</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-3">
                    <Users size={16} className="text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Slack Integration</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Send notifications, create channels, and manage team communication.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Send workflow notifications</li>
                  <li>• Create channels automatically</li>
                  <li>• Post status updates</li>
                  <li>• Manage team alerts</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-3">
                    <FileText size={16} className="text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Google Sheets</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Read and write data, create reports, and manage spreadsheets.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Update spreadsheet data</li>
                  <li>• Generate reports</li>
                  <li>• Create new sheets</li>
                  <li>• Import/export data</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center mr-3">
                    <BarChart size={16} className="text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Salesforce</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Manage leads, update records, and sync customer data.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create and update leads</li>
                  <li>• Sync contact information</li>
                  <li>• Generate sales reports</li>
                  <li>• Manage opportunities</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Setting Up Integrations</h3>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li>Navigate to the Integrations page</li>
              <li>Click "Add New Integration" or select from available options</li>
              <li>Follow the authentication flow for your chosen service</li>
              <li>Configure the integration settings</li>
              <li>Test the connection</li>
              <li>Start using it in your workflows</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Authentication Methods</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">OAuth 2.0</h4>
                <p className="text-sm text-gray-600">
                  Most modern services use OAuth 2.0 for secure authentication. You'll be redirected to the service's login page to authorize WorkflowIQ.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">API Keys</h4>
                <p className="text-sm text-gray-600">
                  Some services require API keys. You'll need to generate these in your service's developer settings and paste them into WorkflowIQ.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Webhooks</h4>
                <p className="text-sm text-gray-600">
                  For real-time triggers, some integrations use webhooks. WorkflowIQ will provide you with webhook URLs to configure in your external services.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Best Practices</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Test integrations thoroughly before deploying workflows</li>
              <li>Use descriptive names for your integrations</li>
              <li>Regularly check integration status and refresh tokens when needed</li>
              <li>Monitor API rate limits to avoid service interruptions</li>
              <li>Keep integration credentials secure and rotate them periodically</li>
            </ul>

            <div className="bg-info-50 p-4 rounded-lg">
              <h4 className="font-semibold text-info-800 mb-2">🔗 Need Help?</h4>
              <p className="text-info-700 text-sm">
                Can't find the integration you need? Contact our support team or check our{' '}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-info-700 underline p-0 h-auto"
                  onClick={() => navigate('/integrations')}
                >
                  integrations marketplace
                </Button>
                {' '}for custom solutions.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-20">
      {/* Documentation Section */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Documentation & Guides
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to get started and master WorkflowIQ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.documentation.map((item, index) => (
            <Card 
              key={index} 
              className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary-300" 
              onClick={() => {
                console.log(`🔍 Card clicked for: ${item.title}`);
                item.link();
              }}
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-center text-primary-600 font-medium">
                  <span>Learn more</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Tutorials Section */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Video Tutorials
          </h2>
          <p className="text-xl text-gray-600">
            Step-by-step video guides to help you build powerful automations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.tutorials.map((tutorial, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]">
              <div className="aspect-video relative cursor-pointer" onClick={() => handleVideoPlay(tutorial.videoUrl)}>
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle size={48} className="text-white" />
                </div>
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-1 bg-black bg-opacity-70 text-white text-sm rounded">
                    {tutorial.duration}
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <div className={`px-2 py-1 text-xs font-medium rounded ${
                    tutorial.category === 'Beginner' ? 'bg-success-100 text-success-700' :
                    tutorial.category === 'Intermediate' ? 'bg-warning-100 text-warning-700' :
                    'bg-danger-100 text-danger-700'
                  }`}>
                    {tutorial.category}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-gray-600 mb-4">{tutorial.description}</p>
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Video size={16} />}
                  onClick={() => handleVideoPlay(tutorial.videoUrl)}
                >
                  Watch Tutorial
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Templates Section */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Workflow Templates
          </h2>
          <p className="text-xl text-gray-600">
            Pre-built workflows to jumpstart your automation journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {resources.templates.slice(0, 6).map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">
                    {template.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-warning-500">★</span>
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {template.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    template.complexity === 'Beginner' ? 'bg-success-100 text-success-700' :
                    template.complexity === 'Intermediate' ? 'bg-warning-100 text-warning-700' :
                    'bg-danger-100 text-danger-700'
                  }`}>
                    {template.complexity}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{template.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{template.downloads.toLocaleString()} uses</span>
                  <span>{template.estimatedTime}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="sm"
                  icon={<Download size={16} />}
                  onClick={() => handleTemplateUse(template.id)}
                >
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setActiveSection('templates')}
          >
            View All Templates
          </Button>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Quick Links
          </h2>
          <p className="text-xl text-gray-600">
            Jump to the most commonly used resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary-300" onClick={() => navigate('/workflows')}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Workflow Builder</h3>
              <p className="text-sm text-gray-600">Create your first automation</p>
            </div>
          </Card>

          <Card className="text-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary-300" onClick={() => navigate('/integrations')}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-success-100 flex items-center justify-center text-success-600 mx-auto mb-4">
                <Settings size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Integrations</h3>
              <p className="text-sm text-gray-600">Connect your tools</p>
            </div>
          </Card>

          <Card className="text-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary-300" onClick={() => navigate('/analytics')}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-warning-100 flex items-center justify-center text-warning-600 mx-auto mb-4">
                <BarChart size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Track your ROI</p>
            </div>
          </Card>

          <Card className="text-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary-300" onClick={() => window.open('mailto:support@workflowiq.com')}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-info-100 flex items-center justify-center text-info-600 mx-auto mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-sm text-gray-600">Get help when needed</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  console.log('🔍 ResourcesPage rendering with activeSection:', activeSection);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Resources | WorkflowIQ</title>
      </Helmet>

      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <BackButton />
          
          {activeSection === 'overview' && (
            <>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Resources & Documentation
                </h1>
                <p className="text-xl text-gray-600">
                  Everything you need to get the most out of WorkflowIQ
                </p>
              </div>
              {renderOverview()}
            </>
          )}

          {activeSection === 'getting-started' && (
            <div>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    console.log('🔍 Back to Resources clicked - setting activeSection to overview');
                    setActiveSection('overview');
                  }}
                  icon={<ArrowLeft size={16} />}
                >
                  Back to Resources
                </Button>
              </div>
              {renderGettingStartedGuide()}
            </div>
          )}

          {activeSection === 'api-docs' && (
            <div>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    console.log('🔍 Back to Resources clicked - setting activeSection to overview');
                    setActiveSection('overview');
                  }}
                  icon={<ArrowLeft size={16} />}
                >
                  Back to Resources
                </Button>
              </div>
              {renderAPIDocumentation()}
            </div>
          )}

          {activeSection === 'integration-guides' && (
            <div>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    console.log('🔍 Back to Resources clicked - setting activeSection to overview');
                    setActiveSection('overview');
                  }}
                  icon={<ArrowLeft size={16} />}
                >
                  Back to Resources
                </Button>
              </div>
              {renderIntegrationGuides()}
            </div>
          )}

          {activeSection === 'templates' && (
            <div>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    console.log('🔍 Back to Resources clicked - setting activeSection to overview');
                    setActiveSection('overview');
                  }}
                  icon={<ArrowLeft size={16} />}
                >
                  Back to Resources
                </Button>
              </div>
              <TemplateLibrary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;