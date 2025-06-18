import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Zap, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Brain
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { realTimeDetection, RealTimePattern } from '../../services/patternDetection/realTimeDetection';
import { useAuth } from '../../context/AuthContext';

interface SmartSuggestionsProps {
  limit?: number;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ limit = 3 }) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<RealTimePattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    loadSuggestions();
    
    // Subscribe to real-time suggestions
    const unsubscribe = realTimeDetection.subscribeToPatternSuggestions(
      user.organizationId,
      (pattern) => {
        setSuggestions(prev => [pattern, ...prev].slice(0, limit));
      }
    );

    return unsubscribe;
  }, [user, limit]);

  const loadSuggestions = async () => {
    try {
      // Load existing suggestions from database
      // This would typically fetch from pattern_suggestions table
      setLoading(false);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = async (suggestion: RealTimePattern) => {
    if (!user) return;
    
    try {
      await realTimeDetection.acceptSuggestion(suggestion.id, user.id);
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    } catch (error) {
      console.error('Failed to accept suggestion:', error);
    }
  };

  const handleRejectSuggestion = async (suggestion: RealTimePattern) => {
    if (!user) return;
    
    try {
      await realTimeDetection.rejectSuggestion(suggestion.id, user.id);
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    } catch (error) {
      console.error('Failed to reject suggestion:', error);
    }
  };

  const getPatternIcon = (patternType: string) => {
    switch (patternType) {
      case 'repetitive-data-entry':
        return <Zap className="text-warning-500" size={20} />;
      case 'weekly-reporting':
        return <TrendingUp className="text-primary-500" size={20} />;
      case 'end-of-day-routine':
        return <Clock className="text-info-500" size={20} />;
      default:
        return <Brain className="text-primary-500" size={20} />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-success-600 bg-success-100';
    if (confidence >= 0.7) return 'text-warning-600 bg-warning-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <Card title="AI Suggestions" className="h-full">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Lightbulb className="text-primary-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">AI Suggestions</h2>
          </div>
          {suggestions.length > 0 && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
              {suggestions.length} new
            </span>
          )}
        </div>

        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No suggestions yet
            </h3>
            <p className="text-gray-500 text-sm">
              Keep working, and our AI will identify automation opportunities for you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getPatternIcon(suggestion.patternType)}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {suggestion.patternType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                          {(suggestion.confidence * 100).toFixed(0)}% confidence
                        </span>
                        <span className="text-xs text-gray-500">
                          {suggestion.prediction.implementationComplexity} complexity
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Save <strong>{suggestion.prediction.potentialTimeSaving} minutes per week</strong> by 
                  automating this {suggestion.patternType.replace('-', ' ')} pattern.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Risk: {(suggestion.prediction.riskAssessment.technicalFeasibility * 100).toFixed(0)}% feasible</span>
                    <span>Activities: {suggestion.activities.length}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<XCircle size={14} />}
                      onClick={() => handleRejectSuggestion(suggestion)}
                    >
                      Dismiss
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<CheckCircle size={14} />}
                      onClick={() => handleAcceptSuggestion(suggestion)}
                    >
                      Create Workflow
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {suggestions.length >= limit && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  View All Suggestions
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SmartSuggestions;