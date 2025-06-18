import { supabase } from '../supabase';
import { auditService } from '../audit';
import { User } from '../../types';

export interface SLADefinition {
  id: string;
  name: string;
  description: string;
  uptime: number;
  responseTime: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  supportHours: '24x7' | '8x5';
  responseTimeHours: number;
  resolutionTimeHours: number;
}

export class SLAService {
  private static instance: SLAService;

  private constructor() {}

  static getInstance(): SLAService {
    if (!SLAService.instance) {
      SLAService.instance = new SLAService();
    }
    return SLAService.instance;
  }

  async createSLA(
    user: User,
    sla: Omit<SLADefinition, 'id'>
  ): Promise<SLADefinition> {
    try {
      const { data, error } = await supabase
        .from('sla_definitions')
        .insert({
          organization_id: user.organizationId,
          ...sla
        })
        .select()
        .single();

      if (error) throw error;

      await auditService.logEvent(
        user.id,
        'sla_created',
        'sla',
        data.id,
        `Created SLA: ${sla.name}`
      );

      return data;
    } catch (error) {
      console.error('Failed to create SLA:', error);
      throw error;
    }
  }

  async getSLAStatus(slaId: string): Promise<{
    currentUptime: number;
    responseTimeAvg: number;
    violations: number;
  }> {
    // Implementation for checking SLA metrics
    return {
      currentUptime: 99.99,
      responseTimeAvg: 250,
      violations: 0
    };
  }

  async checkSLACompliance(
    slaId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    compliant: boolean;
    violations: Array<{
      timestamp: string;
      metric: string;
      actual: number;
      threshold: number;
    }>;
  }> {
    const { data: sla } = await supabase
      .from('sla_definitions')
      .select('*')
      .eq('id', slaId)
      .single();

    const { data: metrics } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('sla_id', slaId)
      .gte('timestamp', startDate)
      .lte('timestamp', endDate);

    const violations = [];
    let compliant = true;

    for (const metric of metrics) {
      if (metric.uptime < sla.uptime) {
        violations.push({
          timestamp: metric.timestamp,
          metric: 'uptime',
          actual: metric.uptime,
          threshold: sla.uptime
        });
        compliant = false;
      }

      if (metric.responseTime > sla.responseTime) {
        violations.push({
          timestamp: metric.timestamp,
          metric: 'responseTime',
          actual: metric.responseTime,
          threshold: sla.responseTime
        });
        compliant = false;
      }
    }

    return { compliant, violations };
  }

  async generateSLAReport(
    slaId: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const compliance = await this.checkSLACompliance(slaId, startDate, endDate);
    const status = await this.getSLAStatus(slaId);

    return {
      period: { startDate, endDate },
      compliance,
      status,
      recommendations: this.generateRecommendations(compliance)
    };
  }

  private generateRecommendations(compliance: any): string[] {
    const recommendations = [];

    if (!compliance.compliant) {
      if (compliance.violations.some(v => v.metric === 'uptime')) {
        recommendations.push('Consider implementing redundancy to improve uptime');
      }
      if (compliance.violations.some(v => v.metric === 'responseTime')) {
        recommendations.push('Optimize database queries and caching strategies');
      }
    }

    return recommendations;
  }
}

export const slaService = SLAService.getInstance();