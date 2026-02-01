// mpowerio Content Engine - Utility Functions

import type { PlatformType, ContentFormat } from './types';

// ============================================
// Platform Utilities
// ============================================

export const PLATFORM_CONFIG: Record<
  PlatformType,
  {
    name: string;
    maxCaptionLength: number;
    maxHashtags: number;
    supportedFormats: ContentFormat[];
    optimalPostingTimes: { hour: number; day: number }[];
  }
> = {
  youtube: {
    name: 'YouTube',
    maxCaptionLength: 5000,
    maxHashtags: 15,
    supportedFormats: ['short_form', 'long_form'],
    optimalPostingTimes: [
      { hour: 14, day: 0 }, // Sunday 2pm
      { hour: 15, day: 4 }, // Thursday 3pm
      { hour: 16, day: 5 }, // Friday 4pm
    ],
  },
  tiktok: {
    name: 'TikTok',
    maxCaptionLength: 2200,
    maxHashtags: 5,
    supportedFormats: ['short_form'],
    optimalPostingTimes: [
      { hour: 19, day: 2 }, // Tuesday 7pm
      { hour: 12, day: 4 }, // Thursday 12pm
      { hour: 17, day: 5 }, // Friday 5pm
    ],
  },
  instagram: {
    name: 'Instagram',
    maxCaptionLength: 2200,
    maxHashtags: 30,
    supportedFormats: ['short_form', 'carousel'],
    optimalPostingTimes: [
      { hour: 11, day: 1 }, // Monday 11am
      { hour: 13, day: 3 }, // Wednesday 1pm
      { hour: 19, day: 5 }, // Friday 7pm
    ],
  },
  twitter: {
    name: 'X (Twitter)',
    maxCaptionLength: 280,
    maxHashtags: 3,
    supportedFormats: ['short_form', 'thread'],
    optimalPostingTimes: [
      { hour: 9, day: 1 }, // Monday 9am
      { hour: 12, day: 3 }, // Wednesday 12pm
      { hour: 17, day: 4 }, // Thursday 5pm
    ],
  },
  linkedin: {
    name: 'LinkedIn',
    maxCaptionLength: 3000,
    maxHashtags: 5,
    supportedFormats: ['short_form', 'long_form', 'article', 'carousel'],
    optimalPostingTimes: [
      { hour: 8, day: 2 }, // Tuesday 8am
      { hour: 10, day: 3 }, // Wednesday 10am
      { hour: 12, day: 4 }, // Thursday 12pm
    ],
  },
  threads: {
    name: 'Threads',
    maxCaptionLength: 500,
    maxHashtags: 5,
    supportedFormats: ['short_form', 'thread'],
    optimalPostingTimes: [
      { hour: 10, day: 1 }, // Monday 10am
      { hour: 14, day: 3 }, // Wednesday 2pm
      { hour: 18, day: 5 }, // Friday 6pm
    ],
  },
};

/**
 * Get the next optimal posting time for a platform
 */
export function getNextOptimalPostTime(
  platform: PlatformType,
  fromDate: Date = new Date()
): Date {
  const config = PLATFORM_CONFIG[platform];
  const now = fromDate.getTime();
  let nextTime: Date | null = null;

  for (const slot of config.optimalPostingTimes) {
    const candidate = new Date(fromDate);
    candidate.setHours(slot.hour, 0, 0, 0);

    // Adjust to the correct day of week
    const currentDay = candidate.getDay();
    let daysToAdd = slot.day - currentDay;
    if (daysToAdd < 0 || (daysToAdd === 0 && candidate.getTime() <= now)) {
      daysToAdd += 7;
    }
    candidate.setDate(candidate.getDate() + daysToAdd);

    if (!nextTime || candidate.getTime() < nextTime.getTime()) {
      nextTime = candidate;
    }
  }

  return nextTime ?? new Date(now + 24 * 60 * 60 * 1000);
}

// ============================================
// Text Utilities
// ============================================

/**
 * Count words in a string
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Estimate reading/speaking duration from word count
 * Average speaking pace: 150 words per minute
 */
export function estimateDuration(wordCount: number, wordsPerMinute = 150): number {
  return Math.ceil((wordCount / wordsPerMinute) * 60);
}

/**
 * Truncate text to a maximum length, adding ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Extract hashtags from a caption
 */
export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w]+/g);
  return matches ? matches.map((tag) => tag.slice(1)) : [];
}

/**
 * Format hashtags for a platform
 */
export function formatHashtags(
  hashtags: string[],
  platform: PlatformType
): string[] {
  const config = PLATFORM_CONFIG[platform];
  return hashtags.slice(0, config.maxHashtags).map((tag) => `#${tag}`);
}

// ============================================
// Date Utilities
// ============================================

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a datetime for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

// ============================================
// ID Utilities
// ============================================

/**
 * Generate a simple unique ID (for mock data)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ============================================
// Async Utilities
// ============================================

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
  } = {}
): Promise<T> {
  const { maxRetries = 3, initialDelayMs = 1000, maxDelayMs = 30000 } = options;

  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delay = Math.min(initialDelayMs * 2 ** attempt, maxDelayMs);
        await sleep(delay);
      }
    }
  }
  throw lastError;
}

// ============================================
// Engagement Calculations
// ============================================

/**
 * Calculate engagement rate from metrics
 */
export function calculateEngagementRate(metrics: {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
}): number {
  if (metrics.views === 0) return 0;
  const totalEngagement =
    metrics.likes +
    metrics.comments +
    metrics.shares +
    (metrics.saves ?? 0);
  return totalEngagement / metrics.views;
}

/**
 * Calculate priority score based on performance
 */
export function calculatePriorityScore(
  avgEngagementRate: number,
  totalViews: number,
  manualBoost: number = 0
): number {
  // Normalize engagement rate (0-1) to 0-50 points
  const engagementPoints = avgEngagementRate * 50 * 100; // Multiply by 100 since rates are typically 0.01-0.10

  // Logarithmic scale for views (up to 50 points)
  const viewPoints = Math.min(Math.log10(totalViews + 1) * 10, 50);

  // Combine and add manual boost
  const baseScore = engagementPoints + viewPoints;
  const boostedScore = baseScore * (1 + manualBoost);

  return Math.min(Math.max(boostedScore, 0), 100);
}
