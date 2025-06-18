import React from 'react';
import { Zap, Clock, BarChart2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { mockActivityPatterns } from '../../services/mockData';

const AutomationOpportunities: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Automation Opportunities</h2>
      <p className="text-gray-600">
        Our AI has identified these patterns in your workflow that could be automated to save time.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockActivityPatterns.map((pattern) => (
          <Card key={pattern.id} variant="bordered" className="overflow-hidden">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                      <Zap size={20} />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">{pattern.name}</h3>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm">{pattern.description}</p>
                </div>
                <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                  {pattern.confidenceScore}% confidence
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Clock size={14} className="mr-1" />
                    <span>Frequency</span>
                  </div>
                  <p className="font-medium">{pattern.frequency}x per week</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Clock size={14} className="mr-1" />
                    <span>Time Savings</span>
                  </div>
                  <p className="font-medium">{pattern.potentialTimeSaving} min/week</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <BarChart2 size={14} className="mr-1" />
                    <span>Last Detected</span>
                  </div>
                  <p className="font-medium">
                    {new Date(pattern.lastDetectedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button size="sm">Create Automation</Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" className="mt-2">
          View All Opportunities
        </Button>
      </div>
    </div>
  );
};

export default AutomationOpportunities;