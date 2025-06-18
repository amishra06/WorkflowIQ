import { ActivityPattern, AnalyticsData, Integration, Workflow } from '../types';

// Mock activity patterns
export const mockActivityPatterns: ActivityPattern[] = [
  {
    id: '1',
    name: 'Email to Task Creation',
    description: 'Client emails are manually converted to tasks in your project management system',
    frequency: 25,
    confidenceScore: 92,
    potentialTimeSaving: 120,
    lastDetectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'email',
  },
  {
    id: '2',
    name: 'Weekly Report Generation',
    description: 'Team members spend time compiling weekly status reports from multiple sources',
    frequency: 5,
    confidenceScore: 89,
    potentialTimeSaving: 180,
    lastDetectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    type: 'reporting',
  },
  {
    id: '3',
    name: 'Invoice Processing',
    description: 'Manual data entry for invoice processing and payment tracking',
    frequency: 15,
    confidenceScore: 84,
    potentialTimeSaving: 210,
    lastDetectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    type: 'data-entry',
  },
  {
    id: '4',
    name: 'Document Approval Flow',
    description: 'Documents are manually routed for approval through multiple stakeholders',
    frequency: 8,
    confidenceScore: 76,
    potentialTimeSaving: 90,
    lastDetectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: 'approval',
  },
];

// Mock workflows
export const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Client Email Processor',
    description: 'Automatically convert client emails to tasks and notify the responsible team member',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'user-1',
    timeSaved: 120,
    executionCount: 87,
    successRate: 98.8,
    tags: ['email', 'tasks', 'client-management'],
    config: {
      triggers: [
        {
          id: 'trigger-1',
          type: 'email',
          config: { folder: 'inbox', subject: 'contains:project' },
        },
      ],
      actions: [
        {
          id: 'action-1',
          type: 'create-task',
          config: { project: 'client-projects', assignee: 'email.from' },
        },
        {
          id: 'action-2',
          type: 'send-notification',
          config: { channel: 'slack', message: 'New client task created: {{task.title}}' },
        },
      ],
    },
  },
  {
    id: '2',
    name: 'Weekly Status Report',
    description: 'Compile project status from multiple sources into a weekly report',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'user-1',
    timeSaved: 180,
    executionCount: 24,
    successRate: 95.5,
    tags: ['reporting', 'data-aggregation'],
    config: {
      triggers: [
        {
          id: 'trigger-1',
          type: 'schedule',
          config: { frequency: 'weekly', day: 'friday', time: '14:00' },
        },
      ],
      actions: [
        {
          id: 'action-1',
          type: 'data-collection',
          config: { sources: ['jira', 'github', 'slack'] },
        },
        {
          id: 'action-2',
          type: 'generate-report',
          config: { template: 'weekly-status', format: 'pdf' },
        },
        {
          id: 'action-3',
          type: 'send-email',
          config: { to: 'team@example.com', subject: 'Weekly Status Report' },
        },
      ],
    },
  },
];

// Mock integrations
export const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Gmail',
    type: 'email',
    icon: 'mail',
    status: 'connected',
    lastSyncedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    config: { account: 'work@example.com' },
  },
  {
    id: '2',
    name: 'Slack',
    type: 'communication',
    icon: 'message-square',
    status: 'connected',
    lastSyncedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    config: { workspace: 'Company HQ' },
  },
  {
    id: '3',
    name: 'Asana',
    type: 'project-management',
    icon: 'check-square',
    status: 'connected',
    lastSyncedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    config: { workspace: 'Marketing Team' },
  },
  {
    id: '4',
    name: 'Salesforce',
    type: 'crm',
    icon: 'briefcase',
    status: 'disconnected',
    config: {},
  },
  {
    id: '5',
    name: 'Google Calendar',
    type: 'calendar',
    icon: 'calendar',
    status: 'connected',
    lastSyncedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    config: { account: 'work@example.com' },
  },
  {
    id: '6',
    name: 'Notion',
    type: 'knowledge-base',
    icon: 'file-text',
    status: 'error',
    lastSyncedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    config: { workspace: 'Company Wiki' },
  },
];

// Mock analytics data
export const mockAnalyticsData: AnalyticsData = {
  timeSaved: {
    total: 12860,
    byWeek: Array.from({ length: 12 }).map((_, i) => ({
      date: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 800 + Math.floor(Math.random() * 400),
    })),
  },
  automations: {
    total: 12,
    active: 8,
    byType: [
      { name: 'Email Processing', value: 4 },
      { name: 'Data Entry', value: 3 },
      { name: 'Reporting', value: 2 },
      { name: 'Approval Flows', value: 2 },
      { name: 'Other', value: 1 },
    ],
  },
  executionStats: {
    total: 1458,
    success: 1385,
    failed: 73,
    byDay: Array.from({ length: 30 }).map((_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 30 + Math.floor(Math.random() * 20),
    })),
  },
  roi: {
    totalSavings: 12860 * 0.5, // $0.50 per minute saved
    costPerAutomation: 200,
    paybackPeriod: 15,
  },
};

// Testimonials for landing page
export const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Operations Director',
    company: 'TechCorp Solutions',
    quote:
      'WorkflowIQ identified repetitive processes that were costing us 20+ hours per week. After implementing the suggested automations, our team is more focused on strategic work and less on manual data entry.',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    metrics: { timeSaved: '23 hrs/week', roi: '380%' },
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'IT Manager',
    company: 'Global Finance Inc.',
    quote:
      'The integration with our existing tools was seamless. WorkflowIQ learned our processes and suggested automations we hadn\'t even considered. Implementation was straightforward and the ROI was immediate.',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    metrics: { timeSaved: '15 hrs/week', roi: '275%' },
  },
  {
    id: '3',
    name: 'Jessica Rivera',
    title: 'Marketing Director',
    company: 'Brand Accelerator',
    quote:
      'Our reporting process used to take days. WorkflowIQ automated data collection from multiple platforms and now generates our reports automatically. This tool has transformed how we operate.',
    avatarUrl: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=100',
    metrics: { timeSaved: '18 hrs/week', roi: '320%' },
  },
];