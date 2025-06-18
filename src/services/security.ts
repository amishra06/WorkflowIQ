import { Socket } from 'socket.io';
import ipRangeCheck from 'ip-range-check';
import { User } from '../types';

export class SecurityService {
  private static instance: SecurityService;
  private rateLimits: Map<string, { count: number; timestamp: number }> = new Map();
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly MAX_REQUESTS = 100;
  private readonly ALLOWED_IP_RANGES = [
    '10.0.0.0/8',     // Private network
    '172.16.0.0/12',  // Private network
    '192.168.0.0/16', // Private network
  ];

  private constructor() {}

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  validateSocketConnection(socket: Socket): boolean {
    const ip = socket.handshake.address;
    
    // IP range check
    if (!this.isAllowedIP(ip)) {
      console.warn(`Blocked connection attempt from unauthorized IP: ${ip}`);
      return false;
    }

    // Rate limiting
    if (this.isRateLimited(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return false;
    }

    return true;
  }

  validateUser(user: User | null): boolean {
    if (!user || !user.id || !user.organizationId) {
      return false;
    }

    // Add additional user validation as needed
    return true;
  }

  private isAllowedIP(ip: string): boolean {
    return ipRangeCheck(ip, this.ALLOWED_IP_RANGES);
  }

  private isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = this.rateLimits.get(ip);

    if (!record) {
      this.rateLimits.set(ip, { count: 1, timestamp: now });
      return false;
    }

    if (now - record.timestamp > this.RATE_LIMIT_WINDOW) {
      this.rateLimits.set(ip, { count: 1, timestamp: now });
      return false;
    }

    if (record.count >= this.MAX_REQUESTS) {
      return true;
    }

    record.count++;
    return false;
  }

  cleanupRateLimits(): void {
    const now = Date.now();
    for (const [ip, record] of this.rateLimits.entries()) {
      if (now - record.timestamp > this.RATE_LIMIT_WINDOW) {
        this.rateLimits.delete(ip);
      }
    }
  }
}

export const securityService = SecurityService.getInstance();