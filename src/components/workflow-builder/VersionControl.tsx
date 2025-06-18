```typescript
import React, { useState, useEffect } from 'react';
import { 
  History, 
  GitCompare, 
  RotateCcw, 
  ChevronRight,
  Plus,
  Check
} from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { versionControl } from '../../services/versionControl';
import { useAuth } from '../../context/AuthContext';
import { Workflow } from '../../types';

interface VersionControlProps {
  workflow: Workflow;
  onVersionChange: (version: any) => void;
}

const VersionControl: React.FC<VersionControlProps> = ({
  workflow,
  onVersionChange
}) => {
  const { user } = useAuth();
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersion, setCompareVersion] = useState<string | null>(null);
  const [differences, setDifferences] = useState<any[] | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadVersionHistory();
  }, [workflow.id]);

  const loadVersionHistory = async () => {
    try {
      const history = await versionControl.getVersionHistory(workflow.id);
      setVersions(history);
    } catch (error) {
      console.error('Failed to load version history:', error);
    }
  };

  const handleCreateVersion = async () => {
    try {
      const updatedWorkflow = {
        ...workflow,
        config: {
          ...workflow.config,
          versionComment: comment
        }
      };
      await versionControl.createVersion(updatedWorkflow, user);
      await loadVersionHistory();
      setComment('');
    } catch (error) {
      console.error('Failed to create version:', error);
    }
  };

  const handleRollback = async () => {
    if (!selectedVersion) return;

    try {
      await versionControl.rollbackToVersion(workflow.id, selectedVersion, user);
      const version = versions.find(v => v.id === selectedVersion);
      onVersionChange(version.config);
    } catch (error) {
      console.error('Failed to rollback:', error);
    }
  };

  const handleCompare = async () => {
    if (!selectedVersion || !compareVersion) return;

    try {
      const comparison = await versionControl.compareVersions(
        workflow.id,
        selectedVersion,
        compareVersion
      );
      setDifferences(comparison.differences);
    } catch (error) {
      console.error('Failed to compare versions:', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Version Control</h2>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={handleCreateVersion}
          >
            Create Version
          </Button>
        </div>

        <div className="space-y-4">
          <textarea
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Version comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
          />

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={<GitCompare size={16} />}
              onClick={() => setCompareMode(!compareMode)}
            >
              Compare
            </Button>
            {selectedVersion && (
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw size={16} />}
                onClick={handleRollback}
              >
                Rollback
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className={\`p-4 rounded-lg border transition-colors cursor-pointer ${
                selectedVersion === version.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              onClick={() => {
                if (compareMode && selectedVersion) {
                  setCompareVersion(version.id);
                  handleCompare();
                } else {
                  setSelectedVersion(version.id);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <History size={16} className="text-gray-500" />
                  <span className="font-medium">
                    Version {version.version_number}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(version.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{version.comment}</p>
              <div className="mt-2 text-xs text-gray-500">
                Created by {version.created_by.full_name}
              </div>
            </div>
          ))}
        </div>

        {differences && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-gray-900">Version Differences</h3>
            {differences.map((diff, index) => (
              <div
                key={index}
                className={\`p-3 rounded-lg ${
                  diff.type === 'added'
                    ? 'bg-success-50 border-success-200'
                    : diff.type === 'removed'
                    ? 'bg-danger-50 border-danger-200'
                    : 'bg-warning-50 border-warning-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{diff.path}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="text-sm">
                    {diff.type === 'modified'
                      ? \`${diff.oldValue} → ${diff.newValue}`
                      : diff.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VersionControl;
```