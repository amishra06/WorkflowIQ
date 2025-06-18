import { Configuration, OpenAIApi } from 'openai';
import { KMeans } from 'ml-kmeans';
import { Matrix } from 'ml-matrix';
import * as distance from 'ml-distance';
import { ActivityPattern, User, WorkflowAction } from '../types';
import { createActivityPattern } from './supabase';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { z } from 'zod';

// Validation schemas
const activityPatternSchema = z.object({
  name: z.string(),
  description: z.string(),
  frequency: z.number().min(0),
  confidenceScore: z.number().min(0).max(100),
  potentialTimeSaving: z.number().min(0),
  type: z.enum(['email', 'data-entry', 'reporting', 'approval', 'other'])
});

const openai = new OpenAIApi(
  new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  })
);

export class PatternDetectionService {
  private static instance: PatternDetectionService;
  private processingQueue: Map<string, {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    error?: string;
  }> = new Map();

  private activityBuffer: Map<string, Array<{
    timestamp: number;
    action: WorkflowAction;
  }>> = new Map();

  private readonly BUFFER_SIZE = 1000;
  private readonly ANALYSIS_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly SIMILARITY_THRESHOLD = 0.8;

  private constructor() {
    this.startRealTimeAnalysis();
  }

  static getInstance(): PatternDetectionService {
    if (!PatternDetectionService.instance) {
      PatternDetectionService.instance = new PatternDetectionService();
    }
    return PatternDetectionService.instance;
  }

  private startRealTimeAnalysis() {
    setInterval(() => {
      this.analyzeBufferedActivities();
    }, this.ANALYSIS_INTERVAL);
  }

  recordActivity(userId: string, action: WorkflowAction) {
    if (!this.activityBuffer.has(userId)) {
      this.activityBuffer.set(userId, []);
    }

    const buffer = this.activityBuffer.get(userId)!;
    buffer.push({
      timestamp: Date.now(),
      action
    });

    // Keep buffer size in check
    if (buffer.length > this.BUFFER_SIZE) {
      buffer.shift();
    }

    // Trigger real-time analysis if we have enough data
    if (buffer.length >= 50) {
      this.analyzeBufferedActivities(userId);
    }
  }

  private async analyzeBufferedActivities(userId?: string) {
    const users = userId ? [userId] : Array.from(this.activityBuffer.keys());

    for (const user of users) {
      const buffer = this.activityBuffer.get(user)!;
      if (buffer.length < 10) continue;

      // Convert activities to feature vectors
      const features = this.extractFeatures(buffer);
      
      // Cluster similar activities
      const { clusters, centroids } = await this.clusterActivities(features);
      
      // Analyze patterns in each cluster
      for (let i = 0; i < centroids.length; i++) {
        const clusterActivities = clusters
          .map((c, idx) => c === i ? buffer[idx] : null)
          .filter(Boolean);

        if (clusterActivities.length >= 3) {
          const pattern = await this.detectPatternInCluster(clusterActivities);
          if (pattern) {
            await this.suggestWorkflow(user, pattern);
          }
        }
      }
    }
  }

  private extractFeatures(activities: Array<{ timestamp: number; action: WorkflowAction }>) {
    return activities.map(activity => {
      const timeDiff = activities[activities.length - 1].timestamp - activity.timestamp;
      return [
        timeDiff / (24 * 60 * 60 * 1000), // Days since last activity
        this.getActionTypeFeature(activity.action.type),
        Object.keys(activity.action.config).length,
        this.calculateActionComplexity(activity.action)
      ];
    });
  }

  private getActionTypeFeature(type: string): number {
    const types = ['email', 'data-entry', 'reporting', 'approval', 'other'];
    return types.indexOf(type.split('-')[0]) / types.length;
  }

  private calculateActionComplexity(action: WorkflowAction): number {
    let complexity = 0;
    complexity += Object.keys(action.config).length;
    complexity += JSON.stringify(action.config).length / 100;
    return Math.min(complexity / 10, 1);
  }

  private async clusterActivities(features: number[][]) {
    const matrix = new Matrix(features);
    const k = Math.min(5, Math.floor(features.length / 5));
    const { clusters, centroids } = new KMeans(matrix, k, {
      initialization: 'kmeans++',
      distanceFunction: distance.euclidean
    });

    return { clusters, centroids };
  }

