import React, { useState } from 'react';
import { Search, Star, Download, Filter, Grid, List } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rating: number;
  downloads: number;
  author: string;
  verified: boolean;
  templates: number;
}

const categories = [
  'All',
  'Communication',
  'Project Management',
  'CRM',
  'Analytics',
  'Storage',
  'Email',
  'Calendar',
  'Other'
];

const IntegrationMarketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Slack',
      description: 'Automate your team communications and notifications with Slack integration.',
      icon: 'message-square',
      category: 'Communication',
      rating: 4.8,
      downloads: 15000,
      author: 'WorkflowIQ',
      verified: true,
      templates: 12
    },
    // Add more integrations...
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Integration Marketplace</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            icon={<Grid size={16} />}
            onClick={() => setViewMode('grid')}
          />
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            icon={<List size={16} />}
            onClick={() => setViewMode('list')}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <Card>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
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
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Sort By</h3>
              <div className="space-y-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sortBy === 'popular' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setSortBy('popular')}
                >
                  Most Popular
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sortBy === 'rating' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setSortBy('rating')}
                >
                  Highest Rated
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sortBy === 'newest' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setSortBy('newest')}
                >
                  Newest
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="mb-6">
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} className="text-gray-400" />}
            />
          </div>

          <div className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          }`}>
            {filteredIntegrations.map(integration => (
              <Card key={integration.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`p-6 ${viewMode === 'list' ? 'flex items-start space-x-4' : ''}`}>
                  <div className={viewMode === 'list' ? 'flex-shrink-0' : ''}>
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                      <integration.icon size={24} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {integration.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {integration.description}
                        </p>
                      </div>
                      {integration.verified && (
                        <div className="ml-2 px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded">
                          Verified
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star
                            size={16}
                            className="text-warning-500 fill-warning-500"
                          />
                          <span className="ml-1 text-sm font-medium">
                            {integration.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {integration.downloads.toLocaleString()} installs
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Download size={16} />}
                      >
                        Install
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        By {integration.author}
                      </span>
                      <span className="text-primary-600">
                        {integration.templates} templates
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationMarketplace;