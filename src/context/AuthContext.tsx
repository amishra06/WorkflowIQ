import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getCurrentUser, signIn, signOut, signUp } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  register: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await getCurrentUser();
        
        if (error?.message === 'Auth session missing!') {
          setUser(null);
          return;
        }
        
        if (error) {
          throw error;
        }
        
        if (data.user) {
          // For demo purposes, we'll create a mock user object
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            fullName: 'Demo User',
            avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
            organizationId: 'org-1',
            role: 'admin',
            createdAt: new Date().toISOString(),
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking auth state:', err);
        setError('Authentication error');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        return { error };
      }
      
      if (data.user) {
        // For demo purposes, we'll create a mock user object
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          fullName: 'Demo User',
          avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
          organizationId: 'org-1',
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
      }
      return {};
    } catch (err: any) {
      console.error('Login error:', err);
      return { error: { message: err.message || 'Failed to login' } };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await signUp(email, password);
      
      if (error) {
        return { error };
      }
      
      if (data.user) {
        // For demo purposes, we'll create a mock user object
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          fullName: 'Demo User',
          avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
          organizationId: 'org-1',
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
      }
      return {};
    } catch (err: any) {
      console.error('Registration error:', err);
      return { error: { message: err.message || 'Failed to register' } };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};