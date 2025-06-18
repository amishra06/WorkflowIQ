// User and Auth Types
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  organizationId: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  createdAt: string;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  userId: string;
  timeSaved: number; // in minutes per week
  executionCount: number;
  successRate: number; // percentage
  tags: string[];
  config: WorkflowConfig;
}

export interface WorkflowConfig {
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
}

export interface WorkflowTrigger {
  id: string;
  type: string;
  config: Record<string, any>;
}

export interface WorkflowAction {
  id: string;
  type: string;
  config: Record<string, any>;
}

export interface WorkflowCondition {
  id: string;
  type: 'if' | 'switch' | 'loop';
  config: Record<string, any>;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncedAt?: string;
  config: Record<string, any>;
}

// Analytics Types
export interface AnalyticsData {
  timeSaved: {
    total: number; // in minutes
    byWeek: TimeSeriesData[];
  };
  automations: {
    total: number;
    active: number;
    byType: CategoryData[];
  };
  executionStats: {
    total: number;
    success: number;
    failed: number;
    byDay: TimeSeriesData[];
  };
  roi: {
    totalSavings: number; // in currency
    costPerAutomation: number;
    paybackPeriod: number; // in days
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

// Activity and Pattern Types
export interface ActivityPattern {
  id: string;
  name: string;
  description: string;
  frequency: number; // occurrences per week
  confidenceScore: number; // 0-100
  potentialTimeSaving: number; // minutes per week
  lastDetectedAt: string;
  suggestedWorkflow?: Workflow;
  type: 'email' | 'data-entry' | 'reporting' | 'approval' | 'other';
}