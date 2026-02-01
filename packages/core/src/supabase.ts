// mpowerio Content Engine - Supabase Client

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  ResearchTopic,
  ResearchTopicInsert,
  ResearchTopicUpdate,
  Script,
  ScriptInsert,
  ScriptUpdate,
  Video,
  VideoInsert,
  VideoUpdate,
  ContentPiece,
  ContentPieceInsert,
  ContentPieceUpdate,
  PostAnalytics,
  PostAnalyticsInsert,
  ResearchPriority,
  ResearchPriorityInsert,
  ResearchPriorityUpdate,
} from './types';

// Use generic Supabase client - types are enforced at the repository level
export type TypedSupabaseClient = SupabaseClient;

// Environment variables
const getEnvVar = (name: string, required = true): string => {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? '';
};

// Singleton client instance
let supabaseClient: TypedSupabaseClient | null = null;

/**
 * Get or create a Supabase client instance
 * Uses service role key for backend operations
 */
export function getSupabaseClient(): TypedSupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = getEnvVar('SUPABASE_URL');
  const supabaseKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseClient;
}

/**
 * Create a Supabase client for browser/dashboard use
 * Uses anon key with RLS
 */
export function createBrowserClient(
  supabaseUrl: string,
  supabaseAnonKey: string
): TypedSupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// ============================================
// Repository Helpers
// ============================================

export const db = {
  // Research Topics
  topics: {
    async list(options?: { approved?: boolean; limit?: number }): Promise<ResearchTopic[]> {
      const client = getSupabaseClient();
      let query = client
        .from('research_topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.approved !== undefined) {
        query = query.eq('is_approved', options.approved);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ResearchTopic[];
    },

    async get(id: string): Promise<ResearchTopic> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('research_topics')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as ResearchTopic;
    },

    async create(topic: ResearchTopicInsert): Promise<ResearchTopic> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('research_topics')
        .insert(topic as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return data as ResearchTopic;
    },

    async update(id: string, updates: ResearchTopicUpdate): Promise<ResearchTopic> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('research_topics')
        .update(updates as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ResearchTopic;
    },

    async approve(id: string): Promise<ResearchTopic> {
      return this.update(id, {
        is_approved: true,
        approved_at: new Date().toISOString(),
      });
    },
  },

  // Scripts
  scripts: {
    async list(options?: { status?: string; approved?: boolean; limit?: number }): Promise<Script[]> {
      const client = getSupabaseClient();
      let query = client
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.status) {
        query = query.eq('status', options.status);
      }
      if (options?.approved !== undefined) {
        query = query.eq('is_approved', options.approved);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Script[];
    },

    async get(id: string): Promise<Script> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('scripts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Script;
    },

    async create(script: ScriptInsert): Promise<Script> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('scripts')
        .insert(script as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return data as Script;
    },

    async update(id: string, updates: ScriptUpdate): Promise<Script> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('scripts')
        .update(updates as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Script;
    },
  },

  // Videos
  videos: {
    async list(options?: { status?: string; limit?: number }): Promise<Video[]> {
      const client = getSupabaseClient();
      let query = client
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.status) {
        query = query.eq('status', options.status);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Video[];
    },

    async get(id: string): Promise<Video> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Video;
    },

    async create(video: VideoInsert): Promise<Video> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('videos')
        .insert(video as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return data as Video;
    },

    async update(id: string, updates: VideoUpdate): Promise<Video> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('videos')
        .update(updates as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Video;
    },
  },

  // Content Pieces
  contentPieces: {
    async list(options?: { platform?: string; status?: string; limit?: number }): Promise<ContentPiece[]> {
      const client = getSupabaseClient();
      let query = client
        .from('content_pieces')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.platform) {
        query = query.eq('platform', options.platform);
      }
      if (options?.status) {
        query = query.eq('status', options.status);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ContentPiece[];
    },

    async get(id: string): Promise<ContentPiece> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('content_pieces')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as ContentPiece;
    },

    async create(piece: ContentPieceInsert): Promise<ContentPiece> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('content_pieces')
        .insert(piece as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return data as ContentPiece;
    },

    async update(id: string, updates: ContentPieceUpdate): Promise<ContentPiece> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('content_pieces')
        .update(updates as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ContentPiece;
    },

    async getScheduled(startDate: Date, endDate: Date): Promise<ContentPiece[]> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('content_pieces')
        .select('*')
        .gte('scheduled_for', startDate.toISOString())
        .lte('scheduled_for', endDate.toISOString())
        .order('scheduled_for', { ascending: true });
      if (error) throw error;
      return data as ContentPiece[];
    },
  },

  // Analytics
  analytics: {
    async getForContent(contentPieceId: string): Promise<PostAnalytics[]> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('post_analytics')
        .select('*')
        .eq('content_piece_id', contentPieceId)
        .order('metrics_date', { ascending: false });
      if (error) throw error;
      return data as PostAnalytics[];
    },

    async upsert(analytics: PostAnalyticsInsert): Promise<PostAnalytics> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('post_analytics')
        .upsert(analytics as Record<string, unknown>, {
          onConflict: 'content_piece_id,metrics_date',
        })
        .select()
        .single();
      if (error) throw error;
      return data as PostAnalytics;
    },
  },

  // Research Priorities
  priorities: {
    async list(options?: { blocked?: boolean; limit?: number }): Promise<ResearchPriority[]> {
      const client = getSupabaseClient();
      let query = client
        .from('research_priorities')
        .select('*')
        .order('priority_score', { ascending: false });

      if (options?.blocked !== undefined) {
        query = query.eq('is_blocked', options.blocked);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ResearchPriority[];
    },

    async upsertByKeyword(priority: ResearchPriorityInsert): Promise<ResearchPriority> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('research_priorities')
        .upsert(priority as Record<string, unknown>, {
          onConflict: 'keyword',
        })
        .select()
        .single();
      if (error) throw error;
      return data as ResearchPriority;
    },

    async updateScore(keyword: string, newScore: number): Promise<ResearchPriority> {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('research_priorities')
        .update({ priority_score: newScore })
        .eq('keyword', keyword)
        .select()
        .single();
      if (error) throw error;
      return data as ResearchPriority;
    },
  },
};
