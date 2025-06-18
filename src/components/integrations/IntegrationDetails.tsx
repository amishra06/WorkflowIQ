import React, { useState } from 'react';
import { Star, Download, ArrowLeft, Code, Book, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

interface IntegrationDetailsProps {
  integration: any;
  onBack: () => void;
}

const IntegrationDetails: React.FC<IntegrationDetailsProps> = ({
  integration,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'templates' | 'reviews'>('overview');

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        icon={<ArrowLeft size={16} />}
        onClick={onBack}
      >
        Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                  <integration.icon size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {integration.name}
                      </h1>
                      <p className="text-gray-600 mt-1">
                        {integration.description}
                      </p>
                    </div>
                    {integration.verified && (
                      <div className="px-3 py-1 bg-success-100 text-success-700 text-sm font-medium rounded-full">
                        Verified
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center space-x-6">
                    <div className="flex items-center">
                      <Star size={18} className="text-warning-500 fill-warning-500" />
                      <span className="ml-1 font-medium">{integration.rating}</span>
                      <span className="ml-1 text-gray-500">
                        ({integration.reviewCount} reviews)
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {integration.downloads.toLocaleString()} installs
                    </span>
                    <span className="text-gray-500">
                      Updated {integration.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="border-b border-gray-200">
              <div className="flex space-x-6">
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'docs'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('docs')}
                >
                  Documentation
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'templates'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('templates')}
                >
                  Templates
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="prose max-w-none">
                  <h2>Features</h2>
                  <ul>
                    {integration.features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>

                  <h2>Use Cases</h2>
                  <ul>
                    {integration.useCases.map((useCase: string, index: number) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="prose max-w-none">
                  {/* Documentation content */}
                </div>
              )}

              {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Template cards */}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Review list */}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={<Download size={18} />}
              >
                Install Integration
              </Button>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Code size={16} />
                  <span>API Documentation</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Book size={16} />
                  <span>Getting Started Guide</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MessageSquare size={16} />
                  <span>Community Support</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-4">About the Author</h3>
              <div className="flex items-center space-x-3">
                <img
                  src={integration.author.avatar}
                  alt={integration.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {integration.author.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {integration.author.integrations} integrations
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntegrationDetails;