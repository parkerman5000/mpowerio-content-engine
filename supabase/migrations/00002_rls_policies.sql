-- mpowerio Content Engine RLS Policies
-- Migration: 00002_rls_policies
-- Description: Row Level Security policies for all tables

-- Enable RLS on all tables
ALTER TABLE research_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_priorities ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SERVICE ROLE POLICIES (Full access for backend)
-- ============================================

-- Research Topics
CREATE POLICY "Service role full access to research_topics"
  ON research_topics FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Scripts
CREATE POLICY "Service role full access to scripts"
  ON scripts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Videos
CREATE POLICY "Service role full access to videos"
  ON videos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Content Pieces
CREATE POLICY "Service role full access to content_pieces"
  ON content_pieces FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Post Analytics
CREATE POLICY "Service role full access to post_analytics"
  ON post_analytics FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Research Priorities
CREATE POLICY "Service role full access to research_priorities"
  ON research_priorities FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- ANON POLICIES (Read-only for dashboard, if needed)
-- ============================================

-- For now, authenticated users (dashboard) can read all data
-- In production, you'd want user-specific policies

CREATE POLICY "Authenticated read access to research_topics"
  ON research_topics FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read access to scripts"
  ON scripts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read access to videos"
  ON videos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read access to content_pieces"
  ON content_pieces FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read access to post_analytics"
  ON post_analytics FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read access to research_priorities"
  ON research_priorities FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can also update certain fields (for approval workflows)
CREATE POLICY "Authenticated update access to research_topics"
  ON research_topics FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to scripts"
  ON scripts FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert access to research_topics"
  ON research_topics FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
