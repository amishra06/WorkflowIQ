import { supabase } from '../supabase';
import { Matrix } from 'ml-matrix';
import { SimpleLinearRegression } from 'ml-regression';
import { Workflow, WorkflowExecution } from '../../types';

// Fix ml-kmeans import - use named import instead of default
import * as mlKmeans from 'ml-kmeans';

export class AnalyticsMetricsService {
  private static instance: AnalyticsMetricsService;

  private constructor() {}

  static getInstance(): AnalyticsMetricsService {
    if (!AnalyticsMetricsService.instance) {
      AnalyticsMetricsService.instance = new AnalyticsMetricsService();
    }
    return AnalyticsMetricsService.instance;
  }

  async getWorkflowPerformanceMetrics(workflowId: string, timeRange: string) {
    const { data: executions } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('workflow_id', workflowId)
      .gte('created_at', timeRange);

    return {
      executionTime: this.calculateExecutionMetrics(executions),
      reliability: this.calculateReliabilityMetrics(executions),
      resourceUsage: await this.calculateResourceUsage(workflowId),
      costEfficiency: await this.calculateCostEfficiency(workflowId)
    };
  }

  private calculateExecutionMetrics(executions: WorkflowExecution[]) {
    const times = executions.map(e => e.executionTime);
    return {
      average: times.reduce((a, b) => a + b, 0) / times.length,
      median: this.median(times),
      p95: this.percentile(times, 95),
      trend: this.calculateTrend(times)
    };
  }

  private calculateReliabilityMetrics(executions: WorkflowExecution[]) {
    const total = executions.length;
    const successful = executions.filter(e => e.status === 'success').length;
    
    return {
      successRate: (successful / total) * 100,
      mtbf: this.calculateMTBF(executions),
      errorDistribution: this.analyzeErrorPatterns(executions)
    };
  }

  private async calculateResourceUsage(workflowId: string) {
    // Implementation for resource usage analysis
    return {
      cpuUtilization: 0,
      memoryUsage: 0,
      networkIO: 0
    };
  }

  private async calculateCostEfficiency(workflowId: string) {
    // Implementation for cost analysis
    return {
      costPerExecution: 0,
      savingsOpportunities: [],
      roi: 0
    };
  }

  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * p / 100;
    const base = Math.floor(pos);
    const rest = pos - base;
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }

  private calculateTrend(values: number[]): { slope: number; direction: 'improving' | 'degrading' | 'stable' } {
    const x = Array.from({ length: values.length }, (_, i) => i);
    const regression = new SimpleLinearRegression(x, values);
    const slope = regression.slope;
    
    return {
      slope,
      direction: slope < -0.1 ? 'improving' : slope > 0.1 ? 'degrading' : 'stable'
    };
  }

  private calculateMTBF(executions: WorkflowExecution[]): number {
    const failures = executions.filter(e => e.status === 'failed');
    if (failures.length === 0) return Infinity;
    
    const totalTime = executions.reduce((sum, e) => sum + e.executionTime, 0);
    return totalTime / failures.length;
  }

  private analyzeErrorPatterns(executions: WorkflowExecution[]) {
    const errors = executions
      .filter(e => e.status === 'failed')
      .map(e => e.error)
      .filter(Boolean);

    return this.clusterErrors(errors);
  }

  private clusterErrors(errors: string[]) {
    // Convert errors to feature vectors using simple bag of words
    const words = new Set(errors.flatMap(e => e.toLowerCase().split(/\W+/)));
    const features = errors.map(error => 
      Array.from(words).map(word => error.toLowerCase().includes(word) ? 1 : 0)
    );

    const matrix = new Matrix(features);
    const k = Math.min(3, errors.length);
    
    // Use the correct KMeans constructor
    const kmeans = new mlKmeans.KMeans(matrix, k);
    const { clusters } = kmeans;

    // Group errors by cluster
    const patterns = new Map<number, string[]>();
    clusters.forEach((cluster, i) => {
      if (!patterns.has(cluster)) patterns.set(cluster, []);
      patterns.get(cluster)!.push(errors[i]);
    });

    return Array.from(patterns.values());
  }
}

export const analyticsMetrics = AnalyticsMetricsService.getInstance();