# Agenda Cartes FR — CLAUDE.md

## Project Overview

TCG events directory for France (Pokémon, Magic, Yu-Gi-Oh, One Piece, Lorcana, etc.).
Monorepo with a Next.js 14 web app and an autonomous Node.js crawler service.
**Backend: Sanity CMS** (replaces Supabase).

## Structure

```
collectible-events-fr/
├── apps/
│   ├── web/          # Next.js 14 App Router (Vercel) + Sanity Studio at /studio
│   └── crawler/      # Node.js autonomous crawler (Railway)
└── packages/
    └── shared/       # Shared types/enums (source of truth)
```

## Dev Commands

```bash
# Install all dependencies
pnpm install

# Start both apps in dev mode
pnpm dev

# Start only the web app
pnpm --filter web dev       # → http://localhost:3000
                             # Studio at http://localhost:3000/studio

# Start only the crawler
pnpm --filter crawler dev   # → http://localhost:3001

# Type-check all packages
pnpm type-check

# Run linter
pnpm lint
```

## Sanity Setup (first time)

```bash
# 1. Create a free account on sanity.io
# 2. Initialize Sanity in the web app:
cd apps/web && pnpm create sanity@latest
# → "Add to existing project" → note the Project ID

# 3. Create tokens in Dashboard → API → Tokens:
#    - "Viewer" token → SANITY_API_READ_TOKEN
#    - "Editor" token → SANITY_API_WRITE_TOKEN

# 4. Configure webhook in Dashboard → API → Webhooks:
#    URL: https://your-domain.vercel.app/api/webhooks/sanity
#    Filter: _type == "event"
#    Secret: random string → SANITY_WEBHOOK_SECRET
```

## Architecture

### Monorepo
- **pnpm workspaces** + **Turborepo** for parallel builds
- `@agenda-cartes/shared` — imported by both web and crawler
- `@agenda-cartes/web` — Next.js app with embedded Sanity Studio
- `@agenda-cartes/crawler` — Node.js crawling service

### Rendering (Next.js)
- **Homepage** (`/`): ISR `revalidate: 3600` (1h)
- **Listing** (`/evenements`): ISR `revalidate: 3600`
- **Detail** (`/evenements/[slug]`): ISR `revalidate: 3600` + on-demand via Sanity webhook
- **Map** (`/carte`): ISR `revalidate: 3600`
- **Studio** (`/studio`): Sanity Studio — admin panel (auth via sanity.io)
- **Webhook** (`POST /api/webhooks/sanity`): called by Sanity → triggers `revalidatePath`

### Filters (listing page)
URL-synced via `useSearchParams`. Filter state = URL params = SSR initial render = shareable links.
- `?tcg=pokemon&tcg=magic` — multi-select TCG types
- `?format=tournoi` — event format
- `?dept=75` — department code
- `?q=paris` — full-text search
- `?gratuit=1` — free events only
- `?page=2` — pagination

## Adding a New TCG Type

1. **`packages/shared/src/types/enums.ts`**: Add to `TCGType` enum + `TCG_CONFIG`
2. **`apps/web/schemaTypes/event.ts`**: Add to the `tcgTypes` field list options
3. **`apps/web/schemaTypes/submission.ts`**: Same
4. **`apps/web/schemaTypes/source.ts`**: Same
5. No DB migrations needed — just TypeScript changes

## Adding a New Crawler Adapter

1. Create `apps/crawler/src/adapters/your-game.adapter.ts`
2. Extend `BaseAdapter` and implement `crawl(): Promise<CrawlResult>`
3. Register in `apps/crawler/src/orchestrator.ts` in `createAdapter()`:
   ```ts
   if (source.tcgTypes.includes("your_game")) {
     return new YourGameAdapter(config);
   }
   ```
4. Add a source document in Sanity Studio at `/studio` → Sources crawler

## Crawler Deduplication

```
fingerprint = MD5(normalize(title) | city_lower | YYYY-MM-DD)

_id = "event-{fingerprint}"           (or "event-{sourceId}-{externalId}")
sanity.createOrReplace({ _id, ... })  → automatic upsert, no lookup needed
```

No fuzzy matching required — Sanity's deterministic _id handles deduplication.

## Key Files

| File | Role |
|------|------|
| `packages/shared/src/types/enums.ts` | Source of truth for TCG types, formats |
| `apps/web/schemaTypes/` | Sanity schema (replaces SQL migrations) |
| `apps/web/sanity.config.ts` | Studio configuration |
| `apps/web/lib/sanity/client.ts` | Sanity read/write clients |
| `apps/web/lib/sanity/queries.ts` | All GROQ queries |
| `apps/web/lib/queries/events.ts` | Event query functions (uses GROQ) |
| `apps/web/app/studio/[[...index]]/page.tsx` | Embedded Sanity Studio |
| `apps/web/app/api/webhooks/sanity/route.ts` | ISR revalidation webhook |
| `apps/crawler/src/services/sanity.service.ts` | Sanity write client for crawler |
| `apps/crawler/src/orchestrator.ts` | Coordinates all crawls |
| `apps/crawler/src/adapters/base.adapter.ts` | Adapter contract |

## Environment Variables

See `.env.example` for full list. Critical vars:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` — public Sanity config
- `SANITY_API_READ_TOKEN` — server-side read (Server Components)
- `SANITY_API_WRITE_TOKEN` — write access (submissions API, crawler)
- `SANITY_WEBHOOK_SECRET` — verifies Sanity webhook signatures
- `CRAWLER_SECRET` — shared secret for crawler trigger endpoint

## Deployment

- **Web** → Vercel: connect GitHub repo, set env vars, auto-deploy on push
- **Crawler** → Railway: Dockerfile not required (supports Node.js natively)
  - Start command: `pnpm --filter crawler start`
  - Root directory: `/`
  - Set all env vars in Railway dashboard
- **CMS** → Sanity Cloud: free tier, managed at sanity.io/manage
