// Post Queue - Scheduling and posting module

import {
  db,
  type ContentPiece,
  type ContentPieceUpdate,
  type PlatformType,
  PLATFORM_CONFIG,
  getNextOptimalPostTime,
  formatDateTime,
  sleep,
} from '@mpowerio/core';

// ============================================
// Types
// ============================================

export interface PostQueueConfig {
  useMockData?: boolean;
  autoSchedule?: boolean;
  minHoursBetweenPosts?: number;
}

export interface ScheduleOptions {
  scheduledFor?: Date;
  useOptimalTime?: boolean;
}

export interface PostResult {
  contentPieceId: string;
  platform: PlatformType;
  success: boolean;
  platformPostId?: string;
  platformPostUrl?: string;
  error?: string;
}

export interface QueueStats {
  pending: number;
  scheduled: number;
  posted: number;
  failed: number;
  byPlatform: Record<PlatformType, number>;
  upcomingToday: number;
}

// ============================================
// Mock Social API Calls
// ============================================

async function mockPostToYouTube(piece: ContentPiece): Promise<PostResult> {
  await sleep(500);
  console.log(`[MOCK] Posted to YouTube: "${piece.title}"`);
  return {
    contentPieceId: piece.id,
    platform: 'youtube',
    success: true,
    platformPostId: `yt_${Date.now()}`,
    platformPostUrl: `https://youtube.com/shorts/mock_${piece.id}`,
  };
}

async function mockPostToTikTok(piece: ContentPiece): Promise<PostResult> {
  await sleep(500);
  console.log(`[MOCK] Posted to TikTok: "${piece.title}"`);
  return {
    contentPieceId: piece.id,
    platform: 'tiktok',
    success: true,
    platformPostId: `tt_${Date.now()}`,
    platformPostUrl: `https://tiktok.com/@user/video/mock_${piece.id}`,
  };
}

async function mockPostToInstagram(piece: ContentPiece): Promise<PostResult> {
  await sleep(500);
  console.log(`[MOCK] Posted to Instagram: "${piece.title}"`);
  return {
    contentPieceId: piece.id,
    platform: 'instagram',
    success: true,
    platformPostId: `ig_${Date.now()}`,
    platformPostUrl: `https://instagram.com/reel/mock_${piece.id}`,
  };
}

async function mockPostToTwitter(piece: ContentPiece): Promise<PostResult> {
  await sleep(500);
  console.log(`[MOCK] Posted to Twitter: "${piece.title}"`);
  return {
    contentPieceId: piece.id,
    platform: 'twitter',
    success: true,
    platformPostId: `tw_${Date.now()}`,
    platformPostUrl: `https://twitter.com/user/status/mock_${piece.id}`,
  };
}

async function mockPostToLinkedIn(piece: ContentPiece): Promise<PostResult> {
  await sleep(500);
  console.log(`[MOCK] Posted to LinkedIn: "${piece.title}"`);
  return {
    contentPieceId: piece.id,
    platform: 'linkedin',
    success: true,
    platformPostId: `li_${Date.now()}`,
    platformPostUrl: `https://linkedin.com/posts/mock_${piece.id}`,
  };
}

async function mockPostToThreads(piece: ContentPiece): Promise<PostResult> {
  await sleep(500);
  console.log(`[MOCK] Posted to Threads: "${piece.title}"`);
  return {
    contentPieceId: piece.id,
    platform: 'threads',
    success: true,
    platformPostId: `th_${Date.now()}`,
    platformPostUrl: `https://threads.net/t/mock_${piece.id}`,
  };
}

const PLATFORM_POSTERS: Record<PlatformType, (piece: ContentPiece) => Promise<PostResult>> = {
  youtube: mockPostToYouTube,
  tiktok: mockPostToTikTok,
  instagram: mockPostToInstagram,
  twitter: mockPostToTwitter,
  linkedin: mockPostToLinkedIn,
  threads: mockPostToThreads,
};

// ============================================
// Post Queue Class
// ============================================

export class PostQueue {
  private config: Required<PostQueueConfig>;
  private lastPostTime: Map<PlatformType, Date> = new Map();

  constructor(config: PostQueueConfig = {}) {
    this.config = {
      useMockData: config.useMockData ?? true,
      autoSchedule: config.autoSchedule ?? true,
      minHoursBetweenPosts: config.minHoursBetweenPosts ?? 4,
    };
  }

  /**
   * Schedule a content piece for posting
   */
  async schedule(
    contentPieceId: string,
    options?: ScheduleOptions
  ): Promise<ContentPiece> {
    const piece = await db.contentPieces.get(contentPieceId);

    let scheduledFor: Date;

    if (options?.scheduledFor) {
      scheduledFor = options.scheduledFor;
    } else if (options?.useOptimalTime !== false) {
      // Find next optimal time considering other scheduled posts
      scheduledFor = await this.getNextAvailableSlot(piece.platform);
    } else {
      scheduledFor = new Date();
    }

    const updated = await db.contentPieces.update(contentPieceId, {
      scheduled_for: scheduledFor.toISOString(),
      status: 'pending',
    });

    console.log(
      `[PostQueue] Scheduled "${piece.title}" for ${formatDateTime(scheduledFor)} on ${piece.platform}`
    );

    return updated;
  }

