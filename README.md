# mpowerio Content Engine

Automated content pipeline: **Research → Scripts → Videos → Repurpose → Post → Analytics**

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Dashboard will be available at `http://localhost:3000`

## Architecture

```
mpowerio-content-engine/
├── packages/
│   ├── core/                 # Shared types, Supabase client, utilities
│   ├── dashboard/            # Next.js admin UI
│   └── modules/
│       ├── research-pulse/   # Topic gathering
│       ├── script-gen/       # Claude script generation
│       ├── video-gen/        # HeyGen + ElevenLabs
│       ├── repurpose/        # Multi-platform variants
│       ├── post-queue/       # Scheduling & posting
│       └── analytics/        # Performance tracking
├── supabase/
│   └── migrations/           # SQL schema
└── docker/
    └── docker-compose.yml    # Local development
```

## Modules

### Research Pulse
Gathers trending topics from RSS feeds, Twitter, Reddit, and competitor analysis.

```typescript
import { fetchDailyTopics } from '@mpowerio/research-pulse';

const result = await fetchDailyTopics();
console.log(result.topics);
```

### Script Generator
Generates platform-optimized scripts using Claude AI.

```typescript
import { generateScript } from '@mpowerio/script-gen';

const script = await generateScript(topic, 'short_form', {
  tone: 'professional',
});
```

### Video Generator
Creates AI avatar videos using HeyGen and ElevenLabs.

```typescript
import { createVideo } from '@mpowerio/video-gen';

const video = await createVideo(script, {
  avatarId: 'avatar_professional_male',
});
```

### Repurpose Engine
Transforms videos into platform-specific content pieces.

```typescript
import { repurposeVideo } from '@mpowerio/repurpose';

const result = await repurposeVideo(video);
// Creates: YouTube Short, TikTok, Instagram Reel, Twitter, LinkedIn, Threads
```

### Post Queue
Schedules and posts content at optimal times.

```typescript
import { schedulePost, postNow } from '@mpowerio/post-queue';

await schedulePost(contentPieceId, { useOptimalTime: true });
```

### Analytics
Tracks performance and updates research priorities.

```typescript
import { fetchAnalytics, updateResearchPriorities } from '@mpowerio/analytics';

await fetchAnalytics(contentPieceId);
await updateResearchPriorities(); // Feedback loop
```

## Database Setup

1. Create a Supabase project or run locally:
   ```bash
   supabase start
   ```

2. Run migrations:
   ```bash
   pnpm db:migrate
   ```

3. Generate TypeScript types:
   ```bash
   pnpm db:generate
   ```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` - Database connection
- `ANTHROPIC_API_KEY` - Claude for script generation
- `HEYGEN_API_KEY` / `HEYGEN_AVATAR_ID` - AI video generation
- `ELEVENLABS_API_KEY` / `ELEVENLABS_VOICE_ID` - Voice synthesis
- Social platform tokens for posting

## Docker

Run the full stack locally:

```bash
cd docker
docker-compose up
```

With n8n automation:

```bash
docker-compose --profile automation up
```

## Development Status

- [x] Project scaffolding (monorepo, TypeScript)
- [x] Database schema (Supabase migrations)
- [x] Core package (types, client, utilities)
- [x] Research Pulse module (mock data)
- [x] Script Generator (mock + prompt templates)
- [x] Video Generator (stub)
- [x] Repurpose Engine
- [x] Post Queue
- [x] Analytics module
- [x] Next.js Dashboard
- [x] Docker configuration

## Next Steps

1. Add real API integrations (Claude, HeyGen, ElevenLabs)
2. Connect social platform APIs
3. Set up n8n workflows
4. Add authentication to dashboard

## Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL)
- **Dashboard:** Next.js 14 + Tailwind + shadcn/ui
- **Validation:** Zod
- **Automation:** n8n (optional)
