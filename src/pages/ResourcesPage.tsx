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
  Mail
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
  const [activeSection, setActiveSection] = useState<'overview' | 'docs' | 'templates'>('overview');

  const resources = {
    documentation: [
      {
        title: 'Getting Started Guide',
        description: 'Learn the basics of WorkflowIQ and set up your first automation',
        icon: <BookOpen size={24} />,
        link: () => setActiveSection('docs'),
        isInternal: true,
      },
      {
        title: 'API Documentation',
        description: 'Detailed API reference for developers',
        icon: <FileText size={24} />,
        link: () => navigate('/api-docs'),
        isInternal: true,
      },
      {
        title: 'Integration Guides',
        description: 'Connect WorkflowIQ with your favorite tools',
        icon: <Users size={24} />,
        link: () => navigate('/integrations'),
        isInternal: true,
      },
    ],
    tutorials: [
      {
        title: 'Email Automation Workflow',
        duration: '15 min',
        thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Build an automated email processing workflow',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder URL
        category: 'Beginner',
      },
      {
        title: 'Data Entry Automation',
        duration: '12 min',
        thumbnail: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Automate repetitive data entry tasks',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder URL
        category: 'Intermediate',
      },
      {
        title: 'Custom Integration Setup',
        duration: '20 min',
        thumbnail: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Create custom integrations with external systems',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder URL
        category: 'Advanced',
      },
      {
        title: 'Workflow Testing & Debugging',
        duration: '18 min',
        thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Learn how to test and debug your workflows effectively',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder URL
        category: 'Intermediate',
      },
      {
        title: 'Advanced Pattern Detection',
        duration: '25 min',
        thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Understand how AI pattern detection works and optimize it',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder URL
        category: 'Advanced',
      },
      {
        title: 'Team Collaboration Features',
        duration: '14 min',
        thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Collaborate with your team on workflow development',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder URL
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
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={item.link}>
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
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
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
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
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
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/workflows')}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Workflow Builder</h3>
              <p className="text-sm text-gray-600">Create your first automation</p>
            </div>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/integrations')}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-success-100 flex items-center justify-center text-success-600 mx-auto mb-4">
                <Settings size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Integrations</h3>
              <p className="text-sm text-gray-600">Connect your tools</p>
            </div>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/analytics')}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-warning-100 flex items-center justify-center text-warning-600 mx-auto mb-4">
                <BarChart size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Track your ROI</p>
            </div>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open('mailto:support@workflowiq.com')}>
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

          {activeSection === 'docs' && (
            <div>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection('overview')}
                  icon={<ArrowRight size={16} className="rotate-180" />}
                >
                  Back to Resources
                </Button>
              </div>
              <DocsViewer section="getting-started" />
            </div>
          )}

          {activeSection === 'templates' && (
            <div>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection('overview')}
                  icon={<ArrowRight size={16} className="rotate-180" />}
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