# GigScope AI — Deployment Guide

## 1. Prerequisites
- Node.js 18.18+ or 20+ (Node v24 supported)
- npm or pnpm or yarn
- Optional: OpenRouter / NVIDIA NIM / OpenAI API Key
- Optional: Tavily API Key

---

## 2. Deploying to Vercel

GigScope AI is built with the Next.js App Router and deploys directly to Vercel without custom server configuration.

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, click **Add New Project** and select your repository.
3. In **Environment Variables**, configure:
   - `AI_PROVIDER`: `openrouter` (or `nvidia` or `openai`)
   - `AI_MODEL`: `nvidia/nemotron-3.5-lightning` (or `gpt-4o-mini`)
   - `AI_API_KEY`: Your provider API key
   - `RESEARCH_PROVIDER`: `duckduckgo` (or `tavily` if using Tavily API)
   - `TAVILY_API_KEY`: (optional, if using Tavily)
4. Click **Deploy**.
5. Once deployed, verify `/api/health` returns `{"status": "ok"}`.

---

## 3. Deploying to Node.js Server / VPS

```bash
# 1. Clone repository
git clone <your-repo-url>
cd gigscope-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Build application
npm run build

# 5. Start production server
npm run start -p 3000
```

---

## 4. Verification Checklist
- [ ] `GET /api/health` returns HTTP 200 with application status `ok`.
- [ ] Submit a test Gig Title draft; verify results display within 5–10 seconds.
- [ ] Verify rate limiter returns 429 when exceeding 30 requests/minute.
- [ ] Check console logs to ensure no credentials or secret keys are printed.
