'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share2, Users } from 'lucide-react';

// Mock analytics data
const overviewStats = [
  { label: 'Total Views', value: '124.5K', change: '+12.3%', trending: 'up' },
  { label: 'Engagement Rate', value: '4.8%', change: '+0.6%', trending: 'up' },
  { label: 'New Followers', value: '2,847', change: '+18.2%', trending: 'up' },
  { label: 'Posts Published', value: '47', change: '-5', trending: 'down' },
];

const platformStats = [
  {
    platform: 'YouTube',
    views: '45.2K',
    engagement: '5.2%',
    followers: '+892',
    topContent: 'AI Tools Deep Dive',
  },
  {
    platform: 'TikTok',
    views: '38.7K',
    engagement: '6.1%',
    followers: '+1,245',
    topContent: 'Quick AI Tips',
  },
  {
    platform: 'LinkedIn',
    views: '22.1K',
    engagement: '3.8%',
    followers: '+412',
    topContent: 'AI Agents Article',
  },
  {
    platform: 'Twitter',
    views: '18.5K',
    engagement: '4.2%',
    followers: '+298',
    topContent: 'MCP Protocol Thread',
  },
];

const topPerformingContent = [
  {
    title: 'Why AI Agents Are Changing Everything',
    platform: 'TikTok',
    views: 12400,
    likes: 892,
    comments: 134,
    shares: 256,
  },
  {
    title: 'AI Tools I Use Daily',
    platform: 'YouTube',
    views: 8700,
    likes: 654,
    comments: 89,
    shares: 123,
  },
  {
    title: 'Local LLM Setup Guide',
    platform: 'LinkedIn',
    views: 5200,
    likes: 412,
    comments: 67,
    shares: 89,
  },
  {
    title: 'Claude vs GPT Thread',
    platform: 'Twitter',
    views: 4800,
    likes: 234,
    comments: 156,
    shares: 78,
  },
];

const topKeywords = [
  { keyword: 'AI Agents', score: 92, posts: 8, avgEngagement: '5.4%' },
  { keyword: 'Claude', score: 88, posts: 6, avgEngagement: '4.9%' },
  { keyword: 'Local LLM', score: 75, posts: 4, avgEngagement: '4.2%' },
  { keyword: 'Automation', score: 71, posts: 5, avgEngagement: '3.8%' },
  { keyword: 'Voice AI', score: 68, posts: 3, avgEngagement: '4.1%' },
];

function formatNumber(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Performance insights across all platforms</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {stat.trending === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${stat.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}
              >
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Metrics breakdown by platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformStats.map((platform) => (
              <div
                key={platform.platform}
                className="flex items-center justify-between p-4 rounded-lg bg-muted"
              >
                <div className="flex items-center gap-4">
                  <div className="font-medium w-24">{platform.platform}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    {platform.views}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    {platform.engagement}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {platform.followers}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Top: <span className="font-medium">{platform.topContent}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Your best content this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingContent.map((content, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{content.title}</div>
                    <Badge variant="outline">{content.platform}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(content.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(content.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {content.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      {content.shares}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Keywords */}
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
            <CardDescription>Keywords ranked by engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topKeywords.map((keyword) => (
                <div key={keyword.keyword} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{keyword.keyword}</div>
                    <div className="text-sm font-bold text-primary">{keyword.score}</div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{keyword.posts} posts</span>
                    <span>Avg engagement: {keyword.avgEngagement}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${keyword.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
