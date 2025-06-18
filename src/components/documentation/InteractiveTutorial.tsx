```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action: string;
  hint?: string;
  validation: () => boolean;
}

interface InteractiveTutorialProps {
  tutorial: {
    id: string;
    name: string;
    description: string;
    steps: TutorialStep[];
  };
  onComplete: () => void;
}

const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  tutorial,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }

    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const validateStep = (step: TutorialStep) => {
    if (step.validation()) {
      handleStepComplete(step.id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {tutorial.name}
              </h2>
              <p className="text-gray-600 mt-1">{tutorial.description}</p>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {tutorial.steps.length}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-gray-200" />
            <div className="space-y-6">
              {tutorial.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={\`relative pl-10 ${
                    index < currentStep ? 'opacity-50' : ''
                  }`}
                >
                  <div
                    className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      completedSteps.includes(step.id)
                        ? 'bg-success-100'
                        : index === currentStep
                        ? 'bg-primary-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle
                        size={16}
                        className="text-success-500"
                      />
                    ) : (
                      <span
                        className={
                          index === currentStep
                            ? 'text-primary-600'
                            : 'text-gray-400'
                        }
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{step.description}</p>

                    {index === currentStep && (
                      <div className="mt-4 space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">
                            Action Required:
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {step.action}
                          </p>
                        </div>

                        {step.hint && (
                          <div className="bg-primary-50 p-4 rounded-lg">
                            <p className="text-sm text-primary-700">
                              💡 Hint: {step.hint}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="primary"
                          icon={<Play size={16} />}
                          onClick={() => validateStep(step)}
                        >
                          Complete Step
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {completedSteps.length === tutorial.steps.length && (
        <Card className="bg-success-50 border-success-100">
          <div className="p-6">
            <h3 className="text-lg font-medium text-success-700">
              🎉 Tutorial Completed!
            </h3>
            <p className="text-success-600 mt-1">
              Great job! You've completed all the steps in this tutorial.
            </p>
            <Button
              variant="success"
              className="mt-4"
              icon={<ArrowRight size={16} />}
              onClick={onComplete}
            >
              Continue Learning
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InteractiveTutorial;
```