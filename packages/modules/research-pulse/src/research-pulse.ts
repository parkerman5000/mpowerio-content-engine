// Research Pulse - Topic Gathering Module

import {
  db,
  type ResearchTopic,
  type ResearchTopicInsert,
  type TopicSource,
} from '@mpowerio/core';
import { MOCK_TOPICS, getRandomTopics, simulateDelay, type MockTopic } from './mock-data';

// ============================================
// Types
// ============================================

export interface ResearchConfig {
  useMockData?: boolean;
  sources?: TopicSource[];
  minRelevanceScore?: number;
  maxTopicsPerFetch?: number;
}

export interface FetchResult {
  topics: ResearchTopic[];
  source: 'mock' | 'live';
  fetchedAt: Date;
}

// ============================================
// Research Pulse Class
// ============================================

export class ResearchPulse {
  private config: Required<ResearchConfig>;

  constructor(config: ResearchConfig = {}) {
    this.config = {
      useMockData: config.useMockData ?? true,
      sources: config.sources ?? [
        'rss_feed',
        'twitter_trending',
        'reddit',
        'competitor_analysis',
      ],
      minRelevanceScore: config.minRelevanceScore ?? 0.5,
      maxTopicsPerFetch: config.maxTopicsPerFetch ?? 10,
    };
  }

  /**
   * Fetch daily topics from configured sources
   */
  async fetchDailyTopics(): Promise<FetchResult> {
    if (this.config.useMockData) {
      return this.fetchMockTopics();
    }

    // In the future, this will call real APIs
    // For now, always use mock data
    return this.fetchMockTopics();
  }

  /**
   * Fetch topics from mock data and save to database
   */
  private async fetchMockTopics(): Promise<FetchResult> {
    await simulateDelay(300); // Simulate API delay

    const mockTopics = getRandomTopics(this.config.maxTopicsPerFetch);
    const savedTopics: ResearchTopic[] = [];

    for (const mockTopic of mockTopics) {
      // Filter by configured sources
      if (!this.config.sources.includes(mockTopic.source)) {
        continue;
      }

      // Filter by minimum relevance
      if (mockTopic.relevance_score < this.config.minRelevanceScore) {
        continue;
      }

      const topicInsert: ResearchTopicInsert = {
        title: mockTopic.title,
        description: mockTopic.description,
        source: mockTopic.source,
        source_url: mockTopic.source_url,
        keywords: mockTopic.keywords,
        category: mockTopic.category,
        relevance_score: mockTopic.relevance_score,
        trending_score: mockTopic.trending_score,
        is_approved: false,
      };

      try {
        const saved = await db.topics.create(topicInsert);
        savedTopics.push(saved);
      } catch (error) {
        console.error(`Failed to save topic: ${mockTopic.title}`, error);
      }
    }

    return {
      topics: savedTopics,
      source: 'mock',
      fetchedAt: new Date(),
    };
  }

  /**
   * Get all pending (unapproved) topics for review
   */
  async getPendingTopics(): Promise<ResearchTopic[]> {
    return db.topics.list({ approved: false });
  }

  /**
   * Get approved topics ready for script generation
   */
  async getApprovedTopics(limit?: number): Promise<ResearchTopic[]> {
    return db.topics.list({ approved: true, limit });
  }

  /**
   * Approve a topic for script generation
   */
  async approveTopic(topicId: string): Promise<ResearchTopic> {
    return db.topics.approve(topicId);
  }

  /**
   * Reject/archive a topic
   */
  async rejectTopic(topicId: string, reason?: string): Promise<ResearchTopic> {
    return db.topics.update(topicId, {
      is_approved: false,
      notes: reason ? `Rejected: ${reason}` : 'Rejected',
    });
  }

  /**
   * Get topics by category
   */
  async getTopicsByCategory(category: string): Promise<ResearchTopic[]> {
    const allTopics = await db.topics.list();
    return allTopics.filter((t) => t.category === category);
  }

  /**
   * Search topics by keyword
   */
  async searchTopics(query: string): Promise<ResearchTopic[]> {
    const allTopics = await db.topics.list();
    const lowerQuery = query.toLowerCase();

    return allTopics.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQuery) ||
        t.description?.toLowerCase().includes(lowerQuery) ||
        t.keywords.some((k) => k.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get topic statistics
   */
  async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    byCategory: Record<string, number>;
    bySource: Record<string, number>;
  }> {
    const allTopics = await db.topics.list();

    const byCategory: Record<string, number> = {};
    const bySource: Record<string, number> = {};

    for (const topic of allTopics) {
      const cat = topic.category ?? 'Uncategorized';
      byCategory[cat] = (byCategory[cat] ?? 0) + 1;
      bySource[topic.source] = (bySource[topic.source] ?? 0) + 1;
    }

    return {
      total: allTopics.length,
      pending: allTopics.filter((t) => !t.is_approved).length,
      approved: allTopics.filter((t) => t.is_approved).length,
      byCategory,
      bySource,
    };
  }
}

// ============================================
// Convenience Functions
// ============================================

let defaultInstance: ResearchPulse | null = null;

export function getResearchPulse(config?: ResearchConfig): ResearchPulse {
  if (!defaultInstance) {
    defaultInstance = new ResearchPulse(config);
  }
  return defaultInstance;
}

export async function fetchDailyTopics(
  config?: ResearchConfig
): Promise<FetchResult> {
  const pulse = getResearchPulse(config);
  return pulse.fetchDailyTopics();
}
