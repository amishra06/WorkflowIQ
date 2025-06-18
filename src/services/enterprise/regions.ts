import { supabase } from '../supabase';
import { auditService } from '../audit';
import { User } from '../../types';

export class RegionService {
  private static instance: RegionService;
  private regions: Map<string, { status: string; latency: number }> = new Map();

  private constructor() {
    this.initializeRegions();
  }

  static getInstance(): RegionService {
    if (!RegionService.instance) {
      RegionService.instance = new RegionService();
    }
    return RegionService.instance;
  }

  private initializeRegions() {
    // Initialize supported regions
    this.regions.set('us-east-1', { status: 'healthy', latency: 0 });
    this.regions.set('eu-west-1', { status: 'healthy', latency: 0 });
    this.regions.set('ap-southeast-1', { status: 'healthy', latency: 0 });
  }

  async getRegions() {
    return Array.from(this.regions.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  }

  async setPreferredRegion(user: User, regionId: string): Promise<void> {
    if (!this.regions.has(regionId)) {
      throw new Error(`Invalid region: ${regionId}`);
    }

    try {
      const { error } = await supabase
        .from('organizations')
        .update({ preferred_region: regionId })
        .eq('id', user.organizationId);

      if (error) throw error;

      await auditService.logEvent(
        user.id,
        'region_updated',
        'organization',
        user.organizationId,
        `Updated preferred region to ${regionId}`
      );
    } catch (error) {
      console.error('Failed to set preferred region:', error);
      throw error;
    }
  }

  async monitorRegionHealth(): Promise<void> {
    for (const [regionId] of this.regions) {
      try {
        const startTime = Date.now();
        const response = await fetch(`https://${regionId}.api.workflowiq.com/health`);
        const latency = Date.now() - startTime;

        this.regions.set(regionId, {
          status: response.ok ? 'healthy' : 'degraded',
          latency
        });
      } catch (error) {
        this.regions.set(regionId, {
          status: 'unhealthy',
          latency: 0
        });
      }
    }
  }

  async getOptimalRegion(): Promise<string> {
    let bestRegion = null;
    let lowestLatency = Infinity;

    for (const [regionId, data] of this.regions) {
      if (data.status === 'healthy' && data.latency < lowestLatency) {
        bestRegion = regionId;
        lowestLatency = data.latency;
      }
    }

    return bestRegion || 'us-east-1'; // Default to us-east-1 if no healthy region found
  }
}

export const regionService = RegionService.getInstance();