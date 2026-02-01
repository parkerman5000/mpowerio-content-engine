// mpowerio Content Engine - Zod Schemas for Runtime Validation

import { z } from 'zod';

// ============================================
// Enums
// ============================================

export const ContentStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'archived',
]);

export const PlatformTypeSchema = z.enum([
  'youtube',
  'tiktok',
  'instagram',
  'twitter',
  'linkedin',
  'threads',
]);

export const ContentFormatSchema = z.enum([
  'short_form',
  'long_form',
  'carousel',
  'thread',
  'article',
]);

export const TopicSourceSchema = z.enum([
  'rss_feed',
  'twitter_trending',
  'reddit',
  'manual',
  'competitor_analysis',
  'audience_feedback',
]);

// ============================================
// Research Topics
// ============================================

export const ResearchTopicSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().nullable(),
  source: TopicSourceSchema,
  source_url: z.string().url().nullable(),
  relevance_score: z.number().min(0).max(1),
  trending_score: z.number().min(0).max(1),
  keywords: z.array(z.string()),
  category: z.string().nullable(),
  is_approved: z.boolean(),
  approved_at: z.string().datetime().nullable(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const ResearchTopicInsertSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().nullable().optional(),
  source: TopicSourceSchema.optional().default('manual'),
  source_url: z.string().url().nullable().optional(),
  relevance_score: z.number().min(0).max(1).optional().default(0.5),
  trending_score: z.number().min(0).max(1).optional().default(0),
  keywords: z.array(z.string()).optional().default([]),
  category: z.string().nullable().optional(),
  is_approved: z.boolean().optional().default(false),
  notes: z.string().nullable().optional(),
});

// ============================================
// Scripts
// ============================================

