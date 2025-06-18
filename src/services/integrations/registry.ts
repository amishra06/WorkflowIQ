import { IntegrationHandler } from './types';
import { SlackIntegrationHandler } from './handlers/slack';
import { GoogleIntegrationHandler } from './handlers/google';

class IntegrationRegistry {
  private static instance: IntegrationRegistry;
  private handlers: Map<string, IntegrationHandler> = new Map();

  private constructor() {
    this.registerDefaultHandlers();
  }

  static getInstance(): IntegrationRegistry {
    if (!IntegrationRegistry.instance) {
      IntegrationRegistry.instance = new IntegrationRegistry();
    }
    return IntegrationRegistry.instance;
  }

  private registerDefaultHandlers(): void {
    this.registerHandler(new SlackIntegrationHandler());
    this.registerHandler(new GoogleIntegrationHandler());
  }

  registerHandler(handler: IntegrationHandler): void {
    this.handlers.set(handler.definition.id, handler);
  }

  getHandler(integrationId: string): IntegrationHandler {
    const handler = this.handlers.get(integrationId);
    if (!handler) {
      throw new Error(`No handler found for integration: ${integrationId}`);
    }
    return handler;
  }

  getAllDefinitions() {
    return Array.from(this.handlers.values()).map(handler => handler.definition);
  }
}

export const integrationRegistry = IntegrationRegistry.getInstance();