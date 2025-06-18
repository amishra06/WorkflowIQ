import { createClient } from '@supabase/supabase-js';
import { User, Workflow, Integration, ActivityPattern, Organization } from '../types';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: false, // Disable debug mode to reduce console noise
    // Explicitly set email confirmation to false for development
    emailRedirectTo: undefined,
    // Override default auth settings
    storageKey: 'workflowiq.auth.token',
    storage: window.localStorage,
    // Disable email confirmation
    autoConfirmUser: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Enhanced error handling wrapper
const handleSupabaseError = (error: any) => {
  if (error) {
    // Don't return an error for expected "Auth session missing" state
    if (error.message === 'Auth session missing!') {
      return null;
    }
    // Handle email confirmation error without logging to console
    if (error.message.includes('Email not confirmed') || 
        error.message.includes('confirmation') ||
        error.code === 'email_not_confirmed') {
      return { message: 'Please check your email for the confirmation link' };
    }
    // Only log unexpected errors
    if (!error.message.includes('Email not confirmed') && 
        !error.message.includes('confirmation') && 
        error.code !== 'email_not_confirmed') {
      console.error('Supabase operation failed:', error);
    }
    return error;
  }
  return null;
};

// Auth functions with enhanced error handling
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation redirect
        data: {
          full_name: email.split('@')[0], // Use email username as initial name
          avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${email}` // Generate avatar
        }
      }
    });

    if (error) {
      return { data: null, error };
    }

    // For development, automatically create user profile without email confirmation
    if (data.user) {
      const profileResult = await createUserProfile({
        email: data.user.email,
        fullName: data.user.user_metadata.full_name,
        avatarUrl: data.user.user_metadata.avatar_url,
        role: 'member'
      }, data.user.id);

      if (profileResult.error) {
        return { data: null, error: profileResult.error };
      }

      // Return success without requiring email confirmation
      return { data, error: null };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      data: null,
      error: {
        message: error.message || 'An error occurred during signup'
      }
    };
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    const handledError = handleSupabaseError(error);
    return { data: null, error: handledError };
  }
  
  return { data, error: null };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  const handledError = handleSupabaseError(error);
  return { error: handledError };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  const handledError = handleSupabaseError(error);
  return { data: { user }, error: handledError };
};

// User profile functions with transactions
export const createUserProfile = async (profile: Partial<User>, userId: string) => {
  const { data, error } = await supabase.rpc('create_user_profile', {
    profile_data: profile,
    user_id: userId
  });
  const handledError = handleSupabaseError(error);
  return { data, error: handledError };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('id', userId)
    .single();
  const handledError = handleSupabaseError(error);
  return { data, error: handledError };
};

// Workflow functions with optimistic updates
export const getWorkflows = async (userId: string) => {
  const { data, error } = await supabase
    .from('workflows')
    .select(`
      *,
      executions:workflow_executions(
        id,
        status,
        execution_time,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  const handledError = handleSupabaseError(error);
  return { data, error: handledError };
};

export const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('workflows')
    .insert([workflow])
    .select()
    .single();
  const handledError = handleSupabaseError(error);
  return { data, error: handledError };
};

// Integration functions with status tracking
export const getIntegrations = async (userId: string) => {
  const { data, error } = await supabase
    .from('integrations')
    .select(`
      *,
      status_history:integration_status_history(
        status,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  const handledError = handleSupabaseError(error);
  return { data, error: handledError };
};

// Activity pattern functions with AI processing status
export const createActivityPattern = async (
  pattern: Omit<ActivityPattern, 'id'>,
  aiProcessingId: string
) => {
  const { data, error } = await supabase.rpc('create_activity_pattern_with_processing', {
    pattern_data: pattern,
    processing_id: aiProcessingId
  });
  const handledError = handleSupabaseError(error);
  return { data, error: handledError };
};

// Analytics functions with caching
export const getAnalytics = async (
  userId: string,
  startDate: string,
  endDate: string,
  useCache: boolean = true
) => {
  const cacheKey = `analytics-${userId}-${startDate}-${endDate}`;
  
  if (useCache) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      return { data: JSON.parse(cachedData), error: null };
    }
  }

  const { data, error } = await supabase.rpc('get_user_analytics', {
    user_id: userId,
    start_date: startDate,
    end_date: endDate
  });

  const handledError = handleSupabaseError(error);
  if (!handledError && data) {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  }

  return { data, error: handledError };
};

// Workflow execution logging with real-time updates
export const logWorkflowExecution = async (
  workflowId: string,
  userId: string,
  status: 'success' | 'failed',
  executionTime: number,
  error?: string
) => {
  const { data, error: dbError } = await supabase
    .from('workflow_executions')
    .insert([
      {
        workflow_id: workflowId,
        user_id: userId,
        status,
        execution_time: executionTime,
        error_message: error
      }
    ])
    .select()
    .single();

  const handledError = handleSupabaseError(dbError);
  if (!handledError) {
    // Emit real-time update
    supabase.channel('workflow-executions').send({
      type: 'broadcast',
      event: 'execution_logged',
      payload: { execution: data }
    });
  }

  return { data, error: handledError };
};