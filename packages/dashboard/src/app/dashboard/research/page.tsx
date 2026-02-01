'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, RefreshCw, ExternalLink, Search } from 'lucide-react';

// Mock data for research topics
const mockTopics = [
  {
    id: '1',
    title: 'Claude 3.5 Opus Beats GPT-5 in New Benchmark',
    description:
      "Anthropic's latest model shows unprecedented reasoning capabilities, outperforming competitors in complex multi-step tasks.",
    source: 'rss_feed',
    source_url: 'https://techcrunch.com/ai-news',
    keywords: ['claude', 'anthropic', 'gpt-5', 'ai-benchmark'],
    category: 'AI Models',
    relevance_score: 0.95,
    trending_score: 0.88,
    is_approved: false,
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Why AI Agents Are Replacing Traditional Automation',
    description:
      'Autonomous AI agents are now capable of handling complex workflows that previously required multiple tools and human oversight.',
    source: 'twitter_trending',
    source_url: null,
    keywords: ['ai-agents', 'automation', 'workflow'],
    category: 'AI Agents',
    relevance_score: 0.89,
    trending_score: 0.72,
    is_approved: false,
    created_at: '2026-02-01T09:30:00Z',
  },
  {
    id: '3',
    title: 'The Rise of Local LLMs: Running AI on Your Own Hardware',
    description:
      'With models like Llama 3 and Mistral, developers can now run powerful AI locally.',
    source: 'reddit',
    source_url: 'https://reddit.com/r/LocalLLaMA',
    keywords: ['local-llm', 'llama', 'mistral', 'privacy'],
    category: 'Local AI',
    relevance_score: 0.82,
    trending_score: 0.65,
    is_approved: true,
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: '4',
    title: 'MCP Protocol: The New Standard for AI Tool Integration',
    description:
      "Anthropic's Model Context Protocol is gaining adoption for building AI agents that can use external tools.",
    source: 'twitter_trending',
    source_url: null,
    keywords: ['mcp', 'anthropic', 'ai-tools', 'protocol'],
    category: 'AI Development',
    relevance_score: 0.86,
    trending_score: 0.91,
    is_approved: false,
    created_at: '2026-02-01T07:00:00Z',
  },
];

function getSourceBadge(source: string) {
  const colors: Record<string, 'default' | 'secondary' | 'outline'> = {
    rss_feed: 'default',
    twitter_trending: 'secondary',
    reddit: 'outline',
    manual: 'outline',
  };
  return <Badge variant={colors[source] || 'outline'}>{source.replace('_', ' ')}</Badge>;
}

export default function ResearchPage() {
  const [topics, setTopics] = useState(mockTopics);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const filteredTopics = topics.filter((topic) => {
    if (filter === 'pending') return !topic.is_approved;
    if (filter === 'approved') return topic.is_approved;
    return true;
  });

  const handleApprove = (id: string) => {
    setTopics(topics.map((t) => (t.id === id ? { ...t, is_approved: true } : t)));
  };

  const handleReject = (id: string) => {
    setTopics(topics.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Topics</h1>
          <p className="text-muted-foreground">Review and approve topics for content creation</p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Fetch New Topics
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({topics.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({topics.filter((t) => !t.is_approved).length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('approved')}
        >
          Approved ({topics.filter((t) => t.is_approved).length})
        </Button>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => (
          <Card key={topic.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getSourceBadge(topic.source)}
                    <Badge variant="outline">{topic.category}</Badge>
                    {topic.is_approved && <Badge variant="success">Approved</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground">Relevance</div>
                    <div className="font-medium">{Math.round(topic.relevance_score * 100)}%</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground">Trending</div>
                    <div className="font-medium">{Math.round(topic.trending_score * 100)}%</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {topic.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {topic.source_url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={topic.source_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {!topic.is_approved && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(topic.id)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(topic.id)}>
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTopics.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No topics found</h3>
              <p className="text-sm text-muted-foreground">
                Try fetching new topics or changing your filter
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
