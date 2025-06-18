import { PublicClientApplication, Configuration, AccountInfo } from '@azure/msal-browser';
import { User } from '../types';

export class SSOService {
  private static instance: SSOService;
  private msalInstance: PublicClientApplication;

  private constructor() {
    const msalConfig: Configuration = {
      auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
        redirectUri: window.location.origin
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
      }
    };

    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  static getInstance(): SSOService {
    if (!SSOService.instance) {
      SSOService.instance = new SSOService();
    }
    return SSOService.instance;
  }

  async initialize(): Promise<void> {
    await this.msalInstance.initialize();
    await this.msalInstance.handleRedirectPromise();
  }

  async login(): Promise<AccountInfo> {
    try {
      const loginResponse = await this.msalInstance.loginPopup({
        scopes: ['user.read', 'profile', 'email']
      });

      return loginResponse.account;
    } catch (error) {
      console.error('SSO login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.msalInstance.logoutPopup();
    } catch (error) {
      console.error('SSO logout failed:', error);
      throw error;
    }
  }

  async getToken(): Promise<string> {
    try {
      const account = this.msalInstance.getAllAccounts()[0];
      if (!account) {
        throw new Error('No active account');
      }

      const response = await this.msalInstance.acquireTokenSilent({
        scopes: ['user.read'],
        account
      });

      return response.accessToken;
    } catch (error) {
      console.error('Failed to get token:', error);
      throw error;
    }
  }

  async getUserInfo(): Promise<Partial<User>> {
    const token = await this.getToken();
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();
    return {
      email: data.mail || data.userPrincipalName,
      fullName: data.displayName
    };
  }
}

export const ssoService = SSOService.getInstance();