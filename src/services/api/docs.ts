import { OpenAPIV3 } from 'openapi-types';

export const apiSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'WorkflowIQ API',
    version: '1.0.0',
    description: 'API for automating workflows and managing integrations',
  },
  servers: [
    {
      url: 'https://api.workflowiq.com/v1',
      description: 'Production API server',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
      },
    },
    schemas: {
      Workflow: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['active', 'inactive', 'draft'] },
          config: { type: 'object' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'status'],
      },
      Integration: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string', enum: ['connected', 'disconnected', 'error'] },
          config: { type: 'object' },
        },
        required: ['id', 'name', 'type', 'status'],
      },
    },
  },
  paths: {
    '/workflows': {
      get: {
        summary: 'List workflows',
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['active', 'inactive', 'draft'] },
          },
        ],
        responses: {
          '200': {
            description: 'List of workflows',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Workflow' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create workflow',
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Workflow' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Workflow created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Workflow' },
              },
            },
          },
        },
      },
    },
    '/workflows/{id}': {
      get: {
        summary: 'Get workflow by ID',
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Workflow details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Workflow' },
              },
            },
          },
        },
      },
    },
    '/integrations': {
      get: {
        summary: 'List integrations',
        security: [{ ApiKeyAuth: [] }],
        responses: {
          '200': {
            description: 'List of integrations',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Integration' },
                },
              },
            },
          },
        },
      },
    },
  },
};