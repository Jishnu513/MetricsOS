# MetricsOS — Enterprise Analytics Dashboard

> A production-grade, AI-powered business analytics platform built with Next.js 15, TypeScript, Supabase, and OpenAI.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-metrics--os.vercel.app-2563eb?style=for-the-badge)](https://metrics-os.vercel.app)

![MetricsOS Dashboard](https://img.shields.io/badge/MetricsOS-v1.0-2563eb?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)

**🔗 Live:** [https://metrics-os.vercel.app](https://metrics-os.vercel.app) — Click **"Demo Login (Admin)"** to explore instantly.

---

## ✨ Features

| Feature | Status |
|---|---|
| 📊 Real-time dashboard with 5 KPI stat cards | ✅ |
| 📈 Interactive Revenue/Users/Combined charts | ✅ |
| 🔐 Google OAuth + demo credentials (NextAuth.js) | ✅ |
| 🗄️ Supabase PostgreSQL with mock data fallback | ✅ |
| 🤖 AI business analysis with OpenAI streaming | ✅ |
| 🌙 Dark mode with localStorage persistence | ✅ |
| 📅 Date range filter (7 / 30 / 90 days) | ✅ |
| 🔔 Notifications dropdown with dismiss | ✅ |
| 📤 CSV export with date-range in filename | ✅ |
| 🔍 Real-time search across transactions | ✅ |
| ⚙️ Settings persistence to localStorage | ✅ |
| 🚨 Full alert log page with severity badges | ✅ |
| 📱 Mobile-responsive sidebar with drawer | ✅ |
| ♻️ Auto-refresh every 15 seconds | ✅ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- (Optional) Supabase account — app runs on mock data without it
- (Optional) Google Cloud project for OAuth
- (Optional) OpenAI API key for live AI insights

### 1. Clone and Install

```bash
git clone https://github.com/Jishnu513/MetricsOS.git
cd MetricsOS
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Authentication (NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Google OAuth (get from console.cloud.google.com)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase (optional — app works without it)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (optional — app uses smart fallback without it)
OPENAI_API_KEY=sk-...
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the login page.

**Demo login:** Use the "Demo Login (Admin)" button — no credentials needed.

---

## 🗄️ Supabase Setup (Optional)

If you want real persistent data:

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the schema in the Supabase SQL editor:

```bash
cat supabase/schema.sql
```

3. Copy the Project URL, anon key, and service_role key into `.env.local`
4. Seed data via the Supabase dashboard or the SQL editor

---

## 🤖 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. For production, also add: `https://metrics-os.vercel.app/api/auth/callback/google`
5. Copy Client ID and Secret to `.env.local`

---

## 🏗️ Architecture

```
ai-dashboard/
├── app/
│   ├── page.tsx              ← Main dashboard (all 6 tabs)
│   ├── layout.tsx            ← Root layout with AuthProvider + Toaster
│   ├── globals.css           ← Design system (light + dark CSS vars)
│   ├── loading.tsx           ← App Router loading fallback
│   ├── error.tsx             ← App Router error boundary
│   ├── login/page.tsx        ← Auth page (Google + Demo)
│   └── api/
│       ├── metrics/          ← GET  /api/metrics (Supabase → mock fallback)
│       ├── ai-insight/       ← POST /api/ai-insight (OpenAI streaming)
│       └── auth/[...nextauth]/ ← NextAuth handler
├── components/
│   ├── Sidebar.tsx           ← Collapsible + mobile drawer
│   ├── Header.tsx            ← Search, dark mode, notifications, date range
│   ├── StatCard.tsx          ← KPI cards with shimmer
│   ├── RevenueChart.tsx      ← Area/Bar chart with mode toggle
│   ├── TrafficChart.tsx      ← Donut chart for traffic sources
│   ├── TransactionTable.tsx  ← Filterable data table
│   ├── ActivityHeatmap.tsx   ← GitHub-style 90-day heatmap
│   ├── AIInsightPanel.tsx    ← AI analysis with SSE streaming
│   └── AuthProvider.tsx      ← NextAuth SessionProvider wrapper
├── lib/
│   ├── data.ts               ← TypeScript types + mock data generators
│   ├── auth.ts               ← NextAuth config (authOptions)
│   ├── supabase.ts           ← Supabase client
│   └── metrics-store.ts      ← DB data loader with fallback
└── supabase/
    └── schema.sql            ← Database schema
```

---

## 🚢 Deployment (Vercel)

1. Push to GitHub (`.env.local` is in `.gitignore` — do NOT commit secrets)
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Update `NEXTAUTH_URL` to your Vercel domain
5. Add the Vercel domain to Google OAuth authorized redirect URIs
6. Deploy ✅

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + CSS Custom Properties |
| Auth | NextAuth.js v4 — Google OAuth + Credentials |
| Database | Supabase (PostgreSQL) with mock fallback |
| Charts | Recharts 3 |
| AI | OpenAI GPT-3.5 Turbo with SSE streaming |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| Deployment | Vercel |

---

## 📄 License

MIT — free to use for portfolio and personal projects.