export const ScriptSchema = z.object({
  id: z.string().uuid(),
  topic_id: z.string().uuid().nullable(),
  title: z.string().min(1).max(500),
  hook: z.string().min(1),
  body: z.string().min(1),
  call_to_action: z.string().nullable(),
  target_format: ContentFormatSchema,
  target_duration_seconds: z.number().positive().nullable(),
  word_count: z.number().positive().nullable(),
  tone: z.string(),
  status: ContentStatusSchema,
  version: z.number().positive(),
  parent_script_id: z.string().uuid().nullable(),
  ai_model: z.string(),
  ai_prompt_template: z.string().nullable(),
  generation_metadata: z.record(z.unknown()),
  is_approved: z.boolean(),
  approved_at: z.string().datetime().nullable(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const ScriptInsertSchema = z.object({
  topic_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(500),
  hook: z.string().min(1),
  body: z.string().min(1),
  call_to_action: z.string().nullable().optional(),
  target_format: ContentFormatSchema,
  target_duration_seconds: z.number().positive().nullable().optional(),
  word_count: z.number().positive().nullable().optional(),
  tone: z.string().optional().default('professional'),
  status: ContentStatusSchema.optional().default('pending'),
  ai_model: z.string().optional().default('claude-3-opus'),
  ai_prompt_template: z.string().nullable().optional(),
  generation_metadata: z.record(z.unknown()).optional().default({}),
  is_approved: z.boolean().optional().default(false),
  notes: z.string().nullable().optional(),
});

// ============================================
// Videos
// ============================================

export const VideoSchema = z.object({
  id: z.string().uuid(),
  script_id: z.string().uuid().nullable(),
  title: z.string().min(1).max(500),
  description: z.string().nullable(),
  status: ContentStatusSchema,
  heygen_job_id: z.string().nullable(),
  heygen_video_url: z.string().url().nullable(),
  heygen_avatar_id: z.string().nullable(),
  elevenlabs_voice_id: z.string().nullable(),
  audio_url: z.string().url().nullable(),
  duration_seconds: z.number().positive().nullable(),
  resolution: z.string(),
  file_size_bytes: z.number().positive().nullable(),
  thumbnail_url: z.string().url().nullable(),
  processing_started_at: z.string().datetime().nullable(),
  processing_completed_at: z.string().datetime().nullable(),
  error_message: z.string().nullable(),
  retry_count: z.number().int().min(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const VideoInsertSchema = z.object({
  script_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(500),
  description: z.string().nullable().optional(),
  status: ContentStatusSchema.optional().default('pending'),
  heygen_avatar_id: z.string().nullable().optional(),
  elevenlabs_voice_id: z.string().nullable().optional(),
  resolution: z.string().optional().default('1080x1920'),
});

// ============================================
// Content Pieces
// ============================================

export const ContentPieceSchema = z.object({
  id: z.string().uuid(),
  video_id: z.string().uuid().nullable(),
  script_id: z.string().uuid().nullable(),
  platform: PlatformTypeSchema,
  format: ContentFormatSchema,
  title: z.string().min(1).max(500),
  caption: z.string().nullable(),
  hashtags: z.array(z.string()),
  mentions: z.array(z.string()),
  media_url: z.string().url().nullable(),
  thumbnail_url: z.string().url().nullable(),
  platform_metadata: z.record(z.unknown()),
  status: ContentStatusSchema,
  scheduled_for: z.string().datetime().nullable(),
  posted_at: z.string().datetime().nullable(),
  platform_post_id: z.string().nullable(),
  platform_post_url: z.string().url().nullable(),
  error_message: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const ContentPieceInsertSchema = z.object({
  video_id: z.string().uuid().nullable().optional(),
  script_id: z.string().uuid().nullable().optional(),
  platform: PlatformTypeSchema,
  format: ContentFormatSchema,
  title: z.string().min(1).max(500),
  caption: z.string().nullable().optional(),
  hashtags: z.array(z.string()).optional().default([]),
  mentions: z.array(z.string()).optional().default([]),
  media_url: z.string().url().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  platform_metadata: z.record(z.unknown()).optional().default({}),
  status: ContentStatusSchema.optional().default('pending'),
  scheduled_for: z.string().datetime().nullable().optional(),
});

// ============================================
// Post Analytics
// ============================================

export const PostAnalyticsSchema = z.object({
  id: z.string().uuid(),
  content_piece_id: z.string().uuid(),
  platform: PlatformTypeSchema,
  views: z.number().int().min(0),
  likes: z.number().int().min(0),
  comments: z.number().int().min(0),
  shares: z.number().int().min(0),
  saves: z.number().int().min(0),
  impressions: z.number().int().min(0),
  reach: z.number().int().min(0),
  engagement_rate: z.number().min(0).max(1),
  watch_time_seconds: z.number().int().min(0),
  avg_watch_percentage: z.number().min(0).max(100),
  new_followers: z.number().int().min(0),
  profile_visits: z.number().int().min(0),
  link_clicks: z.number().int().min(0),
  raw_metrics: z.record(z.unknown()),
  metrics_date: z.string(),
  fetched_at: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const PostAnalyticsInsertSchema = z.object({
  content_piece_id: z.string().uuid(),
  platform: PlatformTypeSchema,
  metrics_date: z.string(),
  views: z.number().int().min(0).optional().default(0),
  likes: z.number().int().min(0).optional().default(0),
  comments: z.number().int().min(0).optional().default(0),
  shares: z.number().int().min(0).optional().default(0),
  saves: z.number().int().min(0).optional().default(0),
  impressions: z.number().int().min(0).optional().default(0),
  reach: z.number().int().min(0).optional().default(0),
  engagement_rate: z.number().min(0).max(1).optional().default(0),
  watch_time_seconds: z.number().int().min(0).optional().default(0),
  avg_watch_percentage: z.number().min(0).max(100).optional().default(0),
  new_followers: z.number().int().min(0).optional().default(0),
  profile_visits: z.number().int().min(0).optional().default(0),
  link_clicks: z.number().int().min(0).optional().default(0),
  raw_metrics: z.record(z.unknown()).optional().default({}),
});

// ============================================
// Research Priorities
// ============================================

export const ResearchPrioritySchema = z.object({
  id: z.string().uuid(),
  keyword: z.string().min(1),
  category: z.string().nullable(),
  total_posts: z.number().int().min(0),
  avg_engagement_rate: z.number().min(0).max(1),
  total_views: z.number().int().min(0),
  total_engagement: z.number().int().min(0),
  priority_score: z.number().min(0).max(100),
  manual_boost: z.number().min(-1).max(1),
  is_blocked: z.boolean(),
  notes: z.string().nullable(),
  last_used_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const ResearchPriorityInsertSchema = z.object({
  keyword: z.string().min(1),
  category: z.string().nullable().optional(),
  priority_score: z.number().min(0).max(100).optional().default(50),
  manual_boost: z.number().min(-1).max(1).optional().default(0),
  is_blocked: z.boolean().optional().default(false),
  notes: z.string().nullable().optional(),
});

// ============================================
// Type Inference
// ============================================

export type ResearchTopicInput = z.infer<typeof ResearchTopicInsertSchema>;
export type ScriptInput = z.infer<typeof ScriptInsertSchema>;
export type VideoInput = z.infer<typeof VideoInsertSchema>;
export type ContentPieceInput = z.infer<typeof ContentPieceInsertSchema>;
export type PostAnalyticsInput = z.infer<typeof PostAnalyticsInsertSchema>;
export type ResearchPriorityInput = z.infer<typeof ResearchPriorityInsertSchema>;
