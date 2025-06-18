import { Matrix } from 'ml-matrix';
import { SimpleLinearRegression, PolynomialRegression } from 'ml-regression';
import { supabase } from '../supabase';
import { Workflow } from '../../types';

// Fix ml-kmeans import
import * as mlKmeans from 'ml-kmeans';

export class PredictiveAnalyticsService {
  private static instance: PredictiveAnalyticsService;
  private models: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): PredictiveAnalyticsService {
    if (!PredictiveAnalyticsService.instance) {
      PredictiveAnalyticsService.instance = new PredictiveAnalyticsService();
    }
    return PredictiveAnalyticsService.instance;
  }

  async getWorkflowPredictions(workflowId: string) {
    const historicalData = await this.getHistoricalData(workflowId);
    
    return {
      executionTrend: await this.predictExecutionTrend(historicalData),
      failureProbability: await this.predictFailureProbability(historicalData),
      resourceUsage: await this.predictResourceUsage(historicalData),
      optimization: await this.suggestOptimizations(historicalData)
    };
  }

  private async getHistoricalData(workflowId: string) {
    const { data: executions } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('created_at', { ascending: true });

    return executions || [];
  }

  private async predictExecutionTrend(historicalData: any[]) {
    if (historicalData.length < 2) {
      return {
        predictions: [],
        confidence: 0
      };
    }

    const x = Array.from({ length: historicalData.length }, (_, i) => i);
    const y = historicalData.map(d => d.execution_time || 0);

    // Try both linear and polynomial regression
    const linear = new SimpleLinearRegression(x, y);
    const polynomial = new PolynomialRegression(x, y, 2);

    // Choose the better model based on R²
    const linearR2 = this.calculateR2(y, x.map(x => linear.predict(x)));
    const polyR2 = this.calculateR2(y, x.map(x => polynomial.predict(x)));

    const model = linearR2 > polyR2 ? linear : polynomial;
    const future = Array.from({ length: 7 }, (_, i) => x.length + i);

    return {
      predictions: future.map(x => ({
        x,
        y: Math.max(0, model.predict(x))
      })),
      confidence: Math.max(linearR2, polyR2)
    };
  }

  private async predictFailureProbability(historicalData: any[]) {
    if (historicalData.length === 0) {
      return {
        probability: 0,
        riskFactors: []
      };
    }

    const recentFailures = historicalData
      .slice(-100)
      .filter(d => d.status === 'failed').length;
    
    const baselineProbability = recentFailures / Math.min(100, historicalData.length);
    const factors = this.analyzeFailureFactors(historicalData);

    return {
      probability: Math.min(baselineProbability * factors.riskMultiplier, 1),
      riskFactors: factors.significantFactors
    };
  }

  private async predictResourceUsage(historicalData: any[]) {
    // Implementation for resource usage prediction
    return {
      cpu: this.predictMetric(historicalData, 'cpuUsage'),
      memory: this.predictMetric(historicalData, 'memoryUsage'),
      network: this.predictMetric(historicalData, 'networkIO')
    };
  }

  private async suggestOptimizations(historicalData: any[]) {
    const patterns = this.detectOptimizationPatterns(historicalData);
    return patterns.map(pattern => ({
      type: pattern.type,
      impact: pattern.impact,
      confidence: pattern.confidence,
      suggestion: this.generateOptimizationSuggestion(pattern)
    }));
  }

  private calculateR2(actual: number[], predicted: number[]): number {
    if (actual.length === 0) return 0;
    
    const mean = actual.reduce((a, b) => a + b) / actual.length;
    const ssTotal = actual.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
    const ssResidual = actual.reduce((a, b, i) => a + Math.pow(b - predicted[i], 2), 0);
    
    if (ssTotal === 0) return 1;
    return Math.max(0, 1 - (ssResidual / ssTotal));
  }

  private analyzeFailureFactors(historicalData: any[]) {
    const factors = {
      timeOfDay: this.analyzeTimeFactors(historicalData),
      dataVolume: this.analyzeDataFactors(historicalData),
      complexity: this.analyzeComplexityFactors(historicalData)
    };

    const riskMultiplier = Object.values(factors).reduce((a, b) => a * b, 1);
    const significantFactors = Object.entries(factors)
      .filter(([_, value]) => value > 1.1)
      .map(([factor]) => factor);

    return { riskMultiplier, significantFactors };
  }

  private predictMetric(historicalData: any[], metric: string) {
    const values = historicalData.map(d => d[metric]).filter(v => v !== undefined && v !== null);
    if (values.length < 2) return null;

    const x = Array.from({ length: values.length }, (_, i) => i);
    const regression = new SimpleLinearRegression(x, values);

    return {
      current: values[values.length - 1],
      predicted: Math.max(0, regression.predict(values.length)),
      trend: regression.slope > 0 ? 'increasing' : 'decreasing'
    };
  }

  private detectOptimizationPatterns(historicalData: any[]) {
    const patterns = [];
    
    // Detect performance degradation
    if (historicalData.length >= 10) {
      const recent = historicalData.slice(-5);
      const older = historicalData.slice(-10, -5);
      
      const recentAvg = recent.reduce((sum, d) => sum + (d.execution_time || 0), 0) / recent.length;
      const olderAvg = older.reduce((sum, d) => sum + (d.execution_time || 0), 0) / older.length;
      
      if (recentAvg > olderAvg * 1.2) {
        patterns.push({
          type: 'performance_degradation',
          impact: 'high',
          confidence: 0.8
        });
      }
    }

    // Detect error rate increase
    const errorRate = historicalData.filter(d => d.status === 'failed').length / historicalData.length;
    if (errorRate > 0.1) {
      patterns.push({
        type: 'high_error_rate',
        impact: 'medium',
        confidence: 0.9
      });
    }

    return patterns;
  }

  private analyzeTimeFactors(data: any[]): number {
    // Implementation for time-based failure analysis
    return 1.0;
  }

  private analyzeDataFactors(data: any[]): number {
    // Implementation for data-related failure analysis
    return 1.0;
  }

  private analyzeComplexityFactors(data: any[]): number {
    // Implementation for complexity-related failure analysis
    return 1.0;
  }

  private generateOptimizationSuggestion(pattern: any): string {
    const suggestions = {
      performance_degradation: 'Consider optimizing workflow steps or adding caching',
      high_error_rate: 'Review error handling and add retry mechanisms',
      resource_intensive: 'Optimize resource usage or scale infrastructure'
    };
    
    return suggestions[pattern.type] || 'Review workflow configuration for optimization opportunities';
  }
}

export const predictiveAnalytics = PredictiveAnalyticsService.getInstance();