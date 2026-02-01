'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, RefreshCw, Eye, Edit, Video, Clock, FileText } from 'lucide-react';

// Mock data for scripts
const mockScripts = [
  {
    id: '1',
    title: 'Why AI Agents Are Replacing Traditional Automation',
    hook: "Everyone's talking about AI agents, but nobody's explaining WHY they're about to change everything.",
    body: "Here's the thing about AI agents that most people miss. Traditional automation follows rigid rules. If this, then that. No flexibility. AI agents? They think. They adapt. They figure things out...",
    call_to_action: "Follow for more AI insights. What would you delegate to an AI agent first?",
    target_format: 'short_form',
    word_count: 115,
    target_duration_seconds: 45,
    tone: 'professional',
    status: 'pending',
    is_approved: false,
    created_at: '2026-02-01T11:00:00Z',
  },
  {
    id: '2',
    title: 'Claude 3.5 Opus Deep Dive',
    hook: "I spent the last month testing every AI video tool on the market. Here's which ones are actually worth your money.",
    body: "Let me save you hundreds of dollars and countless hours. When I started this channel, creating video content was painful...",
    call_to_action: "Which tool are you trying first? Let me know in the comments.",
    target_format: 'long_form',
    word_count: 750,
    target_duration_seconds: 300,
    tone: 'casual',
    status: 'completed',
    is_approved: true,
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: '3',
    title: 'The AI Tools I Actually Use Daily',
    hook: 'The AI Tools I Actually Use Daily',
    body: 'SLIDE 2: For Writing - Claude for long-form. ChatGPT for quick tasks. SLIDE 3: For Research - Perplexity AI...',
    call_to_action: "Save this for reference. Which one are you adding to your stack?",
    target_format: 'carousel',
    word_count: 78,
    target_duration_seconds: 0,
    tone: 'educational',
    status: 'pending',
    is_approved: false,
    created_at: '2026-02-01T09:00:00Z',
  },
];

function getFormatBadge(format: string) {
  const labels: Record<string, string> = {
    short_form: 'Short Form',
    long_form: 'Long Form',
    carousel: 'Carousel',
    thread: 'Thread',
    article: 'Article',
  };
  return <Badge variant="outline">{labels[format] || format}</Badge>;
}

function getStatusBadge(status: string, isApproved: boolean) {
  if (isApproved) return <Badge variant="success">Approved</Badge>;
  if (status === 'completed') return <Badge variant="secondary">Ready</Badge>;
  if (status === 'processing') return <Badge variant="warning">Generating</Badge>;
  return <Badge variant="outline">Pending</Badge>;
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState(mockScripts);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setScripts(scripts.map((s) => (s.id === id ? { ...s, is_approved: true, status: 'completed' } : s)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scripts</h1>
          <p className="text-muted-foreground">Generated scripts ready for video production</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate New Script
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{scripts.length}</div>
            <p className="text-xs text-muted-foreground">Total Scripts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{scripts.filter((s) => !s.is_approved).length}</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{scripts.filter((s) => s.is_approved).length}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {Math.round(scripts.reduce((acc, s) => acc + s.word_count, 0) / scripts.length)}
            </div>
            <p className="text-xs text-muted-foreground">Avg Words</p>
          </CardContent>
        </Card>
      </div>

      {/* Scripts List */}
      <div className="space-y-4">
        {scripts.map((script) => (
          <Card key={script.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{script.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getFormatBadge(script.target_format)}
                    {getStatusBadge(script.status, script.is_approved)}
                    <span className="text-xs text-muted-foreground">
                      {script.word_count} words
                    </span>
                    {script.target_duration_seconds > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.floor(script.target_duration_seconds / 60)}:
                        {(script.target_duration_seconds % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Hook Preview */}
              <div className="mb-4">
                <div className="text-xs font-medium text-muted-foreground mb-1">HOOK</div>
                <p className="text-sm italic">"{script.hook}"</p>
              </div>

              {/* Expanded Content */}
              {expandedId === script.id && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">BODY</div>
                    <p className="text-sm whitespace-pre-wrap">{script.body}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      CALL TO ACTION
                    </div>
                    <p className="text-sm">{script.call_to_action}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === script.id ? null : script.id)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  {expandedId === script.id ? 'Collapse' : 'View Full Script'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  {!script.is_approved && (
                    <Button size="sm" onClick={() => handleApprove(script.id)}>
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  {script.is_approved && (
                    <Button size="sm">
                      <Video className="mr-1 h-4 w-4" />
                      Create Video
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
