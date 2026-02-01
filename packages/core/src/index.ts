// mpowerio Content Engine - Core Package Entry Point

// Types
export * from './types';

// Zod Schemas
export * from './schemas';

// Supabase Client
export {
  getSupabaseClient,
  createBrowserClient,
  db,
  type Database,
  type TypedSupabaseClient,
} from './supabase';

// Utilities
export {
  PLATFORM_CONFIG,
  getNextOptimalPostTime,
  countWords,
  estimateDuration,
  truncateText,
  extractHashtags,
  formatHashtags,
  formatDate,
  formatDateTime,
  getRelativeTime,
  generateId,
  sleep,
  retry,
  calculateEngagementRate,
  calculatePriorityScore,
} from './utils';
