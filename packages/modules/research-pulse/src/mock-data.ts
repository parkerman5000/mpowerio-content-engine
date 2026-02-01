// Research Pulse - Mock Data for Development

import type { ResearchTopicInsert, TopicSource } from '@mpowerio/core';

export interface MockTopic {
  title: string;
  description: string;
  source: TopicSource;
  source_url: string | null;
  keywords: string[];
  category: string;
  relevance_score: number;
  trending_score: number;
}

// Sample AI/Tech topics that would be captured from various sources
export const MOCK_TOPICS: MockTopic[] = [
  {
    title: 'Claude 3.5 Opus Beats GPT-5 in New Benchmark',
    description:
      'Anthropic\'s latest model shows unprecedented reasoning capabilities, outperforming competitors in complex multi-step tasks. Industry analysts are calling it a paradigm shift.',
    source: 'rss_feed',
    source_url: 'https://techcrunch.com/ai-news',
    keywords: ['claude', 'anthropic', 'gpt-5', 'ai-benchmark', 'llm'],
    category: 'AI Models',
    relevance_score: 0.95,
    trending_score: 0.88,
  },
  {
    title: 'Why AI Agents Are Replacing Traditional Automation',
    description:
      'Autonomous AI agents are now capable of handling complex workflows that previously required multiple tools and human oversight. Here\'s what this means for businesses.',
    source: 'twitter_trending',
    source_url: null,
    keywords: ['ai-agents', 'automation', 'workflow', 'autonomous'],
    category: 'AI Agents',
    relevance_score: 0.89,
    trending_score: 0.72,
  },
  {
    title: 'The Rise of Local LLMs: Running AI on Your Own Hardware',
    description:
      'With models like Llama 3 and Mistral, developers can now run powerful AI locally. This guide covers the best practices for self-hosted AI.',
    source: 'reddit',
    source_url: 'https://reddit.com/r/LocalLLaMA',
    keywords: ['local-llm', 'llama', 'mistral', 'self-hosted', 'privacy'],
    category: 'Local AI',
    relevance_score: 0.82,
    trending_score: 0.65,
  },
  {
    title: 'How to Build a Voice AI Agent in 2026',
    description:
      'Step-by-step tutorial on creating conversational AI agents using ElevenLabs for voice synthesis and Claude for intelligence.',
    source: 'manual',
    source_url: null,
    keywords: ['voice-ai', 'elevenlabs', 'conversational-ai', 'tutorial'],
    category: 'Tutorials',
    relevance_score: 0.91,
    trending_score: 0.45,
  },
  {
    title: 'AI Video Generation: HeyGen vs Synthesia Comparison',
    description:
      'We tested both platforms for creating AI avatar videos. Here\'s which one wins for different use cases.',
    source: 'competitor_analysis',
    source_url: null,
    keywords: ['heygen', 'synthesia', 'ai-video', 'avatar', 'comparison'],
    category: 'AI Video',
    relevance_score: 0.87,
    trending_score: 0.58,
  },
  {
    title: 'The Future of RAG: Moving Beyond Vector Search',
    description:
      'Retrieval-augmented generation is evolving. New approaches like graph RAG and hybrid search are changing how we build knowledge systems.',
    source: 'rss_feed',
    source_url: 'https://arxiv.org/ai',
    keywords: ['rag', 'vector-search', 'graph-rag', 'knowledge-base'],
    category: 'AI Infrastructure',
    relevance_score: 0.78,
    trending_score: 0.82,
  },
  {
    title: 'Building AI-Powered Content Pipelines',
    description:
      'From ideation to publication: how top creators are using AI to scale their content production 10x without losing authenticity.',
    source: 'audience_feedback',
    source_url: null,
    keywords: ['content-pipeline', 'automation', 'ai-content', 'scaling'],
    category: 'Content Creation',
    relevance_score: 0.94,
    trending_score: 0.55,
  },
  {
    title: 'MCP Protocol: The New Standard for AI Tool Integration',
    description:
      'Anthropic\'s Model Context Protocol is gaining adoption. Here\'s how it simplifies building AI agents that can use external tools.',
    source: 'twitter_trending',
    source_url: null,
    keywords: ['mcp', 'anthropic', 'ai-tools', 'protocol', 'integration'],
    category: 'AI Development',
    relevance_score: 0.86,
    trending_score: 0.91,
  },
  {
    title: 'RTX 5090: The Ultimate Local AI Development GPU',
    description:
      'NVIDIA\'s latest GPU brings 32GB of GDDR7 memory, making it perfect for running large models locally. We benchmark its AI performance.',
    source: 'rss_feed',
    source_url: 'https://tomshardware.com',
    keywords: ['rtx-5090', 'nvidia', 'gpu', 'local-ai', 'hardware'],
    category: 'Hardware',
    relevance_score: 0.75,
    trending_score: 0.68,
  },
  {
    title: 'Why Every Developer Should Learn Prompt Engineering',
    description:
      'Prompt engineering is becoming a core skill. This guide covers advanced techniques for getting better results from any LLM.',
    source: 'manual',
    source_url: null,
    keywords: ['prompt-engineering', 'llm', 'developer', 'skills'],
    category: 'Skills',
    relevance_score: 0.83,
    trending_score: 0.42,
  },
];

// Categories with their priority weights
export const TOPIC_CATEGORIES = {
  'AI Models': { priority: 1.0, color: '#8B5CF6' },
  'AI Agents': { priority: 0.95, color: '#3B82F6' },
  'AI Video': { priority: 0.9, color: '#EC4899' },
  'Tutorials': { priority: 0.85, color: '#10B981' },
  'Content Creation': { priority: 0.85, color: '#F59E0B' },
  'AI Development': { priority: 0.8, color: '#6366F1' },
  'Local AI': { priority: 0.75, color: '#14B8A6' },
  'AI Infrastructure': { priority: 0.7, color: '#64748B' },
  'Hardware': { priority: 0.6, color: '#EF4444' },
  'Skills': { priority: 0.55, color: '#A855F7' },
} as const;

/**
 * Get a random subset of mock topics
 */
export function getRandomTopics(count: number = 5): MockTopic[] {
  const shuffled = [...MOCK_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Simulate a delay for mock API calls
 */
export function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
