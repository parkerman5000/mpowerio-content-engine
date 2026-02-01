// Analytics Module - Performance tracking and feedback loop

import {
  db,
  type ContentPiece,
  type PostAnalytics,
  type PostAnalyticsInsert,
  type ResearchPriority,
  type PlatformType,
  calculateEngagementRate,
  calculatePriorityScore,
  sleep,
} from '@mpowerio/core';

// ============================================
// Types
// ============================================

export interface AnalyticsConfig {
  useMockData?: boolean;
}

export interface PerformanceReport {
  period: { start: Date; end: Date };
  summary: {
    totalViews: number;
    totalEngagement: number;
    avgEngagementRate: number;
    totalPosts: number;
    newFollowers: number;
  };
  byPlatform: Record<
    PlatformType,
    {
      views: number;
      engagement: number;
      engagementRate: number;
      posts: number;
      topContent: string | null;
    }
  >;
  topPerforming: Array<{
    title: string;
    platform: PlatformType;
    views: number;
    engagementRate: number;
  }>;
  trendingKeywords: Array<{
    keyword: string;
    score: number;
    posts: number;
    avgEngagement: number;
  }>;
}

export interface MockMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  impressions: number;
  reach: number;
  watchTimeSeconds: number;
  avgWatchPercentage: number;
  newFollowers: number;
  profileVisits: number;
  linkClicks: number;
}

// ============================================
// Mock Metrics Generator
// ============================================

function generateMockMetrics(platform: PlatformType): MockMetrics {
  // Base metrics vary by platform
  const platformMultipliers: Record<PlatformType, number> = {
    tiktok: 1.5,
    youtube: 1.2,
    instagram: 1.0,
    linkedin: 0.7,
    twitter: 0.8,
    threads: 0.6,
  };

  const multiplier = platformMultipliers[platform];
  const baseViews = Math.floor(1000 + Math.random() * 5000);

  const views = Math.floor(baseViews * multiplier);
  const engagementBase = views * (0.03 + Math.random() * 0.07); // 3-10% engagement

  return {
    views,
    likes: Math.floor(engagementBase * 0.6),
    comments: Math.floor(engagementBase * 0.15),
    shares: Math.floor(engagementBase * 0.15),
    saves: Math.floor(engagementBase * 0.1),
    impressions: Math.floor(views * 1.3),
    reach: Math.floor(views * 0.9),
    watchTimeSeconds: Math.floor(views * (15 + Math.random() * 30)),
    avgWatchPercentage: Math.floor(40 + Math.random() * 40),
    newFollowers: Math.floor(views * 0.005),
    profileVisits: Math.floor(views * 0.02),
    linkClicks: Math.floor(views * 0.01),
  };
}

// ============================================
// Analytics Class
// ============================================

