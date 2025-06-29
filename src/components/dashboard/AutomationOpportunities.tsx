import React, { useState } from 'react';
import { Zap, Clock, BarChart2, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { mockActivityPatterns } from '../../services/mockData';

const AutomationOpportunities: React.FC = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState(mockActivityPatterns);
  const [loading, setLoading] = useState<string | null>(null);

  const handleCreateAutomation = async (patternId: string) => {
    setLoading(patternId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to workflow builder
      navigate('/workflows');
    } catch (error) {
      console.error('Failed to create automation:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleViewDetails = (patternId: string) => {
    const pattern = opportunities.find(p => p.id === patternId);
    if (pattern) {
      alert(`Pattern Details:\n\nName: ${pattern.name}\nDescription: ${pattern.description}\nFrequency: ${pattern.frequency}x per week\nConfidence: ${pattern.confidenceScore}%\nTime Saving: ${pattern.potentialTimeSaving} min/week`);
    }
  };

  const handleDismissOpportunity = (patternId: string) => {
    setOpportunities(prev => prev.filter(p => p.id !== patternId));
  };

  const handleViewAllOpportunities = () => {
    alert('View All Opportunities - This would show a detailed list of all automation opportunities');
  };

  if (opportunities.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Automation Opportunities</h2>
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <Zap size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Opportunities Found</h3>
            <p className="text-gray-500 mb-6">
              Our AI is analyzing your workflow patterns. Check back soon for automation suggestions.
            </p>
            <Button onClick={() => navigate('/workflows')}>
              Create Manual Workflow
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Automation Opportunities</h2>
      <p className="text-gray-600">
        Our AI has identified these patterns in your workflow that could be automated to save time.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map((pattern) => (
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
                <div className="flex items-center space-x-2">
                  <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                    {pattern.confidenceScore}% confidence
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismissOpportunity(pattern.id)}
                    icon={<X size={14} />}
                    title="Dismiss opportunity"
                  />
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDetails(pattern.id)}
              >
                View Details
              </Button>
              <Button 
                size="sm"
                onClick={() => handleCreateAutomation(pattern.id)}
                loading={loading === pattern.id}
                disabled={loading === pattern.id}
                icon={<CheckCircle size={16} />}
              >
                {loading === pattern.id ? 'Creating...' : 'Create Automation'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={handleViewAllOpportunities}
        >
          View All Opportunities
        </Button>
      </div>
    </div>
  );
};

export default AutomationOpportunities;