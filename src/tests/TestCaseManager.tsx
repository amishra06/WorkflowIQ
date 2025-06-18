import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';

interface TestCase {
  id: string;
  name: string;
  description: string;
  inputs: Record<string, any>;
  expectedOutputs: Record<string, any>;
  timeout?: number;
}

interface TestCaseManagerProps {
  workflowId: string;
  onSave: (testCase: TestCase) => void;
  onDelete: (testCaseId: string) => void;
  testCases: TestCase[];
}

const TestCaseManager: React.FC<TestCaseManagerProps> = ({
  workflowId,
  onSave,
  onDelete,
  testCases
}) => {
  const [newTestCase, setNewTestCase] = useState<Partial<TestCase>>({
    name: '',
    description: '',
    inputs: {},
    expectedOutputs: {},
    timeout: 5000
  });

  const [editMode, setEditMode] = useState<string | null>(null);

  const handleInputChange = (field: keyof TestCase, value: any) => {
    setNewTestCase(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJsonInput = (field: 'inputs' | 'expectedOutputs', value: string) => {
    try {
      const parsedValue = JSON.parse(value);
      handleInputChange(field, parsedValue);
    } catch (error) {
      // Handle invalid JSON input
    }
  };

  const handleSave = () => {
    if (!newTestCase.name) return;

    const testCase: TestCase = {
      id: editMode || crypto.randomUUID(),
      name: newTestCase.name,
      description: newTestCase.description || '',
      inputs: newTestCase.inputs || {},
      expectedOutputs: newTestCase.expectedOutputs || {},
      timeout: newTestCase.timeout
    };

    onSave(testCase);
    setNewTestCase({
      name: '',
      description: '',
      inputs: {},
      expectedOutputs: {},
      timeout: 5000
    });
    setEditMode(null);
  };

  const handleEdit = (testCase: TestCase) => {
    setNewTestCase(testCase);
    setEditMode(testCase.id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Case Manager
          </h2>

          <div className="space-y-4">
            <Input
              label="Test Case Name"
              value={newTestCase.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Enter test case name"
            />

            <Input
              label="Description"
              value={newTestCase.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Enter test case description"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Input Data (JSON)
              </label>
              <textarea
                className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={JSON.stringify(newTestCase.inputs, null, 2)}
                onChange={e => handleJsonInput('inputs', e.target.value)}
                placeholder="Enter input data in JSON format"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Expected Output (JSON)
              </label>
              <textarea
                className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={JSON.stringify(newTestCase.expectedOutputs, null, 2)}
                onChange={e => handleJsonInput('expectedOutputs', e.target.value)}
                placeholder="Enter expected output in JSON format"
              />
            </div>

            <Input
              type="number"
              label="Timeout (ms)"
              value={newTestCase.timeout}
              onChange={e => handleInputChange('timeout', parseInt(e.target.value))}
              placeholder="Enter timeout in milliseconds"
            />

            <Button
              variant="primary"
              fullWidth
              icon={<Save size={16} />}
              onClick={handleSave}
            >
              {editMode ? 'Update Test Case' : 'Save Test Case'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {testCases.map(testCase => (
          <Card key={testCase.id}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {testCase.name}
                  </h3>
                  <p className="text-sm text-gray-500">{testCase.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(testCase)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    onClick={() => onDelete(testCase.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestCaseManager;