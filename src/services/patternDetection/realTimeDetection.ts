import { supabase } from '../supabase';
import { advancedMLService, ActivityContext, PatternPrediction } from './advancedML';
import { User, WorkflowAction } from '../../types';
import { nanoid } from 'nanoid';

export interface RealTimePattern {
  id: string;
  patternType: string;
  confidence: number;
  activities: ActivityContext[];
  prediction: PatternPrediction;
  suggestedWorkflow: any;
  status: 'new' | 'viewed' | 'accepted' | 'rejected';
  createdAt: string;
}

export class RealTimeDetectionService {
  private static instance: RealTimeDetectionService;
  private activityBuffer: Map<string, ActivityContext[]> = new Map();
  private detectionQueue: Map<string, NodeJS.Timeout> = new Map();
  private realtimeChannel: any;
  
  private readonly BUFFER_SIZE = 50;
  private readonly DETECTION_INTERVAL = 30000; // 30 seconds
  private readonly MIN_ACTIVITIES_FOR_DETECTION = 5;

  private constructor() {
    this.initializeRealtimeChannel();
    this.startPeriodicDetection();
  }

  static getInstance(): RealTimeDetectionService {
    if (!RealTimeDetectionService.instance) {
      RealTimeDetectionService.instance = new RealTimeDetectionService();
    }
    return RealTimeDetectionService.instance;
  }

  private initializeRealtimeChannel() {
    this.realtimeChannel = supabase.channel('pattern-suggestions');
  }

  private startPeriodicDetection() {
    setInterval(() => {
      this.processAllUserBuffers();
    }, this.DETECTION_INTERVAL);
  }

  async recordActivity(
    user: User,
    action: WorkflowAction,
    context: {
      sessionId: string;
      deviceType: 'desktop' | 'mobile' | 'tablet';
      precedingActions?: WorkflowAction[];
    }
  ): Promise<void> {
    try {
      const now = Date.now();
      const userProfile = await this.getUserBehaviorProfile(user.id);
      
      const activityContext: ActivityContext = {
        userId: user.id,
        organizationId: user.organizationId,
        timestamp: now,
        action,
        sessionId: context.sessionId,
        deviceType: context.deviceType,
        timeOfDay: new Date(now).getHours(),
        dayOfWeek: new Date(now).getDay(),
        precedingActions: context.precedingActions || [],
        userBehaviorProfile: userProfile
      };

      // Store in database for persistence
      await this.storeActivityLog(activityContext);

      // Add to buffer for real-time analysis
      if (!this.activityBuffer.has(user.id)) {
        this.activityBuffer.set(user.id, []);
      }

      const buffer = this.activityBuffer.get(user.id)!;
      buffer.push(activityContext);

      // Maintain buffer size
      if (buffer.length > this.BUFFER_SIZE) {
        buffer.shift();
      }

      // Trigger immediate analysis if we have enough activities
      if (buffer.length >= this.MIN_ACTIVITIES_FOR_DETECTION) {
        this.scheduleDetection(user.id);
      }

    } catch (error) {
      console.error('Failed to record activity:', error);
    }
  }

  private async storeActivityLog(activity: ActivityContext): Promise<void> {
    const { error } = await supabase
      .from('user_activity_log')
      .insert({
        user_id: activity.userId,
        organization_id: activity.organizationId,
        activity_type: activity.action.type,
        activity_data: {
          action: activity.action,
          sessionId: activity.sessionId,
          deviceType: activity.deviceType,
          precedingActions: activity.precedingActions
        },
        context: {
          timeOfDay: activity.timeOfDay,
          dayOfWeek: activity.dayOfWeek,
          userBehaviorProfile: activity.userBehaviorProfile
        },
        timestamp: new Date(activity.timestamp).toISOString()
      });

    if (error) {
      console.error('Failed to store activity log:', error);
    }
  }

  private scheduleDetection(userId: string): void {
    // Clear existing timeout
    const existingTimeout = this.detectionQueue.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule new detection
    const timeout = setTimeout(() => {
      this.analyzeUserActivities(userId);
      this.detectionQueue.delete(userId);
    }, 5000); // 5 second delay to batch activities

    this.detectionQueue.set(userId, timeout);
  }

  private async processAllUserBuffers(): Promise<void> {
    const userIds = Array.from(this.activityBuffer.keys());
    
    for (const userId of userIds) {
      const buffer = this.activityBuffer.get(userId);
      if (buffer && buffer.length >= this.MIN_ACTIVITIES_FOR_DETECTION) {
        await this.analyzeUserActivities(userId);
      }
    }
  }

