-- mpowerio Content Engine Database Schema
-- Migration: 00001_initial_schema
-- Description: Core tables for content pipeline

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE content_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'archived'
);

CREATE TYPE platform_type AS ENUM (
  'youtube',
  'tiktok',
  'instagram',
  'twitter',
  'linkedin',
  'threads'
);

CREATE TYPE content_format AS ENUM (
  'short_form',      -- 60s or less (TikTok, Reels, Shorts)
  'long_form',       -- 2-10 min (YouTube)
  'carousel',        -- Multi-image posts
  'thread',          -- Twitter/X threads
  'article'          -- LinkedIn articles
);

CREATE TYPE topic_source AS ENUM (
  'rss_feed',
  'twitter_trending',
  'reddit',
  'manual',
  'competitor_analysis',
  'audience_feedback'
);

-- ============================================
-- RESEARCH TOPICS
-- ============================================

CREATE TABLE research_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  source topic_source NOT NULL DEFAULT 'manual',
  source_url TEXT,
  relevance_score DECIMAL(3,2) DEFAULT 0.50,
  trending_score DECIMAL(3,2) DEFAULT 0.00,
  keywords TEXT[] DEFAULT '{}',
  category TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_research_topics_relevance ON research_topics(relevance_score DESC);
CREATE INDEX idx_research_topics_approved ON research_topics(is_approved) WHERE is_approved = TRUE;
CREATE INDEX idx_research_topics_created ON research_topics(created_at DESC);

-- ============================================
-- SCRIPTS
-- ============================================

CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES research_topics(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  hook TEXT NOT NULL,
  body TEXT NOT NULL,
  call_to_action TEXT,
  target_format content_format NOT NULL,
  target_duration_seconds INTEGER,
  word_count INTEGER,
  tone TEXT DEFAULT 'professional',
  status content_status DEFAULT 'pending',
  version INTEGER DEFAULT 1,
  parent_script_id UUID REFERENCES scripts(id),
  ai_model TEXT DEFAULT 'claude-3-opus',
  ai_prompt_template TEXT,
  generation_metadata JSONB DEFAULT '{}',
  is_approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scripts_topic ON scripts(topic_id);
CREATE INDEX idx_scripts_status ON scripts(status);
CREATE INDEX idx_scripts_format ON scripts(target_format);
CREATE INDEX idx_scripts_approved ON scripts(is_approved) WHERE is_approved = TRUE;

-- ============================================
-- VIDEOS
-- ============================================

CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status content_status DEFAULT 'pending',

  -- HeyGen integration
  heygen_job_id TEXT,
  heygen_video_url TEXT,
  heygen_avatar_id TEXT,

  -- ElevenLabs integration
  elevenlabs_voice_id TEXT,
  audio_url TEXT,

  -- Video metadata
  duration_seconds INTEGER,
  resolution TEXT DEFAULT '1080x1920',
  file_size_bytes BIGINT,
  thumbnail_url TEXT,

  -- Processing
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_script ON videos(script_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_heygen_job ON videos(heygen_job_id);

-- ============================================
-- CONTENT PIECES (Repurposed content)
-- ============================================

CREATE TABLE content_pieces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,

  platform platform_type NOT NULL,
  format content_format NOT NULL,

  title TEXT NOT NULL,
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  mentions TEXT[] DEFAULT '{}',

  -- Media
  media_url TEXT,
  thumbnail_url TEXT,

  -- Platform-specific metadata
  platform_metadata JSONB DEFAULT '{}',

  status content_status DEFAULT 'pending',
  scheduled_for TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  platform_post_id TEXT,
  platform_post_url TEXT,

  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_pieces_video ON content_pieces(video_id);
CREATE INDEX idx_content_pieces_platform ON content_pieces(platform);
CREATE INDEX idx_content_pieces_status ON content_pieces(status);
CREATE INDEX idx_content_pieces_scheduled ON content_pieces(scheduled_for) WHERE scheduled_for IS NOT NULL;

-- ============================================
-- POST ANALYTICS
-- ============================================

CREATE TABLE post_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_piece_id UUID REFERENCES content_pieces(id) ON DELETE CASCADE,

  platform platform_type NOT NULL,

  -- Engagement metrics
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,

  -- Reach metrics
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,

  -- Engagement rate (calculated)
  engagement_rate DECIMAL(5,4) DEFAULT 0.0000,

  -- Time-based metrics
  watch_time_seconds INTEGER DEFAULT 0,
  avg_watch_percentage DECIMAL(5,2) DEFAULT 0.00,

  -- Audience metrics
  new_followers INTEGER DEFAULT 0,
  profile_visits INTEGER DEFAULT 0,
  link_clicks INTEGER DEFAULT 0,

  -- Platform-specific raw data
  raw_metrics JSONB DEFAULT '{}',

  -- Timestamps
  metrics_date DATE NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(content_piece_id, metrics_date)
);

CREATE INDEX idx_post_analytics_content ON post_analytics(content_piece_id);
CREATE INDEX idx_post_analytics_platform ON post_analytics(platform);
CREATE INDEX idx_post_analytics_date ON post_analytics(metrics_date DESC);

-- ============================================
-- RESEARCH PRIORITIES (Feedback loop)
-- ============================================

CREATE TABLE research_priorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  keyword TEXT NOT NULL,
  category TEXT,

  -- Performance data
  total_posts INTEGER DEFAULT 0,
  avg_engagement_rate DECIMAL(5,4) DEFAULT 0.0000,
  total_views INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,

  -- Calculated priority
  priority_score DECIMAL(5,2) DEFAULT 50.00,

  -- Manual adjustments
  manual_boost DECIMAL(3,2) DEFAULT 0.00,
  is_blocked BOOLEAN DEFAULT FALSE,

  notes TEXT,

  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(keyword)
);

CREATE INDEX idx_research_priorities_score ON research_priorities(priority_score DESC);
CREATE INDEX idx_research_priorities_keyword ON research_priorities(keyword);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_research_topics_updated_at
  BEFORE UPDATE ON research_topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at
  BEFORE UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_pieces_updated_at
  BEFORE UPDATE ON content_pieces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_analytics_updated_at
  BEFORE UPDATE ON post_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_priorities_updated_at
  BEFORE UPDATE ON research_priorities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
