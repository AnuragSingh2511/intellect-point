# Intellect-Point

## Tech stack

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn-style](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Prisma 7](https://www.prisma.io/)
- [Better Auth](https://www.better-auth.com/)
- [Vercel AI SDK](https://ai-sdk.dev/)
- [AI SDK Google](https://ai-sdk.dev/providers/google-generative-ai)
- [Inngest](https://www.inngest.com/)
- [PptxGenJS](https://gitbrent.github.io/PptxGenJS/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [@t3-oss/env-core](https://env.t3.gg/)

## Features

- Sign in with Google or GitHub (Better Auth + `/api/auth/*`).
- Home (`/`) — Authenticated dashboard: list presentations, compose a prompt, choose slide count, style, tone, and layout, then create a deck. Creating a presentation enqueues generation and navigates to the detail page.
- Presentation detail (`/presentations/:presentationId`) — Live status while Inngest generates slides; view slides in a carousel-style preview; edit metadata and content; regenerate the deck; delete; **fullscreen preview** with keyboard arrow navigation and floating prev/next buttons; **slideshow modal**.
- **PPT Export** — Export presentations as `.pptx` using **PptxGenJS** with dark-themed slides, titles, content, and speaker notes.
- **PDF Export** — Export presentations as `.pdf` using **jsPDF** with cover slide, slide numbering, and formatted content.
- **Gradient Thumbnails** — Sidebar slide cards show a blue-to-indigo gradient during image load/error states.
- Public-ish routes — `/login` and auth/Inngest API paths are public (see `src/lib/auth-paths.ts`). Other routes enforce auth in `beforeLoad`.
- Server functions — Create/update/regenerate/delete presentations and load data via TanStack Start `createServerFn` (under `src/features/presentation/`).

## Prerequisites

- Bun (recommended; npm also works)
- SQLite database
- Google AI (Gemini) API key for generation
- Inngest for background runs (local dev uses the Inngest dev server; production uses your deployed `/api/inngest` endpoint)
- OAuth apps (optional but expected for login): Google and/or GitHub developer console apps with correct redirect URLs

## Environment variables

Create a `.env` in the project root (Prisma also loads these via `prisma.config.ts`).

| Variable                       | Description / How to get                            |
| ------------------------------ | --------------------------------------------------- |
| `DATABASE_URL`                 | SQLite path, e.g. `file:./dev.db`                   |
| `BETTER_AUTH_SECRET`           | Run `npx @better-auth/cli secret` to generate       |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio API key for Gemini generation      |
| `GOOGLE_CLIENT_ID`             | Google OAuth client ID                              |
| `GOOGLE_CLIENT_SECRET`         | Google OAuth client secret                          |
| `GITHUB_CLIENT_ID`             | GitHub OAuth client ID                              |
| `GITHUB_CLIENT_SECRET`         | GitHub OAuth client secret                          |
| `VITE_APP_TITLE`               | App title shown in the UI                           |
| `SERVER_URL`                   | Base URL of your app (e.g. `http://localhost:3000`) |

Better Auth / OAuth: Configure your provider dashboards so redirect URLs match your environment (e.g. `http://localhost:3000/api/auth/callback/google` for local dev). See [Better Auth docs](https://www.better-auth.com/docs).

Google AI: Key creation and quotas are documented in [Google AI Studio](https://aistudio.google.com/).

## Setup

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Configure environment**
   Add the variables from the table above to `.env`.

3. **Database**

   ```bash
   bunx --bun prisma migrate dev
   ```

   Or push schema directly:

   ```bash
   bunx --bun prisma db push
   ```

4. **Inngest (local development)**
   Run the Inngest dev server so `/api/inngest` can receive and execute functions (e.g. `generatePresentation`). Typical workflow:

   ```bash
   npx inngest-cli@latest dev
   ```

   Point it at your app URL (e.g. `http://localhost:3000`) per Inngest CLI instructions so events and the `presentation/generate` function run locally.

5. **Start the app**
   ```bash
   bun --bun run dev
   ```
   The dev server defaults to port 3000.

## Scripts

| Command                         | Description                   |
| ------------------------------- | ----------------------------- |
| `bun --bun run dev`             | Start development server      |
| `bun --bun run build`           | Build for production          |
| `bun --bun run start`           | Start production server       |
| `bun --bun run test`            | Run Vitest                    |
| `bun --bun run lint`            | Run ESLint                    |
| `bun --bun run format`          | Run Prettier                  |
| `bun --bun run check`           | Type check with TypeScript    |
| `bunx --bun prisma migrate dev` | Run Prisma migrations         |
| `bunx --bun prisma db push`     | Push schema without migration |
| `bunx --bun prisma studio`      | Open Prisma Studio            |

## Project structure (high level)

```
src/
  routes/                   # File-based routes (__root, index, login, presentations, api/inngest, api/auth)
  features/presentation/    # UI, hooks, server actions, queries, export-pptx, export-pdf, templates/options
  integrations/             # TanStack Query root provider, Inngest client + functions
  lib/                      # auth, auth paths, env helpers
  middleware/               # Auth middleware helpers (e.g. for server functions)
  components/               # Shared UI (including shadcn-style components)
  hooks/                    # Custom hooks (useFullscreen, etc.)
prisma/
  schema.prisma             # User, Presentation, Slide, Better Auth models
```

## How generation works (brief)

1. User submits a prompt and options on `/` → `createPresentation` server function creates a Presentation row with status `GENERATING` and sends an Inngest event `presentation/generate`.
2. Inngest (`src/integrations/inngest/functions.ts`) loads the presentation, calls Gemini with a structured schema for slides, replaces Slide rows, then marks the presentation `COMPLETED` (or `FAILED` on error).
3. The detail page polls/refetches so the UI updates when generation finishes.

## UI components (shadcn)

Add components with the latest CLI:

```bash
bunx --bun shadcn@latest add button
```

## Testing, linting, and formatting

```bash
bun --bun run test
bun --bun run lint
bun --bun run format
bun --bun run check
```

## Learn more

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Better Auth](https://www.better-auth.com)
- [Inngest](https://www.inngest.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [AI SDK](https://ai-sdk.dev/)
