import { supabase } from './supabase';

export class CustomDomainService {
  private static instance: CustomDomainService;

  private constructor() {}

  static getInstance(): CustomDomainService {
    if (!CustomDomainService.instance) {
      CustomDomainService.instance = new CustomDomainService();
    }
    return CustomDomainService.instance;
  }

  async addDomain(organizationId: string, domain: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('custom_domains')
        .insert([{
          organization_id: organizationId,
          domain,
          status: 'pending'
        }]);

      if (error) throw error;

      // Trigger domain verification process
      await this.verifyDomain(domain);
    } catch (error) {
      console.error('Failed to add custom domain:', error);
      throw error;
    }
  }

  async verifyDomain(domain: string): Promise<void> {
    try {
      // Implement domain verification logic here
      // This would typically involve:
      // 1. DNS record verification
      // 2. SSL certificate provisioning
      // 3. Domain ownership validation

      const verificationResult = await this.performVerification(domain);

      const { error } = await supabase
        .from('custom_domains')
        .update({
          status: verificationResult.success ? 'verified' : 'failed',
          verification_errors: verificationResult.errors,
          last_verified_at: new Date().toISOString()
        })
        .eq('domain', domain);

      if (error) throw error;
    } catch (error) {
      console.error('Domain verification failed:', error);
      throw error;
    }
  }

  private async performVerification(domain: string) {
    // Mock implementation - replace with actual verification logic
    return {
      success: true,
      errors: []
    };
  }

  async getDomains(organizationId: string) {
    const { data, error } = await supabase
      .from('custom_domains')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async removeDomain(domain: string): Promise<void> {
    const { error } = await supabase
      .from('custom_domains')
      .delete()
      .eq('domain', domain);

    if (error) throw error;
  }
}

export const customDomainService = CustomDomainService.getInstance();