  /**
   * Get next available posting slot for a platform
   */
  private async getNextAvailableSlot(platform: PlatformType): Promise<Date> {
    // Get existing scheduled posts
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const scheduled = await db.contentPieces.getScheduled(now, weekFromNow);

    const platformScheduled = scheduled
      .filter((p) => p.platform === platform)
      .map((p) => new Date(p.scheduled_for!));

    // Get next optimal time
    let nextOptimal = getNextOptimalPostTime(platform, now);

    // Ensure minimum gap between posts
    const minGapMs = this.config.minHoursBetweenPosts * 60 * 60 * 1000;

    while (true) {
      const hasConflict = platformScheduled.some(
        (scheduled) => Math.abs(scheduled.getTime() - nextOptimal.getTime()) < minGapMs
      );

      if (!hasConflict) {
        break;
      }

      // Try next day at same time
      nextOptimal = new Date(nextOptimal.getTime() + 24 * 60 * 60 * 1000);
    }

    return nextOptimal;
  }

  /**
   * Post a content piece immediately
   */
  async postNow(contentPieceId: string): Promise<PostResult> {
    const piece = await db.contentPieces.get(contentPieceId);

    // Update status to processing
    await db.contentPieces.update(contentPieceId, { status: 'processing' });

    const poster = PLATFORM_POSTERS[piece.platform];
    const result = await poster(piece);

    // Update with result
    const updates: ContentPieceUpdate = {
      status: result.success ? 'completed' : 'failed',
      posted_at: result.success ? new Date().toISOString() : undefined,
      platform_post_id: result.platformPostId,
      platform_post_url: result.platformPostUrl,
      error_message: result.error,
    };

    await db.contentPieces.update(contentPieceId, updates);

    if (result.success) {
      this.lastPostTime.set(piece.platform, new Date());
    }

    return result;
  }

  /**
   * Process due posts
   */
  async processDuePosts(): Promise<PostResult[]> {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Get posts scheduled for now or recently
    const scheduled = await db.contentPieces.getScheduled(fiveMinutesAgo, now);
    const duePosts = scheduled.filter((p) => p.status === 'pending');

    const results: PostResult[] = [];

    for (const post of duePosts) {
      const result = await this.postNow(post.id);
      results.push(result);
    }

    return results;
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<QueueStats> {
    const allPieces = await db.contentPieces.list();

    const stats: QueueStats = {
      pending: 0,
      scheduled: 0,
      posted: 0,
      failed: 0,
      byPlatform: {
        youtube: 0,
        tiktok: 0,
        instagram: 0,
        twitter: 0,
        linkedin: 0,
        threads: 0,
      },
      upcomingToday: 0,
    };

    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    for (const piece of allPieces) {
      // Count by status
      if (piece.status === 'pending' && piece.scheduled_for) {
        stats.scheduled++;
        if (new Date(piece.scheduled_for) <= endOfDay) {
          stats.upcomingToday++;
        }
      } else if (piece.status === 'pending') {
        stats.pending++;
      } else if (piece.status === 'completed') {
        stats.posted++;
      } else if (piece.status === 'failed') {
        stats.failed++;
      }

      // Count by platform
      stats.byPlatform[piece.platform]++;
    }

    return stats;
  }

  /**
   * Get upcoming scheduled posts
   */
  async getUpcoming(limit: number = 10): Promise<ContentPiece[]> {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const scheduled = await db.contentPieces.getScheduled(now, weekFromNow);
    return scheduled.filter((p) => p.status === 'pending').slice(0, limit);
  }

  /**
   * Cancel a scheduled post
   */
  async cancelScheduled(contentPieceId: string): Promise<ContentPiece> {
    return db.contentPieces.update(contentPieceId, {
      scheduled_for: null,
      status: 'pending',
    });
  }

  /**
   * Reschedule a post
   */
  async reschedule(contentPieceId: string, newDate: Date): Promise<ContentPiece> {
    return db.contentPieces.update(contentPieceId, {
      scheduled_for: newDate.toISOString(),
    });
  }

  /**
   * Bulk schedule content pieces
   */
  async bulkSchedule(contentPieceIds: string[]): Promise<ContentPiece[]> {
    const results: ContentPiece[] = [];

    for (const id of contentPieceIds) {
      const scheduled = await this.schedule(id, { useOptimalTime: true });
      results.push(scheduled);
    }

    return results;
  }
}

// ============================================
// Convenience Functions
// ============================================

let defaultInstance: PostQueue | null = null;

export function getPostQueue(config?: PostQueueConfig): PostQueue {
  if (!defaultInstance) {
    defaultInstance = new PostQueue(config);
  }
  return defaultInstance;
}

export async function schedulePost(
  contentPieceId: string,
  options?: ScheduleOptions
): Promise<ContentPiece> {
  const queue = getPostQueue();
  return queue.schedule(contentPieceId, options);
}

export async function postNow(contentPieceId: string): Promise<PostResult> {
  const queue = getPostQueue();
  return queue.postNow(contentPieceId);
}
