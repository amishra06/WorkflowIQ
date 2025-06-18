import { z } from 'zod';

// Workflow condition types
export const conditionTypeSchema = z.enum(['if', 'switch', 'loop', 'try_catch']);

export const conditionOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'greater_than',
  'less_than',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'is_empty',
  'is_not_empty',
  'matches_regex'
]);

export const conditionSchema = z.object({
  id: z.string(),
  type: conditionTypeSchema,
  operator: conditionOperatorSchema.optional(),
  value: z.any(),
  target: z.string().optional(),
  cases: z.array(z.object({
    value: z.any(),
    actions: z.array(z.any())
  })).optional(),
  maxIterations: z.number().optional(),
  errorHandler: z.object({
    retryCount: z.number(),
    retryDelay: z.number(),
    fallbackAction: z.any()
  }).optional()
});

export type WorkflowCondition = z.infer<typeof conditionSchema>;

// Error handling types
export interface ErrorHandler {
  retryCount: number;
  retryDelay: number; // in milliseconds
  fallbackAction?: WorkflowAction;
  errorCallback?: (error: Error) => Promise<void>;
}

// Workflow execution context
export interface ExecutionContext {
  variables: Record<string, any>;
  results: Record<string, any>;
  errors: Error[];
  startTime: number;
  retryCount: number;
}

// Workflow validation schema
export const workflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  version: z.number().default(1),
  triggers: z.array(z.any()),
  actions: z.array(z.any()),
  conditions: z.array(conditionSchema).optional(),
  errorHandler: z.object({
    retryCount: z.number(),
    retryDelay: z.number(),
    fallbackAction: z.any().optional()
  }).optional(),
  timeout: z.number().optional(), // in milliseconds
  variables: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional()
});

export type WorkflowDefinition = z.infer<typeof workflowSchema>;