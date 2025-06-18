import { createClient } from '@supabase/supabase-js';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { apiSecurityService } from '../security/api';
import { auditService } from '../audit';
import { encryptionService } from '../security/encryption';
import { User } from '../../types';

export class APIService {
  private static instance: APIService;
  private rateLimiter: RateLimiterMemory;

  private constructor() {
    this.rateLimiter = new RateLimiterMemory({
      points: 100,
      duration: 60
    });
  }

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  async createAPIKey(
    user: User,
    name: string,
    scopes: string[],
    expiresAt?: Date
  ): Promise<{ key: string; id: string }> {
    try {
      // Generate API key
      const key = apiSecurityService.generateAPIKey();
      const keyHash = encryptionService.hashValue(key);

      // Store API key
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          organization_id: user.organizationId,
          user_id: user.id,
          name,
          key_hash: keyHash,
          scopes,
          expires_at: expiresAt?.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Log API key creation
      await auditService.logEvent(
        user.id,
        'api_key_created',
        'api_key',
        data.id,
        `Created API key: ${name}`
      );

      return { key, id: data.id };
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error;
    }
  }

  async revokeAPIKey(user: User, keyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId)
        .eq('organization_id', user.organizationId);

      if (error) throw error;

      await auditService.logEvent(
        user.id,
        'api_key_revoked',
        'api_key',
        keyId,
        'API key revoked'
      );
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      throw error;
    }
  }

  async listAPIKeys(user: User) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('organization_id', user.organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async validateRequest(req: Request): Promise<boolean> {
    try {
      // Validate basic request structure
      if (!apiSecurityService.validateRequest(req)) {
        return false;
      }

      // Get API key from headers
      const apiKey = req.headers.get('x-api-key');
      if (!apiKey) return false;

      // Validate API key
      const isValidKey = await apiSecurityService.validateAPIKey(apiKey);
      if (!isValidKey) return false;

      // Check rate limit
      const identifier = req.headers.get('x-request-id') || apiKey;
      const isWithinLimit = await apiSecurityService.checkRateLimit(identifier);
      if (!isWithinLimit) return false;

      return true;
    } catch (error) {
      console.error('Request validation failed:', error);
      return false;
    }
  }
}

export const apiService = APIService.getInstance();