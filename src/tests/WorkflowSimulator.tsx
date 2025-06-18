import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Workflow, WorkflowExecution } from '../types';

interface WorkflowSimulatorProps {
  workflow: Workflow;
  testCases: WorkflowTestCase[];
  onComplete: (results: TestResults) => void;
}

interface WorkflowTestCase {
  id: string;
  name: string;
  description: string;
  inputs: Record<string, any>;
  expectedOutputs: Record<string, any>;
  timeout?: number;
}

interface TestResults {
  testCaseId: string;
  passed: boolean;
  executionTime: number;
  outputs: Record<string, any>;
  error?: string;
}

const WorkflowSimulator: React.FC<WorkflowSimulatorProps> = ({
  workflow,
  testCases,
  onComplete
}) => {
  const [currentTest, setCurrentTest] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResults[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isRunning) {
      runTestCase(testCases[currentTest]);
    }
  }, [isRunning, currentTest]);

  const runTestCase = async (testCase: WorkflowTestCase) => {
    try {
      const startTime = Date.now();
      const execution = await simulateWorkflowExecution(workflow, testCase.inputs);
      const executionTime = Date.now() - startTime;

      const passed = validateOutputs(execution.outputs, testCase.expectedOutputs);
      const result: TestResults = {
        testCaseId: testCase.id,
        passed,
        executionTime,
        outputs: execution.outputs
      };

      setResults(prev => [...prev, result]);
      setProgress((currentTest + 1) / testCases.length * 100);

      if (currentTest < testCases.length - 1) {
        setCurrentTest(prev => prev + 1);
      } else {
        setIsRunning(false);
        onComplete(results);
      }
    } catch (error) {
      setResults(prev => [
        ...prev,
        {
          testCaseId: testCase.id,
          passed: false,
          executionTime: 0,
          outputs: {},
          error: error.message
        }
      ]);
      setIsRunning(false);
    }
  };

  const simulateWorkflowExecution = async (
    workflow: Workflow,
    inputs: Record<string, any>
  ): Promise<WorkflowExecution> => {
    // Simulate workflow execution with provided inputs
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'test-execution',
          workflowId: workflow.id,
          status: 'success',
          outputs: { result: 'simulated output' },
          executionTime: 1000,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });
  };

  const validateOutputs = (
    actual: Record<string, any>,
    expected: Record<string, any>
  ): boolean => {
    return JSON.stringify(actual) === JSON.stringify(expected);
  };

  const handleStart = () => {
    setResults([]);
    setCurrentTest(0);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setResults([]);
    setCurrentTest(0);
    setIsRunning(false);
    setProgress(0);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Workflow Test Simulator
          </h2>
          <div className="flex space-x-2">
            {!isRunning ? (
              <Button
                variant="primary"
                size="sm"
                icon={<Play size={16} />}
                onClick={handleStart}
              >
                Run Tests
              </Button>
            ) : (
              <Button
                variant="warning"
                size="sm"
                icon={<Pause size={16} />}
                onClick={handlePause}
              >
                Pause
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw size={16} />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary-200 text-primary-600">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
            <motion.div
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={result.testCaseId}
              className={`p-4 rounded-lg border ${
                result.passed
                  ? 'border-success-200 bg-success-50'
                  : 'border-danger-200 bg-danger-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.passed ? (
                    <CheckCircle
                      size={20}
                      className="text-success-500"
                    />
                  ) : (
                    <AlertCircle
                      size={20}
                      className="text-danger-500"
                    />
                  )}
                  <span className="font-medium">
                    Test Case {index + 1}: {testCases[index].name}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {result.executionTime}ms
                </span>
              </div>
              {result.error && (
                <p className="mt-2 text-sm text-danger-600">
                  Error: {result.error}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WorkflowSimulator;