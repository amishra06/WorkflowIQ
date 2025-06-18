import { Matrix } from 'ml-matrix';
import { RandomForestClassifier } from 'ml-random-forest';
import { PCA } from 'ml-pca';
import * as distance from 'ml-distance';
import { supabase } from '../supabase';
import { User, WorkflowAction } from '../../types';

// Fix ml-kmeans import
import * as mlKmeans from 'ml-kmeans';

export interface ActivityContext {
  userId: string;
  organizationId: string;
  timestamp: number;
  action: WorkflowAction;
  sessionId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6
  precedingActions: WorkflowAction[];
  followingActions?: WorkflowAction[];
  userBehaviorProfile: UserBehaviorProfile;
}

export interface UserBehaviorProfile {
  averageSessionDuration: number;
  preferredWorkingHours: number[];
  commonActionSequences: string[][];
  productivityPatterns: {
    peakHours: number[];
    lowActivityPeriods: number[];
  };
  errorProneTasks: string[];
  automationAdoptionRate: number;
}

export interface PatternPrediction {
  patternType: string;
  confidence: number;
  suggestedWorkflow: any;
  potentialTimeSaving: number;
  implementationComplexity: 'low' | 'medium' | 'high';
  riskAssessment: {
    dataQuality: number;
    userAdoption: number;
    technicalFeasibility: number;
  };
  features: {
    temporal: number[];
    sequential: number[];
    contextual: number[];
    behavioral: number[];
  };
}

export class AdvancedMLService {
  private static instance: AdvancedMLService;
  private models: Map<string, any> = new Map();
  private featureCache: Map<string, number[]> = new Map();
  private userProfiles: Map<string, UserBehaviorProfile> = new Map();

  private constructor() {
    this.initializeModels();
  }

  static getInstance(): AdvancedMLService {
    if (!AdvancedMLService.instance) {
      AdvancedMLService.instance = new AdvancedMLService();
    }
    return AdvancedMLService.instance;
  }

  private async initializeModels() {
    // Initialize Random Forest for pattern classification
    this.models.set('patternClassifier', new RandomForestClassifier({
      nEstimators: 100,
      maxDepth: 10,
      minSamplesLeaf: 2
    }));

    // Load pre-trained models if available
    await this.loadPretrainedModels();
  }

  async analyzeActivityPattern(
    activities: ActivityContext[],
    user: User
  ): Promise<PatternPrediction[]> {
    try {
      // Extract sophisticated features
      const features = await this.extractAdvancedFeatures(activities, user);
      
      // Apply dimensionality reduction
      const reducedFeatures = this.applyPCA(features);
      
      // Cluster similar activities
      const clusters = await this.performAdvancedClustering(reducedFeatures);
      
      // Generate predictions for each cluster
      const predictions: PatternPrediction[] = [];
      
      for (let i = 0; i < clusters.centroids.length; i++) {
        const clusterActivities = activities.filter((_, idx) => clusters.clusters[idx] === i);
        
        if (clusterActivities.length >= 3) {
          const prediction = await this.generatePatternPrediction(
            clusterActivities,
            features[i],
            user
          );
          
          if (prediction.confidence > 0.7) {
            predictions.push(prediction);
          }
        }
      }
      
      // Rank predictions by potential impact
      return this.rankPredictions(predictions);
    } catch (error) {
      console.error('Advanced ML analysis failed:', error);
      throw error;
    }
  }

  private async extractAdvancedFeatures(
    activities: ActivityContext[],
    user: User
  ): Promise<number[][]> {
    const features: number[][] = [];
    
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      const feature = await this.extractSingleActivityFeatures(activity, activities, i);
      features.push(feature);
    }
    
