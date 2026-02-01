'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Play, RefreshCw, Download, Share2, Clock, Loader2 } from 'lucide-react';

// Mock data for videos
const mockVideos = [
  {
    id: '1',
    title: 'Why AI Agents Are Changing Everything',
    status: 'completed',
    duration_seconds: 47,
    resolution: '1080x1920',
    thumbnail_url: null,
    heygen_video_url: 'https://example.com/video1.mp4',
    created_at: '2026-02-01T12:00:00Z',
    processing_time: '3m 24s',
  },
  {
    id: '2',
    title: 'AI Tools Deep Dive',
    status: 'processing',
    duration_seconds: null,
    resolution: '1080x1920',
    thumbnail_url: null,
    heygen_video_url: null,
    created_at: '2026-02-01T11:30:00Z',
    processing_time: null,
  },
  {
    id: '3',
    title: 'Local LLMs Setup Guide',
    status: 'pending',
    duration_seconds: null,
    resolution: '1080x1920',
    thumbnail_url: null,
    heygen_video_url: null,
    created_at: '2026-02-01T11:00:00Z',
    processing_time: null,
  },
  {
    id: '4',
    title: 'Claude 3.5 Opus Benchmark Results',
    status: 'completed',
    duration_seconds: 312,
    resolution: '1920x1080',
    thumbnail_url: null,
    heygen_video_url: 'https://example.com/video4.mp4',
    created_at: '2026-02-01T10:00:00Z',
    processing_time: '8m 45s',
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge variant="success">Completed</Badge>;
    case 'processing':
      return <Badge variant="warning">Processing</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
}

function formatDuration(seconds: number | null) {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VideosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
          <p className="text-muted-foreground">Video production status and management</p>
        </div>
        <Button>
          <Video className="mr-2 h-4 w-4" />
          Create New Video
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mockVideos.length}</div>
            <p className="text-xs text-muted-foreground">Total Videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockVideos.filter((v) => v.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockVideos.filter((v) => v.status === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockVideos.filter((v) => v.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">In Queue</p>
          </CardContent>
        </Card>
      </div>

      {/* Videos Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            {/* Thumbnail / Preview */}
            <div className="aspect-video bg-muted flex items-center justify-center relative">
              {video.status === 'processing' ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Generating...</span>
                </div>
              ) : video.status === 'completed' ? (
                <button className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                  <div className="rounded-full bg-white/90 p-3">
                    <Play className="h-6 w-6 text-black" />
                  </div>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Queued</span>
                </div>
              )}
              {/* Duration overlay */}
              {video.duration_seconds && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {formatDuration(video.duration_seconds)}
                </div>
              )}
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(video.status)}
                <span className="text-xs text-muted-foreground">{video.resolution}</span>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {video.processing_time ? `Rendered in ${video.processing_time}` : 'Not started'}
                </span>
                <div className="flex items-center gap-1">
                  {video.status === 'completed' && (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {video.status === 'failed' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4" />
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
