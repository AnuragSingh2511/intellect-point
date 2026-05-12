<div align="center">

# PPT AI

**AI-powered presentation generator** — create beautiful, structured slide decks from a simple text prompt.

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Screenshots](#screenshots)

</div>

---

## Features

- **AI Slide Generation** — Enter a topic and automatically generate a complete presentation with titles, bullet points, and speaker notes
- **Live Slide Preview** — Rich preview of the current slide with dark-themed, professional styling
- **Fullscreen Mode** — Immersive fullscreen viewing with keyboard navigation (arrow keys) and floating prev/next buttons
- **Slideshow Playback** — Dedicated slideshow modal for presenting
- **Export** — Download presentations as **PPT** (PowerPoint) or **PDF**
- **Interactive Sidebar** — Clickable slide thumbnails with blue-gradient loading states
- **Editable Settings** — Customize title, prompt, slide count, style, tone, and layout
- **Regenerate** — Re-run AI generation with updated settings
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| Framework       | React + TanStack Router + TanStack Query |
| Styling         | Tailwind CSS + shadcn/ui (glassmorphism) |
| Database        | SQLite with Prisma ORM                   |
| Background Jobs | Inngest                                  |
| Auth            | OAuth (Google, GitHub)                   |
| PPT Export      | pptxgenjs                                |
| PDF Export      | jsPDF                                    |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+

### Installation

```bash
# Clone the repo
git clone https://github.com/AnuragSingh2511/ppt-ai.git
cd ppt-ai

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env and add your:
# - DATABASE_URL
# - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
# - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
# - INNGEST_EVENT_KEY (optional, for local dev)

# Run database migrations
bunx prisma migrate dev

# Start the dev server
bun --bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Inngest (Background Jobs)

For local development, the Inngest dev server runs automatically. Events are processed in the background to generate slides.

```bash
# In a separate terminal (optional, for the dev server UI)
npx inngest-cli@latest dev
```

## Scripts

| Command                | Description                |
| ---------------------- | -------------------------- |
| `bun --bun run dev`    | Start development server   |
| `bun --bun run build`  | Build for production       |
| `bun --bun run start`  | Start production server    |
| `bun --bun run lint`   | Run ESLint                 |
| `bun --bun run format` | Run Prettier               |
| `bun --bun run check`  | Type check with TypeScript |

## Project Structure

```
src/
├── features/presentation/    # Core presentation domain
│   ├── actions/              # Server mutations (create, update, delete, regenerate)
│   ├── api/                  # TanStack Query hooks
│   ├── components/           # UI components (SlideCard, SlidePreview, etc.)
│   ├── lib/                  # Export utilities (PPT, PDF)
│   └── constants/            # Style, tone, layout options
├── hooks/                    # Custom React hooks (useFullscreen, etc.)
├── integrations/inngest/     # Inngest client & functions
├── lib/                      # Auth, Prisma client, utils
└── routes/                   # TanStack Router file-based routes
```

## Environment Variables

| Variable               | Description                                 |
| ---------------------- | ------------------------------------------- |
| `DATABASE_URL`         | SQLite database path (e.g. `file:./dev.db`) |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                      |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                  |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID                      |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret                  |
| `INNGEST_EVENT_KEY`    | Inngest event key (optional for local dev)  |

## Screenshots

_Coming soon — add screenshots of the home page, presentation detail, and fullscreen mode._

## License

[MIT](LICENSE)
