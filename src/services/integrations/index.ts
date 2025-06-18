import { Integration, Workflow, WorkflowAction } from '../../types';
import { integrationRegistry } from './registry';
import { supabase } from '../supabase';
import { auditService } from '../audit';

export class IntegrationService {
  private static instance: IntegrationService;

  private constructor() {}

  static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  async connectIntegration(integration: Integration): Promise<void> {
    try {
      const handler = integrationRegistry.getHandler(integration.type);
      await handler.connect(integration);

      // Update integration status
      const { error } = await supabase
        .from('integrations')
        .update({
          status: 'connected',
          last_synced_at: new Date().toISOString()
        })
        .eq('id', integration.id);

      if (error) throw error;

      // Log audit event
      await auditService.logEvent(
        integration.userId,
        'integration_connected',
        'integration',
        integration.id,
        `Connected ${integration.name} integration`
      );
    } catch (error) {
      console.error(`Failed to connect integration ${integration.id}:`, error);
      throw error;
    }
  }

  async disconnectIntegration(integration: Integration): Promise<void> {
    try {
      const handler = integrationRegistry.getHandler(integration.type);
      await handler.disconnect(integration);

      // Update integration status
      const { error } = await supabase
        .from('integrations')
        .update({
          status: 'disconnected',
          config: {}
        })
        .eq('id', integration.id);

      if (error) throw error;

      // Log audit event
      await auditService.logEvent(
        integration.userId,
        'integration_disconnected',
        'integration',
        integration.id,
        `Disconnected ${integration.name} integration`
      );
    } catch (error) {
      console.error(`Failed to disconnect integration ${integration.id}:`, error);
      throw error;
    }
  }

  async executeAction(action: WorkflowAction, workflow: Workflow): Promise<any> {
    try {
      const integration = await this.getIntegrationForAction(action);
      const handler = integrationRegistry.getHandler(integration.type);

      // Initialize handler if needed
      await handler.initialize(integration);

      // Execute the action
      const result = await handler.executeAction(action, workflow);

      // Log successful execution
      await auditService.logEvent(
        workflow.userId,
        'integration_action_executed',
        'workflow_action',
        action.id,
        `Executed ${action.type} action in workflow ${workflow.id}`
      );

      return result;
    } catch (error) {
      console.error(`Failed to execute action ${action.id}:`, error);
      throw error;
    }
  }

  private async getIntegrationForAction(action: WorkflowAction): Promise<Integration> {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('type', action.type.split('_')[0])
      .eq('status', 'connected')
      .single();

    if (error || !data) {
      throw new Error(`No active integration found for action type: ${action.type}`);
    }

    return data as Integration;
  }

  async getAvailableIntegrations() {
    return integrationRegistry.getAllDefinitions();
  }

  async validateIntegration(integration: Integration): Promise<boolean> {
    try {
      const handler = integrationRegistry.getHandler(integration.type);
      return await handler.definition.testConnection(integration);
    } catch {
      return false;
    }
  }
}

export const integrationService = IntegrationService.getInstance();