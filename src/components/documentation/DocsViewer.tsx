import React, { useState } from 'react';
import { Book, Search, ChevronRight, ExternalLink, Copy } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

interface DocsViewerProps {
  section?: string;
}

const DocsViewer: React.FC<DocsViewerProps> = ({ section = 'getting-started' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(section);

  const sections = {
    'getting-started': {
      title: 'Getting Started',
      content: `
# Getting Started with WorkflowIQ

Welcome to WorkflowIQ! This guide will help you get up and running quickly with our workflow automation platform.

## Quick Start

1. Create your first workflow
2. Connect integrations
3. Set up triggers
4. Add actions
5. Test and deploy

## Key Concepts

- **Workflows**: Automated sequences of actions triggered by specific events
- **Triggers**: Events that start your workflow
- **Actions**: Tasks performed by your workflow
- **Integrations**: Connections to external services and tools
      `
    },
    'workflows': {
      title: 'Building Workflows',
      content: `
# Building Workflows

Learn how to create powerful automated workflows using our visual builder.

## Workflow Components

- Triggers
- Actions
- Conditions
- Error Handling
- Variables

## Best Practices

1. Start simple
2. Test thoroughly
3. Monitor performance
4. Handle errors gracefully
      `
    },
    'integrations': {
      title: 'Integrations',
      content: `
# Working with Integrations

Connect your workflows to popular services and tools.

## Available Integrations

- Email Services
- Project Management
- CRM Systems
- Communication Tools
- Cloud Storage

## Authentication

Learn how to securely authenticate with different services.
      `
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4">
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} className="text-gray-400" />}
          />
        </div>

        <nav className="px-2">
          {Object.entries(sections).map(([key, { title }]) => (
            <button
              key={key}
              className={\`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeSection === key
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveSection(key)}
            >
              <div className="flex items-center">
                <Book size={16} className="mr-2" />
                <span>{title}</span>
                <ChevronRight
                  size={16}
                  className={\`ml-auto transition-transform ${
                    activeSection === key ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-white p-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <div className="prose max-w-none p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {sections[activeSection].title}
              </h1>

              {sections[activeSection].content.split('\n\n').map((block, index) => {
                if (block.startsWith('```')) {
                  // Code block
                  const code = block.replace(/```/g, '').trim();
                  return (
                    <div key={index} className="relative">
                      <pre className="bg-gray-900 text-white p-4 rounded-lg">
                        <code>{code}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        icon={<Copy size={16} />}
                        onClick={() => handleCopyCode(code)}
                      />
                    </div>
                  );
                } else if (block.startsWith('#')) {
                  // Heading
                  const level = block.match(/^#+/)[0].length;
                  const text = block.replace(/^#+\s/, '');
                  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                  return <Tag key={index} className="mt-6 mb-4">{text}</Tag>;
                } else if (block.startsWith('-')) {
                  // List
                  return (
                    <ul key={index} className="list-disc pl-6 mb-4">
                      {block.split('\n').map((item, i) => (
                        <li key={i}>{item.replace(/^-\s/, '')}</li>
                      ))}
                    </ul>
                  );
                } else if (block.match(/^\d\./)) {
                  // Numbered list
                  return (
                    <ol key={index} className="list-decimal pl-6 mb-4">
                      {block.split('\n').map((item, i) => (
                        <li key={i}>{item.replace(/^\d\.\s/, '')}</li>
                      ))}
                    </ol>
                  );
                } else {
                  // Regular paragraph
                  return <p key={index} className="mb-4">{block}</p>;
                }
              })}
            </div>
          </Card>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <div>Last updated: 2 days ago</div>
            <Button
              variant="ghost"
              size="sm"
              icon={<ExternalLink size={16} />}
              onClick={() => window.open('https://docs.workflowiq.com', '_blank')}
            >
              View Full Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsViewer;