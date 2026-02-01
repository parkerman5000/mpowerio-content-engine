'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink, Key, Webhook, Bell, Palette } from 'lucide-react';

const apiConnections = [
  {
    name: 'Supabase',
    description: 'Database and authentication',
    status: 'connected',
    icon: '🗄️',
  },
  {
    name: 'Anthropic (Claude)',
    description: 'Script generation AI',
    status: 'not_configured',
    icon: '🤖',
  },
  {
    name: 'HeyGen',
    description: 'AI avatar video generation',
    status: 'not_configured',
    icon: '🎥',
  },
  {
    name: 'ElevenLabs',
    description: 'Voice synthesis',
    status: 'not_configured',
    icon: '🔊',
  },
];

const socialConnections = [
  { name: 'YouTube', status: 'not_configured', icon: '📺' },
  { name: 'TikTok', status: 'not_configured', icon: '🎵' },
  { name: 'Instagram', status: 'not_configured', icon: '📸' },
  { name: 'Twitter/X', status: 'not_configured', icon: '🐦' },
  { name: 'LinkedIn', status: 'not_configured', icon: '💼' },
  { name: 'Threads', status: 'not_configured', icon: '🧵' },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'connected') {
    return (
      <Badge variant="success" className="gap-1">
        <Check className="h-3 w-3" />
        Connected
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1">
      <X className="h-3 w-3" />
      Not Configured
    </Badge>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your content engine</p>
      </div>

      {/* API Connections */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>API Connections</CardTitle>
          </div>
          <CardDescription>Connect external services for content generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiConnections.map((api) => (
              <div key={api.name} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{api.icon}</span>
                  <div>
                    <div className="font-medium">{api.name}</div>
                    <div className="text-sm text-muted-foreground">{api.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={api.status} />
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Connections */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            <CardTitle>Social Platforms</CardTitle>
          </div>
          <CardDescription>Connect your social media accounts for posting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {socialConnections.map((social) => (
              <div
                key={social.name}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{social.icon}</span>
                  <div className="font-medium">{social.name}</div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhook Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            <CardTitle>Webhooks</CardTitle>
          </div>
          <CardDescription>Configure automation triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">n8n Workflow Trigger</div>
                <div className="text-sm text-muted-foreground">
                  Send events to n8n for automation
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">Not Configured</Badge>
                <Button variant="outline" size="sm">
                  Setup
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">Custom Webhook</div>
                <div className="text-sm text-muted-foreground">
                  Send events to your own endpoint
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">Not Configured</Badge>
                <Button variant="outline" size="sm">
                  Setup
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Configure how you receive updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'New topics discovered', enabled: true },
              { label: 'Script generation complete', enabled: true },
              { label: 'Video rendering complete', enabled: true },
              { label: 'Post published', enabled: false },
              { label: 'Weekly analytics report', enabled: true },
            ].map((notification) => (
              <div
                key={notification.label}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <span className="text-sm">{notification.label}</span>
                <Button variant={notification.enabled ? 'default' : 'outline'} size="sm">
                  {notification.enabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Brand Voice</CardTitle>
          </div>
          <CardDescription>Configure your content style and tone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Default Tone</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Professional', 'Casual', 'Educational', 'Excited', 'Contrarian'].map((tone) => (
                  <Button
                    key={tone}
                    variant={tone === 'Professional' ? 'default' : 'outline'}
                    size="sm"
                  >
                    {tone}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Target Audience</label>
              <p className="text-sm text-muted-foreground mt-1">
                Tech-savvy professionals interested in AI and automation
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