  private async detectPatternInCluster(activities: Array<{ timestamp: number; action: WorkflowAction }>) {
    // Calculate frequency
    const timeSpan = activities[activities.length - 1].timestamp - activities[0].timestamp;
    const frequency = (activities.length / (timeSpan / (7 * 24 * 60 * 60 * 1000))); // Per week

    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(activities);

    // Estimate time savings
    const potentialTimeSaving = this.estimateTimeSaving(activities);

    if (confidenceScore >= 70) {
      return {
        name: this.generatePatternName(activities),
        description: await this.generatePatternDescription(activities),
        frequency: Math.round(frequency),
        confidenceScore,
        potentialTimeSaving,
        type: this.determinePatternType(activities)
      };
    }

    return null;
  }

  private calculateConfidenceScore(activities: Array<{ timestamp: number; action: WorkflowAction }>) {
    let score = 0;

    // Frequency consistency
    const intervals = activities.slice(1).map((a, i) => a.timestamp - activities[i].timestamp);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const intervalVariance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
    score += 40 * (1 - Math.min(intervalVariance / avgInterval, 1));

    // Action similarity
    const similarityScores = activities.slice(1).map((a, i) => 
      this.calculateActionSimilarity(a.action, activities[i].action)
    );
    score += 40 * (similarityScores.reduce((a, b) => a + b, 0) / similarityScores.length);

    // Volume bonus
    score += Math.min(activities.length / 10, 1) * 20;

    return Math.round(score);
  }

  private calculateActionSimilarity(a1: WorkflowAction, a2: WorkflowAction): number {
    if (a1.type !== a2.type) return 0;

    const config1 = Object.entries(a1.config);
    const config2 = Object.entries(a2.config);

    const commonKeys = config1.filter(([k1]) => 
      config2.some(([k2]) => k1 === k2)
    ).length;

    return commonKeys / Math.max(config1.length, config2.length);
  }

  private estimateTimeSaving(activities: Array<{ timestamp: number; action: WorkflowAction }>) {
    // Base time per action (in minutes)
    const baseTime = {
      'email': 5,
      'data-entry': 8,
      'reporting': 15,
      'approval': 3,
      'other': 5
    };

    const type = this.determinePatternType(activities);
    return Math.round(activities.length * baseTime[type]);
  }

  private generatePatternName(activities: Array<{ timestamp: number; action: WorkflowAction }>) {
    const type = this.determinePatternType(activities);
    const actionType = activities[0].action.type.split('-')[1] || 'task';
    return `Automated ${type} ${actionType}`;
  }

