import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react';

// Mock data for the dashboard
const stats = [
  {
    title: 'Pending Topics',
    value: '12',
    description: 'Awaiting review',
    icon: Clock,
    trend: '+3 today',
  },
  {
    title: 'Scripts Ready',
    value: '8',
    description: 'Ready for production',
    icon: FileText,
    trend: '+2 this week',
  },
  {
    title: 'Videos in Queue',
    value: '5',
    description: 'Processing',
    icon: Video,
    trend: '3 completed today',
  },
  {
    title: 'Scheduled Posts',
    value: '24',
    description: 'Next 7 days',
    icon: Calendar,
    trend: '6 platforms',
  },
];

const recentActivity = [
  {
    type: 'topic',
    title: 'Claude 3.5 Opus Beats GPT-5 in New Benchmark',
    status: 'approved',
    time: '2 hours ago',
  },
  {
    type: 'script',
    title: 'Why AI Agents Are Replacing Traditional Automation',
    status: 'generated',
    time: '3 hours ago',
  },
  {
    type: 'video',
    title: 'The Rise of Local LLMs',
    status: 'processing',
    time: '4 hours ago',
  },
  {
    type: 'post',
    title: 'MCP Protocol Deep Dive',
    status: 'posted',
    time: '5 hours ago',
  },
  {
    type: 'analytics',
    title: 'Weekly performance report ready',
    status: 'ready',
    time: '6 hours ago',
  },
];

const upcomingContent = [
  { title: 'Building AI-Powered Content Pipelines', platform: 'YouTube', date: 'Today, 2:00 PM' },
  { title: 'RTX 5090 AI Benchmark Results', platform: 'TikTok', date: 'Today, 6:00 PM' },
  { title: 'Prompt Engineering Tips', platform: 'LinkedIn', date: 'Tomorrow, 9:00 AM' },
  { title: 'Local LLM Setup Guide', platform: 'Twitter', date: 'Tomorrow, 12:00 PM' },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'approved':
    case 'posted':
    case 'ready':
      return <Badge variant="success">{status}</Badge>;
    case 'processing':
    case 'generated':
      return <Badge variant="warning">{status}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your content pipeline at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description} · {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your content pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Content */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Posts</CardTitle>
            <CardDescription>Scheduled content for the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{content.title}</p>
                    <p className="text-xs text-muted-foreground">{content.date}</p>
                  </div>
                  <Badge variant="outline">{content.platform}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to keep your pipeline flowing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 hover:border-primary hover:bg-accent transition-colors">
              <TrendingUp className="h-8 w-8 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Fetch New Topics</span>
            </button>
            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 hover:border-primary hover:bg-accent transition-colors">
              <FileText className="h-8 w-8 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Generate Script</span>
            </button>
            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 hover:border-primary hover:bg-accent transition-colors">
              <Video className="h-8 w-8 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Create Video</span>
            </button>
            <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 hover:border-primary hover:bg-accent transition-colors">
              <CheckCircle className="h-8 w-8 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Review Queue</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
