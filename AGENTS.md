# MetricsOS — AGENTS.md

## Project Overview
MetricsOS is an enterprise analytics dashboard built with Next.js 15 App Router, TypeScript strict mode, Supabase, NextAuth, and OpenAI.

**Location:** `c:\Users\jishn\Videos\AI-Full-stack-project\ai-dashboard\`

## Commands
- **Dev server:** `npm run dev` (port 3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Type check:** `npx tsc --noEmit`

## Key Architecture Decisions
- All CSS is done via CSS Custom Properties (see `app/globals.css`). Dark mode is toggled by adding `.dark` class to `<html>` — **never** use Tailwind dark: variant.
- Auth is handled by NextAuth v4. The config is in `lib/auth.ts` and re-exported from `app/api/auth/[...nextauth]/route.ts`.
- The `/api/metrics` route tries Supabase first, then falls back to mock generators in `lib/data.ts`.
- The `/api/ai-insight` route supports both streaming (SSE) and non-streaming JSON responses. It detects whether `OPENAI_API_KEY` is set.
- All components use inline `style={{}}` props with CSS variables — **not** Tailwind utility classes directly on elements (Tailwind is used only for global resets via `@import "tailwindcss"`).

## Environment Variables Required
```
NEXTAUTH_URL, NEXTAUTH_SECRET
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY (optional)
```

## File Map
| File | Purpose |
|---|---|
| `app/page.tsx` | Main dashboard — all 6 tabs, dark mode, date range |
| `app/globals.css` | Full design system — CSS vars, `.card`, `.btn`, `.input`, `.dark` |
| `components/Header.tsx` | Top bar — notifications dropdown, dark toggle, date picker |
| `components/Sidebar.tsx` | Collapsible sidebar + mobile drawer |
| `components/AIInsightPanel.tsx` | AI analysis with SSE streaming |
| `lib/data.ts` | All TypeScript types + mock data generators |
| `lib/auth.ts` | NextAuth authOptions |
| `lib/supabase.ts` | Supabase client (anon) |
| `lib/metrics-store.ts` | DB loader with graceful fallback |

## Do NOT
- Do not commit `.env.local`
- Do not use `@media prefers-color-scheme` — dark mode is explicit via `.dark` class
- Do not add new package dependencies without checking if existing ones cover the need
