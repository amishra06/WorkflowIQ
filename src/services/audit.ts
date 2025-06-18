import { supabase } from './supabase';
import { User } from '../types';
import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'audit.log' })
  ]
});

export class AuditService {
  private static instance: AuditService;

  private constructor() {}

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  async logEvent(
    user: User,
    eventType: string,
    resourceType: string,
    resourceId?: string,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabase.from('audit_logs').insert([{
        organization_id: user.organizationId,
        user_id: user.id,
        event_type: eventType,
        resource_type: resourceType,
        resource_id: resourceId,
        description,
        metadata,
        ip_address: this.getClientIP(),
        user_agent: navigator.userAgent
      }]);

      if (error) throw error;

      // Also log to Winston for system-level auditing
      logger.info('Audit event', {
        userId: user.id,
        organizationId: user.organizationId,
        eventType,
        resourceType,
        resourceId,
        description,
        metadata
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      throw error;
    }
  }

  async getAuditLogs(
    organizationId: string,
    filters?: {
      userId?: string;
      eventType?: string;
      resourceType?: string;
      startDate?: string;
      endDate?: string;
    }
  ) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters?.eventType) {
      query = query.eq('event_type', filters.eventType);
    }
    if (filters?.resourceType) {
      query = query.eq('resource_type', filters.resourceType);
    }
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  private getClientIP(): string {
    // In a real implementation, this would be handled by your server
    // For demo purposes, we'll return a placeholder
    return '0.0.0.0';
  }
}

export const auditService = AuditService.getInstance();