'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

// Mock scheduled content
const mockSchedule = [
  {
    id: '1',
    title: 'AI Agents Deep Dive',
    platform: 'youtube',
    scheduledFor: '2026-02-01T14:00:00Z',
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Quick AI Tips',
    platform: 'tiktok',
    scheduledFor: '2026-02-01T18:00:00Z',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'MCP Protocol Thread',
    platform: 'twitter',
    scheduledFor: '2026-02-02T09:00:00Z',
    status: 'scheduled',
  },
  {
    id: '4',
    title: 'Local LLM Guide',
    platform: 'linkedin',
    scheduledFor: '2026-02-02T10:00:00Z',
    status: 'scheduled',
  },
  {
    id: '5',
    title: 'RTX 5090 Benchmark',
    platform: 'youtube',
    scheduledFor: '2026-02-03T15:00:00Z',
    status: 'scheduled',
  },
  {
    id: '6',
    title: 'Prompt Engineering Tips',
    platform: 'instagram',
    scheduledFor: '2026-02-03T19:00:00Z',
    status: 'scheduled',
  },
];

const platformColors: Record<string, string> = {
  youtube: 'bg-red-500',
  tiktok: 'bg-black',
  twitter: 'bg-blue-400',
  linkedin: 'bg-blue-700',
  instagram: 'bg-pink-500',
  threads: 'bg-gray-800',
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate calendar days for current week
function getWeekDays(startDate: Date) {
  const week = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay()); // Start from Sunday

  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    week.push(day);
  }
  return week;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function CalendarPage() {
  const today = new Date('2026-02-01');
  const weekDays = getWeekDays(today);

  // Group schedule by date
  const scheduleByDate = mockSchedule.reduce(
    (acc, item) => {
      const date = new Date(item.scheduledFor).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, typeof mockSchedule>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your content</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">
              {weekDays[0]?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {days.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {/* Day Cells */}
            {weekDays.map((date) => {
              const dateStr = date.toDateString();
              const isToday = dateStr === today.toDateString();
              const daySchedule = scheduleByDate[dateStr] || [];

              return (
                <div
                  key={dateStr}
                  className={`min-h-[120px] rounded-lg border p-2 ${
                    isToday ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isToday ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {daySchedule.map((item) => (
                      <div
                        key={item.id}
                        className="text-xs p-1.5 rounded bg-muted hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <div
                            className={`w-2 h-2 rounded-full ${platformColors[item.platform]}`}
                          />
                          <span className="text-muted-foreground">
                            {formatTime(item.scheduledFor)}
                          </span>
                        </div>
                        <div className="font-medium truncate">{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(platformColors).map(([platform, color]) => (
              <div key={platform} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-sm capitalize">{platform}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
          <CardDescription>Next scheduled content across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSchedule.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${platformColors[item.platform]}`} />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.scheduledFor).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {item.platform}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
