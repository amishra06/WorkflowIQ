import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, Zap, TrendingUp } from 'lucide-react';
import Button from '../common/Button';
import { realTimeDetection, RealTimePattern } from '../../services/patternDetection/realTimeDetection';
import { useAuth } from '../../context/AuthContext';

interface PatternSuggestionToastProps {
  pattern: RealTimePattern;
  onDismiss: () => void;
  onAccept: () => void;
  onReject: () => void;
}

const PatternSuggestionToast: React.FC<PatternSuggestionToastProps> = ({
  pattern,
  onDismiss,
  onAccept,
  onReject
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds auto-dismiss

  useEffect(() => {
    // Add null check for onDismiss
    if (typeof onDismiss !== 'function') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsVisible(false);
          setTimeout(() => {
            if (typeof onDismiss === 'function') {
              onDismiss();
            }
          }, 300); // Wait for animation
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDismiss]);

  const handleAccept = async () => {
    if (typeof onAccept === 'function') {
      try {
        await onAccept();
        setIsVisible(false);
        setTimeout(() => {
          if (typeof onDismiss === 'function') {
            onDismiss();
          }
        }, 300);
      } catch (error) {
        console.error('Error accepting pattern:', error);
      }
    }
  };

  const handleReject = async () => {
    if (typeof onReject === 'function') {
      try {
        await onReject();
        setIsVisible(false);
        setTimeout(() => {
          if (typeof onDismiss === 'function') {
            onDismiss();
          }
        }, 300);
      } catch (error) {
        console.error('Error rejecting pattern:', error);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (typeof onDismiss === 'function') {
        onDismiss();
      }
    }, 300);
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
        return <Zap className="text-primary-500" size={20} />;
    }
  };

  const getPatternColor = (patternType: string) => {
    switch (patternType) {
      case 'repetitive-data-entry':
        return 'border-warning-200 bg-warning-50';
      case 'weekly-reporting':
        return 'border-primary-200 bg-primary-50';
      case 'end-of-day-routine':
        return 'border-info-200 bg-info-50';
      default:
        return 'border-primary-200 bg-primary-50';
    }
  };

  // Add null check for pattern object
  if (!pattern || !pattern.patternType) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border-2 ${getPatternColor(pattern.patternType)} z-50`}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getPatternIcon(pattern.patternType)}
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    New Automation Opportunity
                  </h3>
                  <p className="text-xs text-gray-500">
                    {pattern.confidence ? (pattern.confidence * 100).toFixed(0) : '0'}% confidence
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-400">{timeLeft}s</span>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">
                We detected a <strong>{pattern.patternType.replace('-', ' ')}</strong> pattern 
                that could save you <strong>
                  {pattern.prediction?.potentialTimeSaving || 'some'} minutes per week
                </strong>.
              </p>
              
              <div className="bg-white/70 rounded-md p-2 text-xs text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Complexity:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    (pattern.prediction?.implementationComplexity || 'medium') === 'low' 
                      ? 'bg-success-100 text-success-700'
                      : (pattern.prediction?.implementationComplexity || 'medium') === 'medium'
                      ? 'bg-warning-100 text-warning-700'
                      : 'bg-danger-100 text-danger-700'
                  }`}>
                    {pattern.prediction?.implementationComplexity || 'medium'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                icon={<CheckCircle size={14} />}
                onClick={handleAccept}
              >
                Create Workflow
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                icon={<XCircle size={14} />}
                onClick={handleReject}
              >
                Not Now
              </Button>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div
                  className="bg-primary-500 h-1 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 30) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface PatternSuggestionManagerProps {}

const PatternSuggestionManager: React.FC<PatternSuggestionManagerProps> = () => {
  const { user } = useAuth();
  const [activePatterns, setActivePatterns] = useState<RealTimePattern[]>([]);

  useEffect(() => {
    // Enhanced null checking to ensure both user and organizationId exist
    if (!user?.organizationId) {
      console.log('User or organizationId not available yet');
      return;
    }

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = realTimeDetection.subscribeToPatternSuggestions(
        user.organizationId,
        (pattern) => {
          // Additional null check for the pattern
          if (pattern && pattern.id) {
            setActivePatterns(prev => [...prev, pattern]);
          }
        }
      );
    } catch (error) {
      console.error('Error subscribing to pattern suggestions:', error);
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.organizationId]); // Use optional chaining in dependency array

  const handleDismiss = (patternId: string) => {
    if (!patternId) return;
    setActivePatterns(prev => prev.filter(p => p?.id !== patternId));
  };

  const handleAccept = async (pattern: RealTimePattern) => {
    if (!user?.id || !pattern?.id) {
      console.error('User ID or pattern ID is missing');
      return;
    }
    
    try {
      await realTimeDetection.acceptSuggestion(pattern.id, user.id);
      setActivePatterns(prev => prev.filter(p => p?.id !== pattern.id));
      
      // Here you could also trigger workflow creation
      console.log('Creating workflow from pattern:', pattern);
    } catch (error) {
      console.error('Failed to accept suggestion:', error);
    }
  };

  const handleReject = async (pattern: RealTimePattern) => {
    if (!user?.id || !pattern?.id) {
      console.error('User ID or pattern ID is missing');
      return;
    }
    
    try {
      await realTimeDetection.rejectSuggestion(
        pattern.id, 
        user.id, 
        'User dismissed the suggestion'
      );
      setActivePatterns(prev => prev.filter(p => p?.id !== pattern.id));
    } catch (error) {
      console.error('Failed to reject suggestion:', error);
    }
  };

  // Don't render anything if user is not loaded
  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
      <div className="space-y-2 p-4 pointer-events-auto">
        {activePatterns.filter(pattern => pattern && pattern.id).map((pattern, index) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            }}
          >
            <PatternSuggestionToast
              pattern={pattern}
              onDismiss={() => handleDismiss(pattern.id)}
              onAccept={() => handleAccept(pattern)}
              onReject={() => handleReject(pattern)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PatternSuggestionManager;