import { Integration, Workflow, WorkflowAction } from '../../types';

export interface IntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  scopes?: string[];
  apiKey?: string;
  baseUrl?: string;
  workspace?: string;
  account?: string;
  [key: string]: any;
}

export interface IntegrationAuthConfig {
  type: 'oauth2' | 'api_key' | 'basic';
  config: IntegrationConfig;
}

export interface IntegrationAction {
  id: string;
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  handler: (params: any, integration: Integration) => Promise<any>;
}

export interface IntegrationDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'communication' | 'project_management' | 'crm' | 'calendar' | 'storage' | 'email' | 'other';
  auth: IntegrationAuthConfig;
  actions: IntegrationAction[];
  validateConfig: (config: IntegrationConfig) => Promise<boolean>;
  testConnection: (integration: Integration) => Promise<boolean>;
}

export interface IntegrationHandler {
  definition: IntegrationDefinition;
  initialize: (integration: Integration) => Promise<void>;
  connect: (integration: Integration) => Promise<void>;
  disconnect: (integration: Integration) => Promise<void>;
  executeAction: (action: WorkflowAction, workflow: Workflow) => Promise<any>;
}