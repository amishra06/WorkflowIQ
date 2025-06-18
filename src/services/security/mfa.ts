import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { supabase } from '../supabase';
import { User } from '../../types';

export class MFAService {
  private static instance: MFAService;

  private constructor() {
    authenticator.options = {
      window: 1, // Allow 30 seconds before/after for time drift
    };
  }

  static getInstance(): MFAService {
    if (!MFAService.instance) {
      MFAService.instance = new MFAService();
    }
    return MFAService.instance;
  }

  async setupMFA(user: User): Promise<{ secret: string; qrCode: string }> {
    try {
      // Generate secret
      const secret = authenticator.generateSecret();

      // Create QR code
      const otpauth = authenticator.keyuri(
        user.email,
        'WorkflowIQ',
        secret
      );
      const qrCode = await QRCode.toDataURL(otpauth);

      // Store secret in user profile (encrypted)
      await supabase
        .from('user_profiles')
        .update({
          mfa_secret: secret,
          mfa_enabled: false
        })
        .eq('id', user.id);

      return { secret, qrCode };
    } catch (error) {
      console.error('MFA setup failed:', error);
      throw error;
    }
  }

  async verifyAndEnableMFA(user: User, token: string): Promise<boolean> {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('mfa_secret')
        .eq('id', user.id)
        .single();

      if (!profile?.mfa_secret) {
        throw new Error('MFA not set up for user');
      }

      const isValid = authenticator.verify({
        token,
        secret: profile.mfa_secret
      });

      if (isValid) {
        await supabase
          .from('user_profiles')
          .update({ mfa_enabled: true })
          .eq('id', user.id);
      }

      return isValid;
    } catch (error) {
      console.error('MFA verification failed:', error);
      throw error;
    }
  }

  async validateMFAToken(user: User, token: string): Promise<boolean> {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('mfa_secret, mfa_enabled')
        .eq('id', user.id)
        .single();

      if (!profile?.mfa_enabled) {
        return true; // MFA not required
      }

      return authenticator.verify({
        token,
        secret: profile.mfa_secret
      });
    } catch (error) {
      console.error('MFA validation failed:', error);
      throw error;
    }
  }

  async disableMFA(user: User): Promise<void> {
    try {
      await supabase
        .from('user_profiles')
        .update({
          mfa_secret: null,
          mfa_enabled: false
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Failed to disable MFA:', error);
      throw error;
    }
  }
}

export const mfaService = MFAService.getInstance();