# GigScope AI — System Architecture & Data Flow

## 1. High-Level Architectural Overview

GigScope AI is built as a stateless, pre-publication freelance market research and content intelligence engine. It is implemented in **Next.js (App Router)** with **TypeScript**, **Tailwind CSS**, and **Zod**.

```
[ User Browser ]
       │
       ▼ (HTTP POST /api/analyze)
[ Security & Rate Limiting Gate ]
       │─── Sliding Window IP Rate Limiter (30 req/min)
       │─── Input Validation (Payload shape, length bounds)
       ▼
[ Automatic Classification & Offer Extraction ]
       │─── Service Category & Niche Inference
       │─── Deliverable & Tech Stack Detection
       │─── Seller-Truth Boundary Extraction
       ▼
[ Query Planner & Live Market Research Engine ]
       │─── Dynamic Niche Search Plan (3 targeted queries)
       │─── Search Provider (DuckDuckGo Live / Tavily API)
       │─── SSRF-Protected Web Fetcher (Private IP & DNS rebind defense)
       │─── Text & Snippet Extractor
       │─── Deduplication & Relevance Scoring
       ▼
[ Market Synthesis & Analysis Modules ]
       │─── Competitor Patterns Synthesis (Frequency & source links)
       │─── Keyword Intelligence (Categorization & evidence attribution)
       │─── Buyer Hesitations & Concern Mapping
       │─── Market Gaps & Opportunities
       ▼
[ AI Content Optimization Engine ]
       │─── OpenAI-Compatible Provider (Nemotron 3.5 Lightning / OpenRouter / NIM)
       │─── Deterministic Research-Grounded Synthesis Fallback
       │─── Platform Rule Enforcement (Title <= 80c, Desc <= 1,200c, FAQ <= 300c)
       ▼
[ Multi-Stage Validation & Quality Scoring ]
       │─── Platform TOS Checks (No off-platform contacts)
       │─── Originality Overlap Check against inspected sources
       │─── Seller-Truth Check (Flags unverified claims)
       │─── Transparent Heuristic Quality Rubrics (0–100)
       ▼
[ Structured JSON Response ] -> [ Interactive Results Dashboard ]
```

---

## 2. Core Subsystems

### 2.1 Security & Ingress Layer (`src/lib/security/`)
- **`input-limits.ts`**: Enforces strict payload schemas. Minimum draft length is 3 characters; maximum draft is 15,000 characters; optional context is capped at 3,000 characters.
- **`rate-limit.ts`**: Sliding-window in-memory limiter tracking client IP addresses with automated 5-minute memory purge cycles. Returns standard `Retry-After`, `X-RateLimit-Limit`, and `X-RateLimit-Remaining` headers.
- **`url-safety.ts`**: Enterprise-grade Server-Side Request Forgery (SSRF) defense. Blocks IPv4 private subnets (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16), IPv6 loopback/link-local, cloud metadata hostnames (`metadata.google.internal`), and resolves hostnames via DNS lookup before network requests to protect against DNS rebinding.

### 2.2 Live Research Engine (`src/lib/research/`)
- **`provider.ts`**: Abstract interface decoupling search backends from optimization logic.
- **`duckduckgo.ts`**: Live search provider querying public search indices without requiring paid API keys or exposing billing credentials. Unwraps redirect parameters to extract canonical target URLs.
- **`tavily.ts`**: Integration for Tavily search when `TAVILY_API_KEY` is configured.
- **`retrieval.ts`**: Hardened HTTP client featuring streaming payload size capping (512 KB), 8-second request timeouts, and redirect destination re-verification.
- **`extraction.ts`**: HTML sanitization and keyword-targeted excerpt extraction.
- **`deduplication.ts`**: Normalizes and scores sources against draft terms.
- **`coverage.ts`**: Produces a full `ResearchCoverage` report disclosing inspected source counts, provider used, queries executed, and coverage limitations.

### 2.3 Market Analysis Modules (`src/lib/analysis/`)
- **`classifier.ts`**: Deterministic keyword and intent matching inferring Category, Niche, Sub-Niche, Core Service, Deliverable, and Target Buyer.
- **`offer-extraction.ts`**: Separates explicit seller deliverables from unsupported claims (such as "100% satisfaction guarantee" or "guaranteed #1 rank").
- **`competitor-analysis.ts`**: Identifies recurring offer patterns across sources and tags evidence levels.
- **`keyword-analysis.ts`**: Groups search phrases into Primary, Secondary, Deliverable-Specific, Buyer-Intent, and Long-Tail categories with placement advice.
- **`buyer-intent.ts`**: Maps common buyer uncertainties (scope, prerequisites, revisions) to draft sections.
- **`scoring.ts`**: Content-specific scoring rubrics (Title, Description, FAQs) calculating transparent 0–100 heuristic scores accompanied by explicit disclaimers.

### 2.4 Content Validation & Quality (`src/lib/validation/`)
- **`platform-rules.ts`**: Validates character ceilings and flags prohibited off-platform communication (emails, phone numbers, external payment methods like PayPal).
- **`originality.ts`**: Slides a 6-word window across retrieved competitor snippets to detect and flag any verbatim phrase copying.
- **`seller-truth.ts`**: Compares original draft against optimized content to ensure newly added claims (e.g. years of experience, client numbers) are flagged for seller verification.

---

## 3. Runtime Model Configuration

The application is engineered to call **NVIDIA Nemotron 3.5 Lightning** (`nvidia/nemotron-3.5-lightning`) via OpenRouter or NVIDIA NIM, or any standard OpenAI-compatible endpoint.

When an API key is not configured, the system activates its **Deterministic Research-Grounded Synthesis Engine**, generating fully compliant, structured, and evidenced optimizations grounded in the retrieved market sources.
