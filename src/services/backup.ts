import AWS from 'aws-sdk';
import { supabase } from './supabase';

export class BackupService {
  private static instance: BackupService;
  private s3: AWS.S3;

  private constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      region: import.meta.env.VITE_AWS_REGION
    });
  }

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  async createBackup(organizationId: string): Promise<string> {
    try {
      // Create backup record
      const { data: backup, error: insertError } = await supabase
        .from('organization_backups')
        .insert([{
          organization_id: organizationId,
          status: 'pending',
          backup_path: `backups/${organizationId}/${new Date().toISOString()}.json`
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Fetch organization data
      const { data: orgData, error: fetchError } = await this.fetchOrganizationData(organizationId);
      if (fetchError) throw fetchError;

      // Upload to S3
      await this.uploadToS3(backup.backup_path, JSON.stringify(orgData));

      // Update backup status
      const { error: updateError } = await supabase
        .from('organization_backups')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          size_bytes: Buffer.byteLength(JSON.stringify(orgData))
        })
        .eq('id', backup.id);

      if (updateError) throw updateError;

      return backup.id;
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  }

  async restoreBackup(backupId: string): Promise<void> {
    try {
      const { data: backup, error: fetchError } = await supabase
        .from('organization_backups')
        .select('*')
        .eq('id', backupId)
        .single();

      if (fetchError) throw fetchError;

      // Download from S3
      const backupData = await this.downloadFromS3(backup.backup_path);

      // Restore data
      await this.restoreOrganizationData(backup.organization_id, JSON.parse(backupData));
    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw error;
    }
  }

  private async fetchOrganizationData(organizationId: string) {
    // Fetch all relevant data for the organization
    const tables = [
      'organizations',
      'user_profiles',
      'workflows',
      'integrations',
      'activity_patterns',
      'workflow_executions'
    ];

    const data: Record<string, any> = {};
    let error = null;

    for (const table of tables) {
      const { data: tableData, error: tableError } = await supabase
        .from(table)
        .select('*')
        .eq('organization_id', organizationId);

      if (tableError) {
        error = tableError;
        break;
      }

      data[table] = tableData;
    }

    return { data, error };
  }

  private async uploadToS3(path: string, data: string): Promise<void> {
    await this.s3.putObject({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: path,
      Body: data,
      ContentType: 'application/json'
    }).promise();
  }

  private async downloadFromS3(path: string): Promise<string> {
    const response = await this.s3.getObject({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: path
    }).promise();

    return response.Body.toString();
  }

  private async restoreOrganizationData(organizationId: string, data: any): Promise<void> {
    // Implementation would carefully restore data while maintaining referential integrity
    // This is a simplified version
    const tables = Object.keys(data);
    for (const table of tables) {
      await supabase.from(table).upsert(data[table]);
    }
  }
}

export const backupService = BackupService.getInstance();