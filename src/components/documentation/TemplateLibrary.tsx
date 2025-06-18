```typescript
import React, { useState } from 'react';
import { Search, Filter, Download, Star } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  preview: string;
}

const TemplateLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);

  const templates: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Customer Onboarding',
      description: 'Automate your customer onboarding process with this comprehensive workflow.',
      category: 'Business Process',
      complexity: 'intermediate',
      rating: 4.8,
      downloads: 1250,
      author: {
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      tags: ['onboarding', 'automation', 'customer-service'],
      preview: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    // Add more templates...
  ];

  const categories = [
    'All',
    'Business Process',
    'Customer Service',
    'Sales',
    'Marketing',
    'HR',
    'IT',
    'Finance'
  ];

  const complexityLevels = ['beginner', 'intermediate', 'advanced'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || template.category === selectedCategory;
    const matchesComplexity = !selectedComplexity || template.complexity === selectedComplexity;
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Workflow Templates</h2>
        <Button
          variant="outline"
          icon={<Filter size={16} />}
        >
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="p-4">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={16} className="text-gray-400" />}
              />

              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={\`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Complexity</h3>
                <div className="space-y-2">
                  {complexityLevels.map(level => (
                    <button
                      key={level}
                      className={\`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedComplexity === level
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedComplexity(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-sm font-medium">
                    {template.complexity}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {template.name}
                </h3>
                <p className="text-gray-600 mt-1">{template.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star
                        size={16}
                        className="text-warning-500 fill-warning-500"
                      />
                      <span className="ml-1 text-sm font-medium">
                        {template.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {template.downloads} uses
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download size={16} />}
                  >
                    Use Template
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={template.author.avatar}
                      alt={template.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-500">
                      {template.author.name}
                    </span>
                  </div>
                  <div className="text-sm text-primary-600">
                    {template.category}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;
```