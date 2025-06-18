import { RateLimiterMemory } from 'rate-limiter-flexible';
import { User } from '../../types';
import { encryptionService } from './encryption';

export class APISecurityService {
  private static instance: APISecurityService;
  private rateLimiter: RateLimiterMemory;

  private constructor() {
    this.rateLimiter = new RateLimiterMemory({
      points: 100, // Number of points
      duration: 60, // Per 60 seconds
    });
  }

  static getInstance(): APISecurityService {
    if (!APISecurityService.instance) {
      APISecurityService.instance = new APISecurityService();
    }
    return APISecurityService.instance;
  }

  async validateAPIKey(apiKey: string): Promise<boolean> {
    try {
      const hashedKey = encryptionService.hashValue(apiKey);
      // Validate against stored API keys
      return true; // Implement actual validation
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  async checkRateLimit(identifier: string): Promise<boolean> {
    try {
      await this.rateLimiter.consume(identifier);
      return true;
    } catch (error) {
      return false;
    }
  }

  validateRequest(req: Request): boolean {
    // Validate request headers
    const requiredHeaders = ['x-api-key', 'x-request-id'];
    for (const header of requiredHeaders) {
      if (!req.headers.get(header)) {
        return false;
      }
    }

    // Validate content type
    if (req.method !== 'GET' && !req.headers.get('content-type')?.includes('application/json')) {
      return false;
    }

    return true;
  }

  validateScope(user: User, scope: string): boolean {
    // Implement scope validation based on user role and permissions
    const scopeMap: Record<string, string[]> = {
      admin: ['read:*', 'write:*', 'delete:*'],
      member: ['read:*', 'write:own'],
      viewer: ['read:own']
    };

    const allowedScopes = scopeMap[user.role] || [];
    return allowedScopes.some(s => 
      s === scope || 
      (s.endsWith(':*') && scope.startsWith(s.slice(0, -2)))
    );
  }

  generateAPIKey(): string {
    const key = crypto.randomUUID();
    const prefix = 'wiq';
    return `${prefix}_${key}`;
  }
}

export const apiSecurityService = APISecurityService.getInstance();