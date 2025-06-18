```typescript
import { supabase } from './supabase';
import { auditService } from './audit';
import { backupService } from './backup';
import { Workflow, User } from '../types';

export class VersionControlService {
  private static instance: VersionControlService;

  private constructor() {}

  static getInstance(): VersionControlService {
    if (!VersionControlService.instance) {
      VersionControlService.instance = new VersionControlService();
    }
    return VersionControlService.instance;
  }

  async createVersion(workflow: Workflow, user: User): Promise<string> {
    try {
      const versionId = crypto.randomUUID();
      const { error } = await supabase.from('workflow_versions').insert({
        id: versionId,
        workflow_id: workflow.id,
        version_number: await this.getNextVersionNumber(workflow.id),
        config: workflow.config,
        created_by: user.id,
        created_at: new Date().toISOString(),
        comment: workflow.config.versionComment || 'Version created',
        hash: this.generateVersionHash(workflow)
      });

      if (error) throw error;

      await auditService.logEvent(
        user.id,
        'workflow_version_created',
        'workflow',
        workflow.id,
        \`Created version for workflow: ${workflow.name}`
      );

      return versionId;
    } catch (error) {
      console.error('Failed to create version:', error);
      throw error;
    }
  }

  async getVersionHistory(workflowId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('workflow_versions')
      .select(`
        *,
        created_by:user_profiles(full_name)
      `)
      .eq('workflow_id', workflowId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data;
  }

  async rollbackToVersion(
    workflowId: string,
    versionId: string,
    user: User
  ): Promise<void> {
    try {
      // Start a transaction
      const { data: version } = await supabase
        .from('workflow_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (!version) throw new Error('Version not found');

      // Create backup before rollback
      await backupService.createBackup(user.organizationId);

      // Update workflow with version config
      const { error: updateError } = await supabase
        .from('workflows')
        .update({
          config: version.config,
          updated_at: new Date().toISOString()
        })
        .eq('id', workflowId);

      if (updateError) throw updateError;

      await auditService.logEvent(
        user.id,
        'workflow_rollback',
        'workflow',
        workflowId,
        \`Rolled back to version ${version.version_number}`
      );
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }

  async compareVersions(
    workflowId: string,
    version1Id: string,
    version2Id: string
  ): Promise<{
    differences: any[];
    summary: string;
  }> {
    const { data: versions } = await supabase
      .from('workflow_versions')
      .select('*')
      .in('id', [version1Id, version2Id]);

    const [v1, v2] = versions;
    const differences = this.findDifferences(v1.config, v2.config);

    return {
      differences,
      summary: this.generateComparisonSummary(differences)
    };
  }

  private async getNextVersionNumber(workflowId: string): Promise<number> {
    const { data } = await supabase
      .from('workflow_versions')
      .select('version_number')
      .eq('workflow_id', workflowId)
      .order('version_number', { ascending: false })
      .limit(1);

    return data?.length ? data[0].version_number + 1 : 1;
  }

  private generateVersionHash(workflow: Workflow): string {
    const content = JSON.stringify(workflow.config);
    return crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(content))
      .then(buffer => {
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      });
  }

  private findDifferences(config1: any, config2: any, path: string[] = []): any[] {
    const differences = [];

    for (const key in config1) {
      const currentPath = [...path, key];
      
      if (!(key in config2)) {
        differences.push({
          path: currentPath.join('.'),
          type: 'removed',
          value: config1[key]
        });
        continue;
      }

      if (typeof config1[key] === 'object' && config1[key] !== null) {
        differences.push(
          ...this.findDifferences(config1[key], config2[key], currentPath)
        );
      } else if (config1[key] !== config2[key]) {
        differences.push({
          path: currentPath.join('.'),
          type: 'modified',
          oldValue: config1[key],
          newValue: config2[key]
        });
      }
    }

    for (const key in config2) {
      if (!(key in config1)) {
        differences.push({
          path: [...path, key].join('.'),
          type: 'added',
          value: config2[key]
        });
      }
    }

    return differences;
  }

  private generateComparisonSummary(differences: any[]): string {
    const counts = {
      added: 0,
      removed: 0,
      modified: 0
    };

    differences.forEach(diff => {
      counts[diff.type]++;
    });

    return \`${counts.added} additions, ${counts.removed} removals, ${counts.modified} modifications`;
  }
}

export const versionControl = VersionControlService.getInstance();
```