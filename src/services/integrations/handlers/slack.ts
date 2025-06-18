import { Integration, Workflow, WorkflowAction } from '../../../types';
import { IntegrationHandler, IntegrationDefinition } from '../types';
import { MessageSquare } from 'lucide-react';

const slackDefinition: IntegrationDefinition = {
  id: 'slack',
  name: 'Slack',
  description: 'Send messages and interact with Slack channels',
  icon: 'message-square',
  category: 'communication',
  auth: {
    type: 'oauth2',
    config: {
      clientId: import.meta.env.VITE_SLACK_CLIENT_ID,
      clientSecret: import.meta.env.VITE_SLACK_CLIENT_SECRET,
      scopes: ['chat:write', 'channels:read', 'channels:history'],
      redirectUri: `${window.location.origin}/integrations/slack/callback`
    }
  },
  actions: [
    {
      id: 'send_message',
      name: 'Send Message',
      description: 'Send a message to a Slack channel',
      inputSchema: {
        channel: { type: 'string', required: true },
        message: { type: 'string', required: true },
        attachments: { type: 'array', required: false }
      },
      outputSchema: {
        messageId: { type: 'string' },
        timestamp: { type: 'string' }
      },
      handler: async (params, integration) => {
        const response = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${integration.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            channel: params.channel,
            text: params.message,
            attachments: params.attachments
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send Slack message');
        }

        return response.json();
      }
    }
  ],
  validateConfig: async (config) => {
    return Boolean(config.accessToken && config.workspace);
  },
  testConnection: async (integration) => {
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: {
          'Authorization': `Bearer ${integration.config.accessToken}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};

export class SlackIntegrationHandler implements IntegrationHandler {
  definition = slackDefinition;

  async initialize(integration: Integration): Promise<void> {
    // Initialize any necessary clients or state
  }

  async connect(integration: Integration): Promise<void> {
    // Implement OAuth flow or API key validation
    // Update integration status and config in database
  }

  async disconnect(integration: Integration): Promise<void> {
    // Revoke tokens and clean up
    // Update integration status in database
  }

  async executeAction(action: WorkflowAction, workflow: Workflow): Promise<any> {
    const actionDef = this.definition.actions.find(a => a.id === action.type);
    if (!actionDef) {
      throw new Error(`Unsupported Slack action: ${action.type}`);
    }
    return actionDef.handler(action.config, workflow);
  }
}