  private async generatePatternDescription(activities: Array<{ timestamp: number; action: WorkflowAction }>) {
    const prompt = `
      Analyze these similar activities and create a concise description of the pattern:
      ${activities.map(a => JSON.stringify(a.action)).join('\n')}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100
    });

    return response.choices[0].message.content;
  }

  private determinePatternType(activities: Array<{ timestamp: number; action: WorkflowAction }>): ActivityPattern['type'] {
    const types = activities.map(a => a.action.type.split('-')[0]);
    return types[0] as ActivityPattern['type'];
  }

  async analyzeUserActivity(
    user: User,
    activityData: any[],
    options: {
      minConfidence?: number;
      maxPatterns?: number;
      priorityTypes?: ActivityPattern['type'][];
    } = {}
  ): Promise<string> {
    const processingId = nanoid();
    
    try {
      this.processingQueue.set(processingId, {
        status: 'pending',
        progress: 0
      });

      // Start async processing
      this.processActivityData(user, activityData, processingId, options);

      return processingId;
    } catch (error) {
      console.error('Error initiating activity analysis:', error);
      throw error;
    }
  }

  getProcessingStatus(processingId: string) {
    return this.processingQueue.get(processingId);
  }

  private async processActivityData(
    user: User,
    activityData: any[],
    processingId: string,
    options: {
      minConfidence?: number;
      maxPatterns?: number;
      priorityTypes?: ActivityPattern['type'][];
    }
  ): Promise<void> {
    try {
      this.updateProcessingStatus(processingId, 'processing', 10);

      // Prepare and clean activity data
      const formattedData = this.formatActivityData(activityData);
      this.updateProcessingStatus(processingId, 'processing', 30);

      // Detect patterns using AI
      const patterns = await this.detectPatterns(formattedData, options);
      this.updateProcessingStatus(processingId, 'processing', 60);

      // Validate and filter patterns
      const validPatterns = await this.validatePatterns(patterns, options);
      this.updateProcessingStatus(processingId, 'processing', 80);

      // Save detected patterns
      await this.savePatterns(user, validPatterns, processingId);
      this.updateProcessingStatus(processingId, 'completed', 100);

    } catch (error) {
      console.error('Error processing activity data:', error);
      this.updateProcessingStatus(processingId, 'failed', 0, error.message);
      throw error;
    }
  }

  private updateProcessingStatus(
    processingId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    progress: number,
    error?: string
  ) {
    this.processingQueue.set(processingId, { status, progress, error });
  }

  private formatActivityData(activityData: any[]): string {
    return activityData
      .map((activity) => {
        const date = format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm:ss');
        return `[${date}] ${activity.type}: ${activity.description}`;
      })
      .join('\n');
  }

  private async detectPatterns(
    activityData: string,
    options: {
      minConfidence?: number;
      maxPatterns?: number;
      priorityTypes?: ActivityPattern['type'][];
    }
  ): Promise<Partial<ActivityPattern>[]> {
    const prompt = `
      Analyze the following user activity log and identify potential automation patterns.
      Focus on repetitive tasks that could be automated to save time.
      
      Requirements:
      ${options.minConfidence ? `- Minimum confidence score: ${options.minConfidence}%` : ''}
      ${options.maxPatterns ? `- Maximum patterns to identify: ${options.maxPatterns}` : ''}
      ${options.priorityTypes ? `- Priority pattern types: ${options.priorityTypes.join(', ')}` : ''}
      
      Activity Log:
      ${activityData}
      
      For each pattern detected, provide:
      1. Name of the pattern
      2. Description of the repetitive task
      3. Frequency (times per week)
      4. Confidence score (0-100)
      5. Potential time saving (minutes per week)
      6. Type (email, data-entry, reporting, approval, other)
      
      Format the response as a JSON array of objects with these exact field names.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const patterns = JSON.parse(response.choices[0].message.content || '[]');
    return this.filterPatterns(patterns, options);
  }

  private filterPatterns(
    patterns: Partial<ActivityPattern>[],
    options: {
      minConfidence?: number;
      maxPatterns?: number;
      priorityTypes?: ActivityPattern['type'][];
    }
  ): Partial<ActivityPattern>[] {
    let filteredPatterns = patterns;

    if (options.minConfidence) {
      filteredPatterns = filteredPatterns.filter(
        pattern => pattern.confidenceScore >= options.minConfidence
      );
    }

    if (options.priorityTypes) {
      filteredPatterns = filteredPatterns.sort((a, b) => {
        const aIndex = options.priorityTypes.indexOf(a.type);
        const bIndex = options.priorityTypes.indexOf(b.type);
        return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
      });
    }

    if (options.maxPatterns) {
      filteredPatterns = filteredPatterns.slice(0, options.maxPatterns);
    }

    return filteredPatterns;
  }

  private async validatePatterns(
    patterns: Partial<ActivityPattern>[],
    options: { minConfidence?: number } = {}
  ): Promise<ActivityPattern[]> {
    const validPatterns: ActivityPattern[] = [];

    for (const pattern of patterns) {
      try {
        const validationResult = activityPatternSchema.safeParse(pattern);
        
        if (validationResult.success) {
          const validPattern = validationResult.data;
          
          if (!options.minConfidence || validPattern.confidenceScore >= options.minConfidence) {
            validPatterns.push(validPattern as ActivityPattern);
          }
        }
      } catch (error) {
        console.warn('Invalid pattern detected:', error);
      }
    }

    return validPatterns;
  }

  private async savePatterns(
    user: User,
    patterns: ActivityPattern[],
    processingId: string
  ): Promise<void> {
    for (const pattern of patterns) {
      await createActivityPattern(
        {
          ...pattern,
          userId: user.id,
          organizationId: user.organizationId,
          lastDetectedAt: new Date().toISOString(),
        },
        processingId
      );
    }
  }

  private async suggestWorkflow(userId: string, pattern: Partial<ActivityPattern>) {
    // Implementation for workflow suggestion based on detected pattern
    console.log('Suggesting workflow for pattern:', pattern);
  }
}

export const patternDetection = PatternDetectionService.getInstance();