  private async analyzeUserActivities(userId: string): Promise<void> {
    try {
      const activities = this.activityBuffer.get(userId);
      if (!activities || activities.length < this.MIN_ACTIVITIES_FOR_DETECTION) {
        return;
      }

      // Get user information
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!userProfile) return;

      const user: User = {
        id: userProfile.id,
        email: userProfile.email,
        fullName: userProfile.full_name,
        avatarUrl: userProfile.avatar_url,
        organizationId: userProfile.organization_id,
        role: userProfile.role,
        createdAt: userProfile.created_at
      };

      // Perform advanced ML analysis
      const predictions = await advancedMLService.analyzeActivityPattern(activities, user);

      // Process high-confidence predictions
      for (const prediction of predictions) {
        if (prediction.confidence > 0.75) {
          await this.createPatternSuggestion(user, activities, prediction);
        }
      }

    } catch (error) {
      console.error('Failed to analyze user activities:', error);
    }
  }

  private async createPatternSuggestion(
    user: User,
    activities: ActivityContext[],
    prediction: PatternPrediction
  ): Promise<void> {
    try {
      // Create activity pattern record
      const { data: pattern, error: patternError } = await supabase
        .from('activity_patterns')
        .insert({
          name: `${prediction.patternType} Pattern`,
          description: `Detected ${prediction.patternType} pattern with ${(prediction.confidence * 100).toFixed(1)}% confidence`,
          frequency: Math.round(activities.length / 7), // Per week
          confidence_score: prediction.confidence * 100,
          potential_time_saving: prediction.potentialTimeSaving,
          type: this.mapPatternTypeToEnum(prediction.patternType),
          user_id: user.id,
          organization_id: user.organizationId,
          suggestion_status: 'new'
        })
        .select()
        .single();

      if (patternError) throw patternError;

      // Create detailed suggestion record
      const { data: suggestion, error: suggestionError } = await supabase
        .from('pattern_suggestions')
        .insert({
          pattern_id: pattern.id,
          organization_id: user.organizationId,
          user_id: user.id,
          suggestion_type: prediction.patternType,
          confidence_score: prediction.confidence * 100,
          suggested_workflow: prediction.suggestedWorkflow,
          status: 'pending'
        })
        .select()
        .single();

      if (suggestionError) throw suggestionError;

      // Broadcast real-time notification
      await this.broadcastPatternSuggestion({
        id: suggestion.id,
        patternType: prediction.patternType,
        confidence: prediction.confidence,
        activities,
        prediction,
        suggestedWorkflow: prediction.suggestedWorkflow,
        status: 'new',
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Failed to create pattern suggestion:', error);
    }
  }

  private async broadcastPatternSuggestion(pattern: RealTimePattern): Promise<void> {
    try {
      await this.realtimeChannel.send({
        type: 'broadcast',
        event: 'pattern_suggestion',
        payload: {
          pattern,
          organizationId: pattern.activities[0].organizationId
        }
      });
    } catch (error) {
      console.error('Failed to broadcast pattern suggestion:', error);
    }
  }

  private mapPatternTypeToEnum(patternType: string): 'email' | 'data-entry' | 'reporting' | 'approval' | 'other' {
    const mapping: Record<string, 'email' | 'data-entry' | 'reporting' | 'approval' | 'other'> = {
      'email-automation': 'email',
      'repetitive-data-entry': 'data-entry',
      'weekly-reporting': 'reporting',
      'end-of-day-routine': 'other',
      'approval-workflow': 'approval'
    };

    return mapping[patternType] || 'other';
  }

  private async getUserBehaviorProfile(userId: string): Promise<any> {
    try {
      // Get user's historical activity data
      const { data: activities } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (!activities || activities.length === 0) {
        return this.getDefaultBehaviorProfile();
      }

      // Analyze historical data to build behavior profile
      return this.buildBehaviorProfile(activities);

    } catch (error) {
      console.error('Failed to get user behavior profile:', error);
      return this.getDefaultBehaviorProfile();
    }
  }

  private getDefaultBehaviorProfile(): any {
    return {
      averageSessionDuration: 4 * 60 * 60 * 1000, // 4 hours
      preferredWorkingHours: [9, 10, 11, 14, 15, 16],
      commonActionSequences: [],
      productivityPatterns: {
        peakHours: [10, 11, 14, 15],
        lowActivityPeriods: [12, 13, 17, 18]
      },
      errorProneTasks: [],
      automationAdoptionRate: 0.5
    };
  }

  private buildBehaviorProfile(activities: any[]): any {
    // Analyze activities to build comprehensive behavior profile
    const hours = activities.map(a => new Date(a.timestamp).getHours());
    const sessions = this.groupActivitiesBySessions(activities);
    
    return {
      averageSessionDuration: this.calculateAverageSessionDuration(sessions),
      preferredWorkingHours: this.findPreferredWorkingHours(hours),
      commonActionSequences: this.extractCommonSequences(activities),
      productivityPatterns: this.analyzeProductivityPatterns(activities),
      errorProneTasks: this.identifyErrorProneTasks(activities),
      automationAdoptionRate: this.calculateAutomationAdoptionRate(activities)
    };
  }

  private groupActivitiesBySessions(activities: any[]): any[][] {
    const sessions: any[][] = [];
    let currentSession: any[] = [];
    const sessionGap = 30 * 60 * 1000; // 30 minutes

    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      const prevActivity = activities[i - 1];

      if (!prevActivity || 
          new Date(activity.timestamp).getTime() - new Date(prevActivity.timestamp).getTime() > sessionGap) {
        if (currentSession.length > 0) {
          sessions.push(currentSession);
        }
        currentSession = [activity];
      } else {
        currentSession.push(activity);
      }
    }

    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }

    return sessions;
  }

  private calculateAverageSessionDuration(sessions: any[][]): number {
    if (sessions.length === 0) return 4 * 60 * 60 * 1000;

    const durations = sessions.map(session => {
      if (session.length < 2) return 0;
      const start = new Date(session[0].timestamp).getTime();
      const end = new Date(session[session.length - 1].timestamp).getTime();
      return end - start;
    });

    return durations.reduce((a, b) => a + b, 0) / durations.length;
  }

  private findPreferredWorkingHours(hours: number[]): number[] {
    const hourCounts = new Array(24).fill(0);
    hours.forEach(hour => hourCounts[hour]++);
    
    const avgCount = hourCounts.reduce((a, b) => a + b, 0) / 24;
    return hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(({ count }) => count > avgCount)
      .map(({ hour }) => hour);
  }

  private extractCommonSequences(activities: any[]): string[][] {
    const sequences: string[][] = [];
    const sequenceLength = 3;

    for (let i = 0; i <= activities.length - sequenceLength; i++) {
      const sequence = activities
        .slice(i, i + sequenceLength)
        .map(a => a.activity_type);
      sequences.push(sequence);
    }

    // Find most common sequences
    const sequenceCounts = new Map<string, number>();
    sequences.forEach(seq => {
      const key = seq.join('->');
      sequenceCounts.set(key, (sequenceCounts.get(key) || 0) + 1);
    });

    return Array.from(sequenceCounts.entries())
      .filter(([_, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([seq, _]) => seq.split('->'));
  }

  private analyzeProductivityPatterns(activities: any[]): any {
    const hourlyActivity = new Array(24).fill(0);
    activities.forEach(a => {
      const hour = new Date(a.timestamp).getHours();
      hourlyActivity[hour]++;
    });

    const avgActivity = hourlyActivity.reduce((a, b) => a + b, 0) / 24;
    const peakHours = hourlyActivity
      .map((count, hour) => ({ hour, count }))
      .filter(({ count }) => count > avgActivity * 1.5)
      .map(({ hour }) => hour);

    const lowActivityPeriods = hourlyActivity
      .map((count, hour) => ({ hour, count }))
      .filter(({ count }) => count < avgActivity * 0.5)
      .map(({ hour }) => hour);

    return { peakHours, lowActivityPeriods };
  }

  private identifyErrorProneTasks(activities: any[]): string[] {
    // This would analyze error patterns in activities
    // For now, return empty array
    return [];
  }

  private calculateAutomationAdoptionRate(activities: any[]): number {
    // Calculate based on how often user accepts automation suggestions
    // For now, return default value
    return 0.7;
  }

  // Public methods for managing suggestions
  async markSuggestionAsViewed(suggestionId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('pattern_suggestions')
      .update({ status: 'viewed' })
      .eq('id', suggestionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to mark suggestion as viewed:', error);
    }
  }

  async acceptSuggestion(suggestionId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('pattern_suggestions')
      .update({ 
        status: 'accepted',
        feedback: 'User accepted the suggestion'
      })
      .eq('id', suggestionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to accept suggestion:', error);
    }
  }

  async rejectSuggestion(suggestionId: string, userId: string, feedback?: string): Promise<void> {
    const { error } = await supabase
      .from('pattern_suggestions')
      .update({ 
        status: 'rejected',
        feedback: feedback || 'User rejected the suggestion'
      })
      .eq('id', suggestionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to reject suggestion:', error);
    }
  }

  subscribeToPatternSuggestions(
    organizationId: string,
    callback: (pattern: RealTimePattern) => void
  ): () => void {
    const channel = supabase.channel(`patterns-${organizationId}`);
    
    channel
      .on('broadcast', { event: 'pattern_suggestion' }, ({ payload }) => {
        if (payload.organizationId === organizationId) {
          callback(payload.pattern);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }
}

export const realTimeDetection = RealTimeDetectionService.getInstance();