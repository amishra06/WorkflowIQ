import { supabase } from '../supabase';
import { analyticsMetrics } from './metrics';
import { predictiveAnalytics } from './predictive';
import { User, Workflow } from '../../types';

export interface ReportConfig {
  metrics: string[];
  timeRange: string;
  format: 'pdf' | 'csv' | 'json';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

export class AnalyticsReportingService {
  private static instance: AnalyticsReportingService;

  private constructor() {}

  static getInstance(): AnalyticsReportingService {
    if (!AnalyticsReportingService.instance) {
      AnalyticsReportingService.instance = new AnalyticsReportingService();
    }
    return AnalyticsReportingService.instance;
  }

  async generateReport(
    user: User,
    config: ReportConfig
  ): Promise<{ url: string; metadata: any }> {
    const data = await this.gatherReportData(user, config);
    const report = await this.formatReport(data, config.format);
    
    if (config.schedule) {
      await this.scheduleReport(user, config);
    }

    return report;
  }

  async createCustomDashboard(
    user: User,
    metrics: string[],
    layout: any
  ): Promise<string> {
    const { data, error } = await supabase
      .from('custom_dashboards')
      .insert({
        user_id: user.id,
        organization_id: user.organizationId,
        metrics,
        layout
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  private async gatherReportData(user: User, config: ReportConfig) {
    const { data: workflows } = await supabase
      .from('workflows')
      .select('*')
      .eq('organization_id', user.organizationId);

    const metricsData = await Promise.all(
      workflows.map(async (workflow: Workflow) => ({
        workflow,
        metrics: await analyticsMetrics.getWorkflowPerformanceMetrics(
          workflow.id,
          config.timeRange
        ),
        predictions: await predictiveAnalytics.getWorkflowPredictions(workflow.id)
      }))
    );

    return {
      summary: this.generateSummary(metricsData),
      details: metricsData,
      recommendations: this.generateRecommendations(metricsData)
    };
  }

  private generateSummary(metricsData: any[]) {
    return {
      totalWorkflows: metricsData.length,
      activeWorkflows: metricsData.filter(d => d.workflow.status === 'active').length,
      totalExecutions: metricsData.reduce((sum, d) => sum + d.workflow.executionCount, 0),
      averageSuccessRate: metricsData.reduce((sum, d) => sum + d.metrics.reliability.successRate, 0) / metricsData.length,
      totalTimeSaved: metricsData.reduce((sum, d) => sum + d.workflow.timeSaved, 0)
    };
  }

  private generateRecommendations(metricsData: any[]) {
    const recommendations = [];

    // Performance recommendations
    const lowPerformers = metricsData.filter(
      d => d.metrics.reliability.successRate < 95
    );
    if (lowPerformers.length > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        workflows: lowPerformers.map(d => d.workflow.id),
        suggestion: 'Optimize these workflows to improve reliability'
      });
    }

    // Cost optimization recommendations
    const inefficientWorkflows = metricsData.filter(
      d => d.metrics.costEfficiency.roi < 1
    );
    if (inefficientWorkflows.length > 0) {
      recommendations.push({
        type: 'cost',
        priority: 'medium',
        workflows: inefficientWorkflows.map(d => d.workflow.id),
        suggestion: 'Review these workflows for cost optimization opportunities'
      });
    }

    return recommendations;
  }

  private async formatReport(data: any, format: ReportConfig['format']) {
    // Implementation for report formatting
    return {
      url: 'https://example.com/report',
      metadata: {
        format,
        timestamp: new Date().toISOString(),
        size: 0
      }
    };
  }

  private async scheduleReport(user: User, config: ReportConfig) {
    await supabase
      .from('scheduled_reports')
      .insert({
        user_id: user.id,
        organization_id: user.organizationId,
        config,
        next_run: this.calculateNextRun(config.schedule!.frequency)
      });
  }

  private calculateNextRun(frequency: string): Date {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.setDate(now.getDate() + 1));
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7));
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
      default:
        return now;
    }
  }
}

export const analyticsReporting = AnalyticsReportingService.getInstance();