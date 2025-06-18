import React from 'react';
import { Helmet } from 'react-helmet';
import {
  BookOpen,
  Video,
  FileText,
  Users,
  ArrowRight,
  PlayCircle,
  Download,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import BackButton from '../components/common/BackButton';
import Navbar from '../components/landing/Navbar';

const ResourcesPage: React.FC = () => {
  const resources = {
    documentation: [
      {
        title: 'Getting Started Guide',
        description: 'Learn the basics of WorkflowIQ and set up your first automation',
        icon: <BookOpen size={24} />,
        link: '#',
      },
      {
        title: 'API Documentation',
        description: 'Detailed API reference for developers',
        icon: <FileText size={24} />,
        link: '#',
      },
      {
        title: 'Integration Guides',
        description: 'Connect WorkflowIQ with your favorite tools',
        icon: <Users size={24} />,
        link: '#',
      },
    ],
    tutorials: [
      {
        title: 'Email Automation Workflow',
        duration: '15 min',
        thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Build an automated email processing workflow',
      },
      {
        title: 'Data Entry Automation',
        duration: '12 min',
        thumbnail: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Automate repetitive data entry tasks',
      },
      {
        title: 'Custom Integration Setup',
        duration: '20 min',
        thumbnail: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Create custom integrations with external systems',
      },
    ],
    templates: [
      {
        title: 'Client Onboarding',
        category: 'Business Process',
        downloads: 2500,
        description: 'Streamline your client onboarding process',
      },
      {
        title: 'Weekly Report Generator',
        category: 'Reporting',
        downloads: 1800,
        description: 'Automated report generation and distribution',
      },
      {
        title: 'Invoice Processing',
        category: 'Finance',
        downloads: 3200,
        description: 'Automate invoice handling and approval',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Resources | WorkflowIQ</title>
      </Helmet>

      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <BackButton />
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Resources & Documentation
            </h1>
            <p className="text-xl text-gray-600">
              Everything you need to get the most out of WorkflowIQ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {resources.documentation.map((item) => (
              <Card key={item.title} className="hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    View Documentation
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Video Tutorials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {resources.tutorials.map((tutorial) => (
                <Card key={tutorial.title} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <PlayCircle size={48} className="text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">
                        {tutorial.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {tutorial.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{tutorial.description}</p>
                    <Button
                      variant="outline"
                      fullWidth
                      icon={<Video size={16} />}
                    >
                      Watch Tutorial
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Workflow Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {resources.templates.map((template) => (
                <Card key={template.title}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">
                        {template.title}
                      </h3>
                      <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">
                        {template.downloads.toLocaleString()} downloads
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      fullWidth
                      icon={<Download size={16} />}
                    >
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;