export class Analytics {
  private config: Required<AnalyticsConfig>;

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      useMockData: config.useMockData ?? true,
    };
  }

  /**
   * Fetch and store analytics for a content piece
   */
  async fetchAnalytics(contentPieceId: string): Promise<PostAnalytics> {
    const piece = await db.contentPieces.get(contentPieceId);

    if (!piece.posted_at) {
      throw new Error('Content piece has not been posted yet');
    }

    const metrics = this.config.useMockData
      ? generateMockMetrics(piece.platform)
      : await this.fetchRealMetrics(piece);

    const engagementRate = calculateEngagementRate({
      views: metrics.views,
      likes: metrics.likes,
      comments: metrics.comments,
      shares: metrics.shares,
      saves: metrics.saves,
    });

    const analyticsInsert: PostAnalyticsInsert = {
      content_piece_id: contentPieceId,
      platform: piece.platform,
      metrics_date: new Date().toISOString().split('T')[0]!,
      views: metrics.views,
      likes: metrics.likes,
      comments: metrics.comments,
      shares: metrics.shares,
      saves: metrics.saves,
      impressions: metrics.impressions,
      reach: metrics.reach,
      engagement_rate: engagementRate,
      watch_time_seconds: metrics.watchTimeSeconds,
      avg_watch_percentage: metrics.avgWatchPercentage,
      new_followers: metrics.newFollowers,
      profile_visits: metrics.profileVisits,
      link_clicks: metrics.linkClicks,
      raw_metrics: metrics,
    };

    return db.analytics.upsert(analyticsInsert);
  }

  /**
   * Fetch real metrics from platform APIs (stub)
   */
  private async fetchRealMetrics(piece: ContentPiece): Promise<MockMetrics> {
    // In production, this would call the actual platform APIs
    await sleep(500);
    console.log(`[Analytics] Fetching real metrics for ${piece.platform}: ${piece.id}`);
    return generateMockMetrics(piece.platform);
  }

  /**
   * Update research priorities based on analytics
   */
  async updateResearchPriorities(): Promise<ResearchPriority[]> {
    // Get all content pieces with analytics
    const allPieces = await db.contentPieces.list();
    const postedPieces = allPieces.filter((p) => p.status === 'completed');

    // Extract keywords and their performance
    const keywordPerformance: Map<
      string,
      { totalViews: number; totalEngagement: number; count: number }
    > = new Map();

    for (const piece of postedPieces) {
      const analytics = await db.analytics.getForContent(piece.id);
      if (analytics.length === 0) continue;

      const latestAnalytics = analytics[0]!;

      // Extract keywords from hashtags and title
      const keywords = [
        ...piece.hashtags,
        ...piece.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
      ];

      for (const keyword of keywords) {
        const existing = keywordPerformance.get(keyword) ?? {
          totalViews: 0,
          totalEngagement: 0,
          count: 0,
        };

        existing.totalViews += latestAnalytics.views;
        existing.totalEngagement +=
          latestAnalytics.likes +
          latestAnalytics.comments +
          latestAnalytics.shares;
        existing.count++;

        keywordPerformance.set(keyword, existing);
      }
    }

    // Update research priorities
    const updatedPriorities: ResearchPriority[] = [];

    for (const [keyword, perf] of keywordPerformance) {
      const avgEngagementRate =
        perf.totalViews > 0 ? perf.totalEngagement / perf.totalViews : 0;

      const priorityScore = calculatePriorityScore(
        avgEngagementRate,
        perf.totalViews
      );

      const priority = await db.priorities.upsertByKeyword({
        keyword,
        total_posts: perf.count,
        avg_engagement_rate: avgEngagementRate,
        total_views: perf.totalViews,
        total_engagement: perf.totalEngagement,
        priority_score: priorityScore,
      });

      updatedPriorities.push(priority);
    }

    return updatedPriorities;
  }

  /**
   * Get top performing keywords
   */
  async getTopKeywords(limit: number = 10): Promise<ResearchPriority[]> {
    const priorities = await db.priorities.list({ blocked: false, limit });
    return priorities;
  }

  /**
   * Generate performance report
   */
  async generateReport(startDate: Date, endDate: Date): Promise<PerformanceReport> {
    const allPieces = await db.contentPieces.list();

    // Filter to posted pieces in date range
    const postedPieces = allPieces.filter((p) => {
      if (p.status !== 'completed' || !p.posted_at) return false;
      const postedAt = new Date(p.posted_at);
      return postedAt >= startDate && postedAt <= endDate;
    });

    // Initialize platform stats
    const platformStats: PerformanceReport['byPlatform'] = {
      youtube: { views: 0, engagement: 0, engagementRate: 0, posts: 0, topContent: null },
      tiktok: { views: 0, engagement: 0, engagementRate: 0, posts: 0, topContent: null },
      instagram: { views: 0, engagement: 0, engagementRate: 0, posts: 0, topContent: null },
      twitter: { views: 0, engagement: 0, engagementRate: 0, posts: 0, topContent: null },
      linkedin: { views: 0, engagement: 0, engagementRate: 0, posts: 0, topContent: null },
      threads: { views: 0, engagement: 0, engagementRate: 0, posts: 0, topContent: null },
    };

    let totalViews = 0;
    let totalEngagement = 0;
    let totalNewFollowers = 0;

    const contentPerformance: Array<{
      piece: ContentPiece;
      analytics: PostAnalytics;
    }> = [];

    // Gather analytics for all pieces
    for (const piece of postedPieces) {
      const analytics = await db.analytics.getForContent(piece.id);
      if (analytics.length === 0) continue;

      const latest = analytics[0]!;
      contentPerformance.push({ piece, analytics: latest });

      // Update totals
      totalViews += latest.views;
      const engagement = latest.likes + latest.comments + latest.shares + latest.saves;
      totalEngagement += engagement;
      totalNewFollowers += latest.new_followers;

      // Update platform stats
      const platStats = platformStats[piece.platform];
      platStats.views += latest.views;
      platStats.engagement += engagement;
      platStats.posts++;

      // Track top content per platform
      if (
        !platStats.topContent ||
        latest.views > (platformStats[piece.platform].views / platStats.posts)
      ) {
        platStats.topContent = piece.title;
      }
    }

    // Calculate engagement rates
    for (const platform of Object.keys(platformStats) as PlatformType[]) {
      const stats = platformStats[platform];
      stats.engagementRate = stats.views > 0 ? stats.engagement / stats.views : 0;
    }

    // Sort for top performing
    const topPerforming = contentPerformance
      .sort((a, b) => b.analytics.views - a.analytics.views)
      .slice(0, 5)
      .map((cp) => ({
        title: cp.piece.title,
        platform: cp.piece.platform,
        views: cp.analytics.views,
        engagementRate: cp.analytics.engagement_rate,
      }));

    // Get trending keywords
    const keywords = await this.getTopKeywords(10);
    const trendingKeywords = keywords.map((k) => ({
      keyword: k.keyword,
      score: k.priority_score,
      posts: k.total_posts,
      avgEngagement: k.avg_engagement_rate,
    }));

    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalViews,
        totalEngagement,
        avgEngagementRate: totalViews > 0 ? totalEngagement / totalViews : 0,
        totalPosts: postedPieces.length,
        newFollowers: totalNewFollowers,
      },
      byPlatform: platformStats,
      topPerforming,
      trendingKeywords,
    };
  }

  /**
   * Get analytics history for a content piece
   */
  async getContentHistory(contentPieceId: string): Promise<PostAnalytics[]> {
    return db.analytics.getForContent(contentPieceId);
  }

  /**
   * Block a keyword from research priorities
   */
  async blockKeyword(keyword: string): Promise<void> {
    const priorities = await db.priorities.list();
    const existing = priorities.find((p) => p.keyword === keyword);

    if (existing) {
      await db.priorities.upsertByKeyword({
        keyword,
        is_blocked: true,
      });
    }
  }

  /**
   * Boost a keyword's priority
   */
  async boostKeyword(keyword: string, boostAmount: number): Promise<ResearchPriority> {
    return db.priorities.upsertByKeyword({
      keyword,
      manual_boost: Math.max(-1, Math.min(1, boostAmount)),
    });
  }
}

// ============================================
// Convenience Functions
// ============================================

let defaultInstance: Analytics | null = null;

export function getAnalytics(config?: AnalyticsConfig): Analytics {
  if (!defaultInstance) {
    defaultInstance = new Analytics(config);
  }
  return defaultInstance;
}

export async function fetchAnalytics(contentPieceId: string): Promise<PostAnalytics> {
  const analytics = getAnalytics();
  return analytics.fetchAnalytics(contentPieceId);
}

export async function updateResearchPriorities(): Promise<ResearchPriority[]> {
  const analytics = getAnalytics();
  return analytics.updateResearchPriorities();
}