    return features;
  }

  private async extractSingleActivityFeatures(
    activity: ActivityContext,
    allActivities: ActivityContext[],
    index: number
  ): Promise<number[]> {
    const features: number[] = [];
    
    // Temporal features (enhanced)
    features.push(
      activity.timeOfDay / 24,
      activity.dayOfWeek / 7,
      Math.sin(2 * Math.PI * activity.timeOfDay / 24), // Cyclical time
      Math.cos(2 * Math.PI * activity.timeOfDay / 24),
      Math.sin(2 * Math.PI * activity.dayOfWeek / 7), // Cyclical day
      Math.cos(2 * Math.PI * activity.dayOfWeek / 7)
    );
    
    // Sequential features
    const sequenceFeatures = this.extractSequenceFeatures(activity, allActivities, index);
    features.push(...sequenceFeatures);
    
    // Contextual features
    const contextFeatures = this.extractContextualFeatures(activity);
    features.push(...contextFeatures);
    
    // Behavioral features
    const behavioralFeatures = this.extractBehavioralFeatures(activity);
    features.push(...behavioralFeatures);
    
    // Complexity features
    const complexityFeatures = this.extractComplexityFeatures(activity);
    features.push(...complexityFeatures);
    
    return features;
  }

  private extractSequenceFeatures(
    activity: ActivityContext,
    allActivities: ActivityContext[],
    index: number
  ): number[] {
    const features: number[] = [];
    
    // N-gram analysis (2-gram, 3-gram)
    const window = 3;
    const precedingActions = allActivities
      .slice(Math.max(0, index - window), index)
      .map(a => a.action.type);
    
    const followingActions = allActivities
      .slice(index + 1, Math.min(allActivities.length, index + window + 1))
      .map(a => a.action.type);
    
    // Sequence similarity with common patterns
    const commonSequences = this.getCommonSequences(activity.userId);
    features.push(this.calculateSequenceSimilarity(precedingActions, commonSequences));
    
    // Action repetition frequency
    const actionType = activity.action.type;
    const recentSimilarActions = allActivities
      .slice(Math.max(0, index - 10), index)
      .filter(a => a.action.type === actionType).length;
    
    features.push(recentSimilarActions / 10);
    
    // Time gaps between similar actions
    const timeSinceLastSimilar = this.getTimeSinceLastSimilarAction(
      activity,
      allActivities,
      index
    );
    features.push(Math.min(timeSinceLastSimilar / (24 * 60 * 60 * 1000), 1)); // Normalize to days
    
    return features;
  }

  private extractContextualFeatures(activity: ActivityContext): number[] {
    const features: number[] = [];
    
    // Device type encoding
    const deviceEncoding = {
      'desktop': [1, 0, 0],
      'mobile': [0, 1, 0],
      'tablet': [0, 0, 1]
    };
    features.push(...deviceEncoding[activity.deviceType]);
    
    // Action configuration complexity
    const configComplexity = this.calculateConfigComplexity(activity.action.config);
    features.push(configComplexity);
    
    // User context features
    const profile = activity.userBehaviorProfile;
    features.push(
      profile.averageSessionDuration / (8 * 60 * 60 * 1000), // Normalize to 8 hours
      profile.automationAdoptionRate,
      profile.preferredWorkingHours.length / 24
    );
    
    return features;
  }

  private extractBehavioralFeatures(activity: ActivityContext): number[] {
    const features: number[] = [];
    const profile = activity.userBehaviorProfile;
    
    // Productivity alignment
    const isInPeakHours = profile.productivityPatterns.peakHours.includes(activity.timeOfDay);
    const isInLowActivity = profile.productivityPatterns.lowActivityPeriods.includes(activity.timeOfDay);
    
    features.push(
      isInPeakHours ? 1 : 0,
      isInLowActivity ? 1 : 0
    );
    
    // Error proneness
    const isErrorProneTask = profile.errorProneTasks.includes(activity.action.type);
    features.push(isErrorProneTask ? 1 : 0);
    
    // Sequence familiarity
    const sequenceFamiliarity = this.calculateSequenceFamiliarity(
      activity,
      profile.commonActionSequences
    );
    features.push(sequenceFamiliarity);
    
    return features;
  }

  private extractComplexityFeatures(activity: ActivityContext): number[] {
    const features: number[] = [];
    
    // Action type complexity mapping
    const complexityMap: Record<string, number> = {
      'email': 0.3,
      'data-entry': 0.7,
      'reporting': 0.9,
      'approval': 0.4,
      'other': 0.5
    };
    
    const baseComplexity = complexityMap[activity.action.type] || 0.5;
    features.push(baseComplexity);
    
    // Configuration complexity
    const configSize = JSON.stringify(activity.action.config).length;
    features.push(Math.min(configSize / 1000, 1)); // Normalize
    
    // Dependency complexity
    const dependencyCount = activity.precedingActions.length;
    features.push(Math.min(dependencyCount / 5, 1)); // Normalize
    
    return features;
  }

  private applyPCA(features: number[][]): number[][] {
    if (features.length < 10) return features; // Skip PCA for small datasets
    
    try {
      const matrix = new Matrix(features);
      const pca = new PCA(matrix);
      
      // Keep 95% of variance
      const components = pca.getExplainedVariance().findIndex(v => v >= 0.95) + 1;
      return pca.predict(matrix, Math.max(components, 5)).to2DArray();
    } catch (error) {
      console.warn('PCA failed, using original features:', error);
      return features;
    }
  }

  private async performAdvancedClustering(features: number[][]): Promise<{
    clusters: number[];
    centroids: number[][];
  }> {
    const matrix = new Matrix(features);
    const optimalK = this.determineOptimalClusters(features);
    
    // Use the correct KMeans constructor
    const kmeans = new mlKmeans.KMeans(matrix, optimalK, {
      initialization: 'kmeans++',
      distanceFunction: distance.euclidean,
      maxIterations: 100
    });
    
    return {
      clusters: kmeans.clusters,
      centroids: kmeans.centroids.to2DArray()
    };
  }

  private determineOptimalClusters(features: number[][]): number {
    // Use elbow method to determine optimal number of clusters
    const maxK = Math.min(10, Math.floor(features.length / 3));
    let bestK = 2;
    let bestScore = Infinity;
    
    for (let k = 2; k <= maxK; k++) {
      try {
        const matrix = new Matrix(features);
        const kmeans = new mlKmeans.KMeans(matrix, k);
        const score = this.calculateWCSS(features, kmeans.clusters, kmeans.centroids.to2DArray());
        
        if (score < bestScore) {
          bestScore = score;
          bestK = k;
        }
      } catch (error) {
        break;
      }
    }
    
    return bestK;
  }

  private calculateWCSS(
    features: number[][],
    clusters: number[],
    centroids: number[][]
  ): number {
    let wcss = 0;
    
    for (let i = 0; i < features.length; i++) {
      const clusterIndex = clusters[i];
      const centroid = centroids[clusterIndex];
      const distanceValue = distance.euclidean(features[i], centroid);
      wcss += distanceValue * distanceValue;
    }
    
    return wcss;
  }

  private async generatePatternPrediction(
    activities: ActivityContext[],
    features: number[],
    user: User
  ): Promise<PatternPrediction> {
    // Classify pattern type using trained model
    const patternType = await this.classifyPatternType(features);
    
    // Calculate confidence based on multiple factors
    const confidence = this.calculatePredictionConfidence(activities, features);
    
    // Generate suggested workflow
    const suggestedWorkflow = await this.generateSuggestedWorkflow(activities, patternType);
    
    // Estimate time savings
    const potentialTimeSaving = this.estimateTimeSavings(activities, patternType);
    
    // Assess implementation complexity
    const implementationComplexity = this.assessImplementationComplexity(activities);
    
    // Risk assessment
    const riskAssessment = this.assessRisks(activities, features);
    
    return {
      patternType,
      confidence,
      suggestedWorkflow,
      potentialTimeSaving,
      implementationComplexity,
      riskAssessment,
      features: {
        temporal: features.slice(0, 6),
        sequential: features.slice(6, 16),
        contextual: features.slice(16, 26),
        behavioral: features.slice(26, 36)
      }
    };
  }

  private async classifyPatternType(features: number[]): Promise<string> {
    // Use trained classifier or rule-based classification
    const classifier = this.models.get('patternClassifier');
    
    if (classifier && classifier.isTrained) {
      return classifier.predict([features])[0];
    }
    
    // Fallback to rule-based classification
    return this.ruleBasedClassification(features);
  }

  private ruleBasedClassification(features: number[]): string {
    // Simple rule-based classification based on feature patterns
    const [timeOfDay, dayOfWeek, ...rest] = features;
    
    if (timeOfDay > 0.7 && dayOfWeek < 0.7) {
      return 'end-of-day-routine';
    } else if (dayOfWeek > 0.8) {
      return 'weekly-reporting';
    } else if (features[10] > 0.8) { // High repetition
      return 'repetitive-data-entry';
    } else {
      return 'general-automation';
    }
  }

  private calculatePredictionConfidence(
    activities: ActivityContext[],
    features: number[]
  ): number {
    let confidence = 0;
    
    // Frequency consistency (40% weight)
    const frequencyConsistency = this.calculateFrequencyConsistency(activities);
    confidence += frequencyConsistency * 0.4;
    
    // Pattern stability (30% weight)
    const patternStability = this.calculatePatternStability(features);
    confidence += patternStability * 0.3;
    
    // Data quality (20% weight)
    const dataQuality = this.assessDataQuality(activities);
    confidence += dataQuality * 0.2;
    
    // Sample size bonus (10% weight)
    const sampleSizeBonus = Math.min(activities.length / 20, 1);
    confidence += sampleSizeBonus * 0.1;
    
    return Math.min(confidence, 1);
  }

  private rankPredictions(predictions: PatternPrediction[]): PatternPrediction[] {
    return predictions.sort((a, b) => {
      // Multi-criteria ranking
      const scoreA = this.calculatePredictionScore(a);
      const scoreB = this.calculatePredictionScore(b);
      return scoreB - scoreA;
    });
  }

  private calculatePredictionScore(prediction: PatternPrediction): number {
    const weights = {
      confidence: 0.3,
      timeSaving: 0.3,
      feasibility: 0.2,
      riskScore: 0.2
    };
    
    const riskScore = 1 - (
      (1 - prediction.riskAssessment.dataQuality) +
      (1 - prediction.riskAssessment.userAdoption) +
      (1 - prediction.riskAssessment.technicalFeasibility)
    ) / 3;
    
    const complexityPenalty = prediction.implementationComplexity === 'high' ? 0.7 :
                             prediction.implementationComplexity === 'medium' ? 0.85 : 1;
    
    return (
      prediction.confidence * weights.confidence +
      (prediction.potentialTimeSaving / 300) * weights.timeSaving + // Normalize to 5 hours
      riskScore * weights.riskScore +
      complexityPenalty * weights.feasibility
    );
  }

  // Helper methods
  private getCommonSequences(userId: string): string[][] {
    const profile = this.userProfiles.get(userId);
    return profile?.commonActionSequences || [];
  }

  private calculateSequenceSimilarity(sequence: string[], commonSequences: string[][]): number {
    if (commonSequences.length === 0) return 0;
    
    let maxSimilarity = 0;
    for (const commonSeq of commonSequences) {
      const similarity = this.calculateJaccardSimilarity(sequence, commonSeq);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }
    
    return maxSimilarity;
  }

  private calculateJaccardSimilarity(seq1: string[], seq2: string[]): number {
    const set1 = new Set(seq1);
    const set2 = new Set(seq2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  private getTimeSinceLastSimilarAction(
    activity: ActivityContext,
    allActivities: ActivityContext[],
    index: number
  ): number {
    for (let i = index - 1; i >= 0; i--) {
      if (allActivities[i].action.type === activity.action.type) {
        return activity.timestamp - allActivities[i].timestamp;
      }
    }
    return 24 * 60 * 60 * 1000; // Default to 1 day
  }

  private calculateConfigComplexity(config: Record<string, any>): number {
    const configStr = JSON.stringify(config);
    const complexity = (
      Object.keys(config).length * 0.1 +
      configStr.length / 1000 +
      (configStr.match(/\{|\[/g) || []).length * 0.05
    );
    
    return Math.min(complexity, 1);
  }

  private calculateSequenceFamiliarity(
    activity: ActivityContext,
    commonSequences: string[][]
  ): number {
    const currentSequence = [
      ...activity.precedingActions.map(a => a.type),
      activity.action.type
    ];
    
    return this.calculateSequenceSimilarity(currentSequence, commonSequences);
  }

  private calculateFrequencyConsistency(activities: ActivityContext[]): number {
    const intervals = activities.slice(1).map((a, i) => 
      a.timestamp - activities[i].timestamp
    );
    
    if (intervals.length < 2) return 0.5;
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
    const coefficient = Math.sqrt(variance) / avgInterval;
    
    return Math.max(0, 1 - coefficient);
  }

  private calculatePatternStability(features: number[]): number {
    // Measure how stable the feature values are
    const variance = features.reduce((sum, val) => sum + Math.pow(val - 0.5, 2), 0) / features.length;
    return Math.max(0, 1 - variance * 2);
  }

  private assessDataQuality(activities: ActivityContext[]): number {
    let quality = 1;
    
    // Penalize missing data
    const missingDataPenalty = activities.filter(a => 
      !a.action.config || Object.keys(a.action.config).length === 0
    ).length / activities.length;
    
    quality -= missingDataPenalty * 0.3;
    
    // Penalize inconsistent timestamps
    const timeInconsistencies = activities.filter((a, i) => 
      i > 0 && a.timestamp <= activities[i - 1].timestamp
    ).length;
    
    quality -= (timeInconsistencies / activities.length) * 0.2;
    
    return Math.max(0, quality);
  }

  private async generateSuggestedWorkflow(
    activities: ActivityContext[],
    patternType: string
  ): Promise<any> {
    // Generate workflow based on pattern type and activities
    const triggers = this.generateTriggers(activities, patternType);
    const actions = this.generateActions(activities, patternType);
    
    return {
      name: `Auto-generated ${patternType} workflow`,
      description: `Automated workflow for ${patternType} pattern`,
      triggers,
      actions,
      estimatedTimeSaving: this.estimateTimeSavings(activities, patternType)
    };
  }

  private generateTriggers(activities: ActivityContext[], patternType: string): any[] {
    // Generate appropriate triggers based on pattern analysis
    const timePatterns = this.analyzeTimePatterns(activities);
    
    if (timePatterns.isScheduleBased) {
      return [{
        type: 'schedule',
        config: {
          frequency: timePatterns.frequency,
          time: timePatterns.preferredTime
        }
      }];
    } else {
      return [{
        type: 'event',
        config: {
          eventType: activities[0].action.type,
          conditions: this.extractTriggerConditions(activities)
        }
      }];
    }
  }

  private generateActions(activities: ActivityContext[], patternType: string): any[] {
    // Generate workflow actions based on common activity patterns
    const actionGroups = this.groupSimilarActions(activities);
    
    return actionGroups.map(group => ({
      type: group.type,
      config: this.mergeActionConfigs(group.actions)
    }));
  }

  private estimateTimeSavings(activities: ActivityContext[], patternType: string): number {
    const baseTimeSavings: Record<string, number> = {
      'repetitive-data-entry': 15,
      'weekly-reporting': 30,
      'end-of-day-routine': 10,
      'general-automation': 8
    };
    
    const baseSaving = baseTimeSavings[patternType] || 10;
    const frequencyMultiplier = activities.length / 7; // Per week
    
    return Math.round(baseSaving * frequencyMultiplier);
  }

  private assessImplementationComplexity(activities: ActivityContext[]): 'low' | 'medium' | 'high' {
    const uniqueActionTypes = new Set(activities.map(a => a.action.type)).size;
    const avgConfigComplexity = activities.reduce((sum, a) => 
      sum + this.calculateConfigComplexity(a.action.config), 0
    ) / activities.length;
    
    if (uniqueActionTypes <= 2 && avgConfigComplexity < 0.3) {
      return 'low';
    } else if (uniqueActionTypes <= 4 && avgConfigComplexity < 0.6) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  private assessRisks(activities: ActivityContext[], features: number[]): {
    dataQuality: number;
    userAdoption: number;
    technicalFeasibility: number;
  } {
    return {
      dataQuality: this.assessDataQuality(activities),
      userAdoption: this.assessUserAdoptionRisk(activities),
      technicalFeasibility: this.assessTechnicalFeasibility(activities)
    };
  }

  private assessUserAdoptionRisk(activities: ActivityContext[]): number {
    const profile = activities[0]?.userBehaviorProfile;
    if (!profile) return 0.5;
    
    // Higher adoption rate = lower risk
    return profile.automationAdoptionRate;
  }

  private assessTechnicalFeasibility(activities: ActivityContext[]): number {
    const supportedActionTypes = ['email', 'data-entry', 'reporting', 'approval'];
    const supportedActions = activities.filter(a => 
      supportedActionTypes.includes(a.action.type)
    ).length;
    
    return supportedActions / activities.length;
  }

  // Additional helper methods
  private analyzeTimePatterns(activities: ActivityContext[]): {
    isScheduleBased: boolean;
    frequency: string;
    preferredTime: string;
  } {
    const hours = activities.map(a => a.timeOfDay);
    const avgHour = hours.reduce((a, b) => a + b, 0) / hours.length;
    const hourVariance = hours.reduce((a, b) => a + Math.pow(b - avgHour, 2), 0) / hours.length;
    
    return {
      isScheduleBased: hourVariance < 2, // Low variance indicates schedule-based
      frequency: this.determineFrequency(activities),
      preferredTime: `${Math.round(avgHour)}:00`
    };
  }

  private determineFrequency(activities: ActivityContext[]): string {
    const timeSpan = activities[activities.length - 1].timestamp - activities[0].timestamp;
    const days = timeSpan / (24 * 60 * 60 * 1000);
    const frequency = activities.length / days;
    
    if (frequency >= 0.8) return 'daily';
    if (frequency >= 0.3) return 'weekly';
    return 'monthly';
  }

  private extractTriggerConditions(activities: ActivityContext[]): any {
    // Extract common conditions from activities
    const commonConfigs = activities.map(a => a.action.config);
    const conditions: any = {};
    
    // Find common configuration patterns
    for (const config of commonConfigs) {
      for (const [key, value] of Object.entries(config)) {
        if (!conditions[key]) {
          conditions[key] = [];
        }
        if (!conditions[key].includes(value)) {
          conditions[key].push(value);
        }
      }
    }
    
    return conditions;
  }

  private groupSimilarActions(activities: ActivityContext[]): Array<{
    type: string;
    actions: ActivityContext[];
  }> {
    const groups = new Map<string, ActivityContext[]>();
    
    for (const activity of activities) {
      const type = activity.action.type;
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type)!.push(activity);
    }
    
    return Array.from(groups.entries()).map(([type, actions]) => ({
      type,
      actions
    }));
  }

  private mergeActionConfigs(activities: ActivityContext[]): any {
    const configs = activities.map(a => a.action.config);
    const merged: any = {};
    
    // Merge configurations, preferring most common values
    for (const config of configs) {
      for (const [key, value] of Object.entries(config)) {
        if (!merged[key]) {
          merged[key] = value;
        }
      }
    }
    
    return merged;
  }

  private async loadPretrainedModels(): Promise<void> {
    // Load any pre-trained models from storage
    // This would typically load from a model registry or file system
    try {
      // Placeholder for model loading logic
      console.log('Loading pre-trained models...');
    } catch (error) {
      console.warn('Failed to load pre-trained models:', error);
    }
  }
}

export const advancedMLService = AdvancedMLService.getInstance();