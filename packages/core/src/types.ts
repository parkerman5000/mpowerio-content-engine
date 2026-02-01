// mpowerio Content Engine - Core Types
// These types mirror the Supabase database schema

export type ContentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'archived';

export type PlatformType =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'threads';

export type ContentFormat =
  | 'short_form'
  | 'long_form'
  | 'carousel'
  | 'thread'
  | 'article';

export type TopicSource =
  | 'rss_feed'
  | 'twitter_trending'
  | 'reddit'
  | 'manual'
  | 'competitor_analysis'
  | 'audience_feedback';

// ============================================
// Research Topics
// ============================================

export interface ResearchTopic {
  id: string;
  title: string;
  description: string | null;
  source: TopicSource;
  source_url: string | null;
  relevance_score: number;
  trending_score: number;
  keywords: string[];
  category: string | null;
  is_approved: boolean;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResearchTopicInsert {
  title: string;
  description?: string | null;
  source?: TopicSource;
  source_url?: string | null;
  relevance_score?: number;
  trending_score?: number;
  keywords?: string[];
  category?: string | null;
  is_approved?: boolean;
  notes?: string | null;
}

export interface ResearchTopicUpdate {
  title?: string;
  description?: string | null;
  source?: TopicSource;
  source_url?: string | null;
  relevance_score?: number;
  trending_score?: number;
  keywords?: string[];
  category?: string | null;
  is_approved?: boolean;
  approved_at?: string | null;
  notes?: string | null;
}

// ============================================
// Scripts
// ============================================

export interface Script {
  id: string;
  topic_id: string | null;
  title: string;
  hook: string;
  body: string;
  call_to_action: string | null;
  target_format: ContentFormat;
  target_duration_seconds: number | null;
  word_count: number | null;
  tone: string;
  status: ContentStatus;
  version: number;
  parent_script_id: string | null;
  ai_model: string;
  ai_prompt_template: string | null;
  generation_metadata: Record<string, unknown>;
  is_approved: boolean;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScriptInsert {
  topic_id?: string | null;
  title: string;
  hook: string;
  body: string;
  call_to_action?: string | null;
  target_format: ContentFormat;
  target_duration_seconds?: number | null;
  word_count?: number | null;
  tone?: string;
  status?: ContentStatus;
  version?: number;
  parent_script_id?: string | null;
  ai_model?: string;
  ai_prompt_template?: string | null;
  generation_metadata?: Record<string, unknown>;
  is_approved?: boolean;
  notes?: string | null;
}

export interface ScriptUpdate {
  topic_id?: string | null;
  title?: string;
  hook?: string;
  body?: string;
  call_to_action?: string | null;
  target_format?: ContentFormat;
  target_duration_seconds?: number | null;
  word_count?: number | null;
  tone?: string;
  status?: ContentStatus;
  version?: number;
  parent_script_id?: string | null;
  ai_model?: string;
  ai_prompt_template?: string | null;
  generation_metadata?: Record<string, unknown>;
  is_approved?: boolean;
  approved_at?: string | null;
  notes?: string | null;
}

// ============================================
// Videos
// ============================================

export interface Video {
  id: string;
  script_id: string | null;
  title: string;
  description: string | null;
  status: ContentStatus;
  heygen_job_id: string | null;
  heygen_video_url: string | null;
  heygen_avatar_id: string | null;
  elevenlabs_voice_id: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  resolution: string;
  file_size_bytes: number | null;
  thumbnail_url: string | null;
  processing_started_at: string | null;
  processing_completed_at: string | null;
  error_message: string | null;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export interface VideoInsert {
  script_id?: string | null;
  title: string;
  description?: string | null;
  status?: ContentStatus;
  heygen_job_id?: string | null;
  heygen_video_url?: string | null;
  heygen_avatar_id?: string | null;
  elevenlabs_voice_id?: string | null;
  audio_url?: string | null;
  duration_seconds?: number | null;
  resolution?: string;
  file_size_bytes?: number | null;
  thumbnail_url?: string | null;
}

export interface VideoUpdate {
  script_id?: string | null;
  title?: string;
  description?: string | null;
  status?: ContentStatus;
  heygen_job_id?: string | null;
  heygen_video_url?: string | null;
  heygen_avatar_id?: string | null;
  elevenlabs_voice_id?: string | null;
  audio_url?: string | null;
  duration_seconds?: number | null;
  resolution?: string;
  file_size_bytes?: number | null;
  thumbnail_url?: string | null;
  processing_started_at?: string | null;
  processing_completed_at?: string | null;
  error_message?: string | null;
  retry_count?: number;
}

// ============================================
// Content Pieces
// ============================================

export interface ContentPiece {
  id: string;
  video_id: string | null;
  script_id: string | null;
  platform: PlatformType;
  format: ContentFormat;
  title: string;
  caption: string | null;
  hashtags: string[];
  mentions: string[];
  media_url: string | null;
  thumbnail_url: string | null;
  platform_metadata: Record<string, unknown>;
  status: ContentStatus;
  scheduled_for: string | null;
  posted_at: string | null;
  platform_post_id: string | null;
  platform_post_url: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentPieceInsert {
  video_id?: string | null;
  script_id?: string | null;
  platform: PlatformType;
  format: ContentFormat;
  title: string;
  caption?: string | null;
  hashtags?: string[];
  mentions?: string[];
  media_url?: string | null;
  thumbnail_url?: string | null;
  platform_metadata?: Record<string, unknown>;
  status?: ContentStatus;
  scheduled_for?: string | null;
}

export interface ContentPieceUpdate {
  video_id?: string | null;
  script_id?: string | null;
  platform?: PlatformType;
  format?: ContentFormat;
  title?: string;
  caption?: string | null;
  hashtags?: string[];
  mentions?: string[];
  media_url?: string | null;
  thumbnail_url?: string | null;
  platform_metadata?: Record<string, unknown>;
  status?: ContentStatus;
  scheduled_for?: string | null;
  posted_at?: string | null;
  platform_post_id?: string | null;
  platform_post_url?: string | null;
  error_message?: string | null;
}

// ============================================
// Post Analytics
// ============================================

export interface PostAnalytics {
  id: string;
  content_piece_id: string;
  platform: PlatformType;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  impressions: number;
  reach: number;
  engagement_rate: number;
  watch_time_seconds: number;
  avg_watch_percentage: number;
  new_followers: number;
  profile_visits: number;
  link_clicks: number;
  raw_metrics: Record<string, unknown>;
  metrics_date: string;
  fetched_at: string;
  created_at: string;
  updated_at: string;
}

export interface PostAnalyticsInsert {
  content_piece_id: string;
  platform: PlatformType;
  metrics_date: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  impressions?: number;
  reach?: number;
  engagement_rate?: number;
  watch_time_seconds?: number;
  avg_watch_percentage?: number;
  new_followers?: number;
  profile_visits?: number;
  link_clicks?: number;
  raw_metrics?: Record<string, unknown>;
}

// ============================================
// Research Priorities
// ============================================

export interface ResearchPriority {
  id: string;
  keyword: string;
  category: string | null;
  total_posts: number;
  avg_engagement_rate: number;
  total_views: number;
  total_engagement: number;
  priority_score: number;
  manual_boost: number;
  is_blocked: boolean;
  notes: string | null;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResearchPriorityInsert {
  keyword: string;
  category?: string | null;
  total_posts?: number;
  avg_engagement_rate?: number;
  total_views?: number;
  total_engagement?: number;
  priority_score?: number;
  manual_boost?: number;
  is_blocked?: boolean;
  notes?: string | null;
}

export interface ResearchPriorityUpdate {
  keyword?: string;
  category?: string | null;
  total_posts?: number;
  avg_engagement_rate?: number;
  total_views?: number;
  total_engagement?: number;
  priority_score?: number;
  manual_boost?: number;
  is_blocked?: boolean;
  notes?: string | null;
  last_used_at?: string | null;
}
