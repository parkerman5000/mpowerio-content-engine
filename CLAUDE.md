# CLAUDE.md - mpowerio Content Engine

This file provides guidance to Claude Code when working in the content engine repository.

## Purpose

Automated content pipeline: **Research → Scripts → Videos → Repurpose → Post → Analytics**

This is a Julia McCoy-style content automation system for mpowerio.ai.

## Architecture

```
mpowerio-content-engine/
├── packages/
│   ├── core/              # Shared types, Supabase client, utilities
│   ├── dashboard/         # Next.js 14 admin UI
│   └── modules/
│       ├── research-pulse/   # Topic gathering (RSS, social, competitors)
│       ├── script-gen/       # Claude API script generation
│       ├── video-gen/        # HeyGen + ElevenLabs avatars
│       ├── repurpose/        # 1 video → 7+ platform variants
│       ├── post-queue/       # Scheduling at optimal times
│       └── analytics/        # Performance tracking + feedback loop
├── supabase/              # Database migrations
└── docker/                # Local development stack
```

## Commands

```bash
# Install dependencies
pnpm install

# Start development (dashboard at localhost:3000)
pnpm dev

# Build all packages
pnpm build

# Run database migrations
pnpm db:migrate

# Generate TypeScript types from Supabase
pnpm db:generate
```

## Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL)
- **Dashboard:** Next.js 14 + Tailwind + shadcn/ui
- **Validation:** Zod
- **Automation:** n8n (optional)

## Development Status

Completed:
- [x] Project scaffolding (monorepo structure)
- [x] Database schema (Supabase migrations)
- [x] Core package (types, client, utilities)
- [x] All 6 modules scaffolded with mock implementations

Pending:
- [ ] Real API integrations (Claude, HeyGen, ElevenLabs)
- [ ] Social platform API connections
- [ ] n8n workflow setup
- [ ] Dashboard authentication

## Environment Variables

Required in `.env` (copy from `.env.example`):
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `HEYGEN_API_KEY` / `HEYGEN_AVATAR_ID`
- `ELEVENLABS_API_KEY` / `ELEVENLABS_VOICE_ID`
- Social platform tokens

## Content Pipeline Flow

```
6 AM Research Pulse
       ↓
   Trending topics + Industry intel
       ↓
   Script Generator (Claude API)
       ↓
   Short/Medium/Long form scripts
       ↓
   Video Generator (HeyGen + ElevenLabs)
       ↓
   Avatar videos rendered
       ↓
   Repurpose Engine
       ↓
   1 video → YouTube Short, TikTok, Instagram Reel, Twitter, LinkedIn, Threads
       ↓
   Post Queue (optimal timing)
       ↓
   Analytics → Feedback to Research Pulse
```

## Pain Point Analysis Protocol

When analyzing transcripts for content ideas:
1. Create `context.md` - Goal of analysis session
2. Create `todos.md` - Files to process
3. Create `insights.md` - Cumulative pain points

**Filter:** Only log if it causes frustration, stress, fear, or confusion.

## Related Projects

- **butch-learnings:** Research Observatory feeds content ideas
- **mpowerio-operations:** Business context and strategy
