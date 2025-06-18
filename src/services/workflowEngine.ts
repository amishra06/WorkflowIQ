import { nanoid } from 'nanoid';
import { retry } from 'retry';
import jsonata from 'jsonata';
import { 
  Workflow, 
  WorkflowAction, 
  WorkflowTrigger,
  WorkflowExecution,
  WorkflowCondition,
  ExecutionContext,
  ErrorHandler,
  workflowSchema
} from '../types';
import { 
  logWorkflowExecution, 
  updateWorkflow, 
  subscribeToWorkflowUpdates 
} from './supabase';
import { executeIntegrationAction } from './integrations';
import { auditService } from './audit';

export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private activeWorkflows: Map<string, {
    interval: NodeJS.Timeout;
    executionCount: number;
    lastExecutionTime?: number;
    status: 'running' | 'paused' | 'error';
    context: ExecutionContext;
  }> = new Map();
  private executionListeners: Map<string, Set<(execution: WorkflowExecution) => void>> = new Map();

  private constructor() {
    this.setupErrorHandling();
  }

  static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  private setupErrorHandling() {
    process.on('unhandledRejection', (error) => {
      console.error('Unhandled workflow error:', error);
      auditService.logEvent(
        'system',
        'workflow_error',
        'system',
        undefined,
        'Unhandled workflow error',
        { error: error.message }
      );
    });
  }

  async startWorkflow(workflow: Workflow): Promise<void> {
    try {
      // Validate workflow configuration
      const validationResult = workflowSchema.safeParse(workflow.config);
      if (!validationResult.success) {
        throw new Error(`Invalid workflow configuration: ${validationResult.error.message}`);
      }

      if (this.activeWorkflows.has(workflow.id)) {
        return;
      }

      // Initialize execution context
      const context: ExecutionContext = {
        variables: workflow.config.variables || {},
        results: {},
        errors: [],
        startTime: Date.now(),
        retryCount: 0
      };

      // Subscribe to workflow updates
      subscribeToWorkflowUpdates(workflow.id, (update) => {
        if (update.new.status === 'inactive') {
          this.stopWorkflow(workflow.id);
        }
      });

      const interval = setInterval(async () => {
        await this.executeWorkflow(workflow);
      }, this.getTriggerInterval(workflow.config.triggers[0]));

      this.activeWorkflows.set(workflow.id, {
        interval,
        executionCount: 0,
        status: 'running',
        context
      });

      // Log workflow start
      await logWorkflowExecution(
        workflow.id,
        workflow.userId,
        'success',
        0,
        'Workflow started'
      );

      await auditService.logEvent(
        workflow.userId,
        'workflow_started',
        'workflow',
        workflow.id,
        `Started workflow: ${workflow.name}`
      );
    } catch (error) {
      console.error(`Error starting workflow ${workflow.id}:`, error);
      throw error;
    }
  }

  private async executeWorkflow(workflow: Workflow): Promise<void> {
    const executionId = nanoid();
    const startTime = Date.now();
    const workflowState = this.activeWorkflows.get(workflow.id);
    
    if (!workflowState) {
      throw new Error(`No state found for workflow ${workflow.id}`);
    }

    try {
      // Reset execution context
      workflowState.context.results = {};
      workflowState.context.errors = [];
      workflowState.context.startTime = startTime;
      workflowState.context.retryCount = 0;

      // Execute actions with conditions
      for (let i = 0; i < workflow.config.actions.length; i++) {
        const action = workflow.config.actions[i];
        
        // Check conditions before executing action
        if (workflow.config.conditions) {
          const shouldExecute = await this.evaluateConditions(
            workflow.config.conditions,
            action,
            workflowState.context
          );
          if (!shouldExecute) continue;
        }

        // Execute action with error handling
        await this.executeActionWithRetry(
          action,
          workflow,
          workflowState.context,
          workflow.config.errorHandler
        );
      }

      // Update workflow statistics
      const executionTime = Date.now() - startTime;
      await this.updateWorkflowStats(workflow, true, executionTime);

      // Notify listeners
      this.notifyExecutionListeners(workflow.id, {
        id: executionId,
        workflowId: workflow.id,
        status: 'success',
        executionTime,
        timestamp: new Date().toISOString(),
        results: workflowState.context.results
      });

      await auditService.logEvent(
        workflow.userId,
        'workflow_executed',
        'workflow',
        workflow.id,
        `Successfully executed workflow: ${workflow.name}`,
        { executionTime, results: workflowState.context.results }
      );
    } catch (error) {
      await this.handleWorkflowError(workflow, error, executionId, startTime);
    }
  }

  private async executeActionWithRetry(
    action: WorkflowAction,
    workflow: Workflow,
    context: ExecutionContext,
    errorHandler?: ErrorHandler
  ): Promise<void> {
    const operation = retry.operation({
      retries: errorHandler?.retryCount || 3,
      factor: 2,
      minTimeout: errorHandler?.retryDelay || 1000,
      maxTimeout: 30000
    });

    return new Promise((resolve, reject) => {
      operation.attempt(async (currentAttempt) => {
        try {
          const result = await executeIntegrationAction(action, workflow);
          context.results[action.id] = result;
          resolve();
        } catch (error) {
          context.errors.push(error);
          context.retryCount = currentAttempt;

          if (operation.retry(error)) {
            return;
          }

          // If we've exhausted retries, try fallback action
          if (errorHandler?.fallbackAction) {
            try {
              const fallbackResult = await executeIntegrationAction(
                errorHandler.fallbackAction,
                workflow
              );
              context.results[action.id] = fallbackResult;
              resolve();
              return;
            } catch (fallbackError) {
              reject(fallbackError);
            }
          }

          reject(operation.mainError());
        }
      });
    });
  }

  private async evaluateConditions(
    conditions: WorkflowCondition[],
    action: WorkflowAction,
    context: ExecutionContext
  ): Promise<boolean> {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'if':
          const result = await this.evaluateExpression(
            condition.value,
            context
          );
          if (!result) return false;
          break;

        case 'switch':
          if (!condition.cases) continue;
          const matchingCase = condition.cases.find(
            async (c) => await this.evaluateExpression(c.value, context)
          );
          if (!matchingCase) return false;
          break;

        case 'loop':
          if (context.results[action.id]?.iterationCount >= condition.maxIterations) {
            return false;
          }
          break;

        case 'try_catch':
          // Already handled by executeActionWithRetry
          break;
      }
    }
    return true;
  }

  private async evaluateExpression(
    expression: string,
    context: ExecutionContext
  ): Promise<any> {
    try {
      const expr = jsonata(expression);
      return await expr.evaluate({
        variables: context.variables,
        results: context.results,
        now: new Date().toISOString()
      });
    } catch (error) {
      console.error('Expression evaluation failed:', error);
      return false;
    }
  }

  private getTriggerInterval(trigger: WorkflowTrigger): number {
    if (trigger.type === 'schedule') {
      return trigger.config.intervalMinutes * 60 * 1000;
    }
    return 5 * 60 * 1000; // Default to 5 minutes
  }

  stopWorkflow(workflowId: string): void {
    const workflow = this.activeWorkflows.get(workflowId);
    if (workflow) {
      clearInterval(workflow.interval);
      this.activeWorkflows.delete(workflowId);
    }
  }

  async pauseWorkflow(workflowId: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (workflow) {
      clearInterval(workflow.interval);
      workflow.status = 'paused';
      await updateWorkflow(workflowId, { status: 'inactive' });
    }
  }

  async resumeWorkflow(workflow: Workflow): Promise<void> {
    const existingWorkflow = this.activeWorkflows.get(workflow.id);
    if (existingWorkflow && existingWorkflow.status === 'paused') {
      await this.startWorkflow(workflow);
    }
  }

  onWorkflowExecution(workflowId: string, listener: (execution: WorkflowExecution) => void): () => void {
    if (!this.executionListeners.has(workflowId)) {
      this.executionListeners.set(workflowId, new Set());
    }
    this.executionListeners.get(workflowId)!.add(listener);

    return () => {
      this.executionListeners.get(workflowId)?.delete(listener);
    };
  }

  private async handleWorkflowError(
    workflow: Workflow,
    error: Error,
    executionId: string,
    startTime: number
  ): Promise<void> {
    const executionTime = Date.now() - startTime;

    // Update workflow stats
    await this.updateWorkflowStats(workflow, false, executionTime);

    // Notify listeners
    this.notifyExecutionListeners(workflow.id, {
      id: executionId,
      workflowId: workflow.id,
      status: 'failed',
      error: error.message,
      executionTime,
      timestamp: new Date().toISOString()
    });

    // If error is critical, pause the workflow
    if (this.isCriticalError(error)) {
      await this.pauseWorkflow(workflow.id);
    }
  }

  private isCriticalError(error: Error): boolean {
    const criticalErrors = [
      'Authentication failed',
      'Rate limit exceeded',
      'Integration disconnected'
    ];
    return criticalErrors.some(msg => error.message.includes(msg));
  }

  private async updateWorkflowStats(
    workflow: Workflow,
    success: boolean,
    executionTime: number
  ): Promise<void> {
    const workflowState = this.activeWorkflows.get(workflow.id);
    if (!workflowState) return;

    workflowState.executionCount++;
    workflowState.lastExecutionTime = executionTime;

    const updates = {
      executionCount: workflow.executionCount + 1,
      timeSaved: workflow.timeSaved + (success ? workflow.config.estimatedTimeSaving || 0 : 0),
      successRate:
        ((workflow.successRate * workflow.executionCount + (success ? 100 : 0)) /
        (workflow.executionCount + 1)),
      lastExecutionTime: executionTime,
      lastExecutionStatus: success ? 'success' : 'failed'
    };

    await updateWorkflow(workflow.id, updates);
  }

  private notifyExecutionListeners(workflowId: string, execution: WorkflowExecution): void {
    this.executionListeners.get(workflowId)?.forEach(listener => {
      try {
        listener(execution);
      } catch (error) {
        console.error('Error in workflow execution listener:', error);
      }
    });
  }
}

export const workflowEngine = WorkflowEngine.getInstance();