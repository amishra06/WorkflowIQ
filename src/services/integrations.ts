import { Integration, WorkflowAction, Workflow } from '../types';
import { updateIntegration } from './supabase';

interface IntegrationHandler {
  connect: (integration: Integration) => Promise<void>;
  disconnect: (integration: Integration) => Promise<void>;
  executeAction: (action: WorkflowAction, workflow: Workflow) => Promise<void>;
}

const handlers: Record<string, IntegrationHandler> = {
  email: {
    connect: async (integration) => {
      // Implementation for email integration connection
      await updateIntegration(integration.id, {
        status: 'connected',
        lastSyncedAt: new Date().toISOString(),
      });
    },
    disconnect: async (integration) => {
      await updateIntegration(integration.id, {
        status: 'disconnected',
        config: {},
      });
    },
    executeAction: async (action) => {
      switch (action.type) {
        case 'send-email':
          // Implementation for sending emails
          break;
        case 'read-email':
          // Implementation for reading emails
          break;
        default:
          throw new Error(`Unsupported email action: ${action.type}`);
      }
    },
  },
  slack: {
    connect: async (integration) => {
      // Implementation for Slack integration connection
      await updateIntegration(integration.id, {
        status: 'connected',
        lastSyncedAt: new Date().toISOString(),
      });
    },
    disconnect: async (integration) => {
      await updateIntegration(integration.id, {
        status: 'disconnected',
        config: {},
      });
    },
    executeAction: async (action) => {
      switch (action.type) {
        case 'send-message':
          // Implementation for sending Slack messages
          break;
        default:
          throw new Error(`Unsupported Slack action: ${action.type}`);
      }
    },
  },
  // Add more integration handlers here
};

export const executeIntegrationAction = async (
  action: WorkflowAction,
  workflow: Workflow
): Promise<void> => {
  const handler = handlers[action.type.split('-')[0]];
  if (!handler) {
    throw new Error(`No handler found for action type: ${action.type}`);
  }
  await handler.executeAction(action, workflow);
};

export const connectIntegration = async (integration: Integration): Promise<void> => {
  const handler = handlers[integration.type];
  if (!handler) {
    throw new Error(`No handler found for integration type: ${integration.type}`);
  }
  await handler.connect(integration);
};

export const disconnectIntegration = async (integration: Integration): Promise<void> => {
  const handler = handlers[integration.type];
  if (!handler) {
    throw new Error(`No handler found for integration type: ${integration.type}`);
  }
  await handler.disconnect(integration);
};