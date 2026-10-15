# GigScope AI
> **Research smarter. Write better. Launch with confidence.**  
> *Turn your Fiverr Gig drafts into researched, buyer-focused content with competitor insights, keyword evidence, and practical optimization recommendations.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-emerald?style=for-the-badge&logo=github)](https://zeeshan1616.github.io/gigscope-ai/)

**Live URL**: [https://zeeshan1616.github.io/gigscope-ai/](https://zeeshan1616.github.io/gigscope-ai/)

---

## 1. Product Overview

**GigScope AI** is a pre-publication market research and content intelligence web application designed for Fiverr sellers. Before a seller publishes a Gig, GigScope AI analyzes their proposed draft, automatically discovers their service category and niche, queries live public market listings, synthesizes observed competitor patterns and buyer hesitations, and optimizes their wording with real evidence.

### Core Philosophy
**Research first. Understand the offer second. Optimize third. Validate fourth.**
- **Never optimize blindly**: Market research precedes every text recommendation.
- **Never fabricate evidence**: No fake competitor listings, ratings, or simulated statistics.
- **Never invent credentials**: Years of experience, client counts, or guarantees not found in the seller's draft are never added.
- **No ranking illusions**: Content quality scores are heuristic quality rubrics, not algorithmic ranking guarantees.

---

## 2. Key Features

- **Three Dedicated Content Modes**:
  1. **Gig Title Optimizer**: Enforces official Fiverr 80-character maximum, standard "I will" prefix, and generates 2–3 distinct alternative angles (Direct, Deliverable-Focused, Benefit-Oriented).
  2. **Gig Description Optimizer**: Enforces Fiverr's 1,200-character ceiling, scannable bulleted sections, and generates concise vs. detailed alternative styles while banning generic filler.
  3. **FAQ Optimizer**: Formulates crisp Q&A pairs (each answer $\le 300$ characters) resolving core pre-purchase buyer hesitations.
- **Automatic Niche & Service Classification**: Infers Category, Niche, Sub-Niche, Primary Deliverables, Target Buyer, and Buyer Problems without requiring manual questionnaires or a live Fiverr Gig URL.
- **Live Search & Research Engine**:
  - Out-of-the-box live web search using public search indices (zero API key required).
  - Optional Tavily Search API integration.
  - SSRF-protected webpage fetcher with payload size bounding and DNS rebinding defense.
  - Transparent research coverage report disclosing inspected sources, queries executed, and limitations.
- **Keyword Intelligence & Volume Disclosure**: Classifies terms into Primary, Secondary, Deliverable-Specific, and Buyer-Intent with placement instructions, disclosing that quantitative search volume requires an enterprise keyword API.
- **Originality & Overlap Defense**: 6-word sliding window check against inspected sources prevents verbatim copying.
- **Seller-Truth Protection**: Audits final text to ensure newly added claims are flagged for seller verification.
- **In-Place Content Editing & Copy**: Edit the recommended draft directly, switch between alternatives, monitor live character budgets, and copy clean text to clipboard with feedback.

---

## 3. Technology Stack

- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript
- **Styling**: Tailwind CSS with custom brand palette (Emerald & slate warm neutral tones)
- **Icons**: Lucide React
- **Validation**: Zod & custom SSRF validators
- **Testing**: Vitest (Unit & Integration tests)
- **AI Runtime**: Modular OpenAI-compatible adapter supporting **NVIDIA Nemotron 3.5 Lightning** (`nvidia/nemotron-3.5-lightning`), OpenRouter, NVIDIA NIM, and OpenAI, paired with a deterministic research-grounded synthesis fallback.

---

## 4. Project Structure

```
d:/GIG AI/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts       # POST /api/analyze main endpoint
│   │   │   └── health/route.ts        # GET /api/health safe status endpoint
│   │   ├── globals.css                # Tailwind base & theme
│   │   ├── layout.tsx                 # Root layout & metadata
│   │   └── page.tsx                   # Main interactive workspace
│   ├── components/
│   │   ├── layout/                    # Header, Footer, MethodologyModal
│   │   ├── optimizer/                 # ContentTypeSelector, DraftInput, AnalysisProgress
│   │   ├── results/                   # ResultsLayout, Overview, OptimizedContent, MarketResearch, etc.
│   │   └── ui/                        # Button, Badge, Card
│   ├── lib/
│   │   ├── ai/                        # Provider, Prompts, Schemas, Optimize Orchestrator
│   │   ├── analysis/                  # Classifier, Offer Extraction, Competitors, Keywords, Scoring
│   │   ├── research/                  # DuckDuckGo, Tavily, Planner, Retrieval, Extraction, Coverage
│   │   ├── security/                  # SSRF URL Safety, Rate Limiter, Input Limits
│   │   ├── validation/                # Platform Rules, Originality Overlap, Seller Truth
│   │   └── utils/                     # Text & Error utilities
│   └── types/                         # TypeScript interfaces
├── tests/
│   ├── unit/                          # Unit test suites (limits, classifier, SSRF, rules, scoring)
│   └── integration/                   # Full end-to-end optimization pipeline tests
├── docs/                              # Architecture, methodology, security, and deployment docs
├── .env.example                       # Documented environment template
└── package.json
```

---

## 5. Getting Started

### 5.1 Installation
```bash
# Clone the repository and install dependencies
npm install
```

### 5.2 Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Key Environment Variables:
```env
# AI Model Configuration (Optional - fallback synthesis works without a key)
AI_PROVIDER=openrouter
AI_MODEL=nvidia/nemotron-3.5-lightning
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=your_openrouter_or_nvidia_key

# Research Provider (DuckDuckGo is active by default with zero keys required)
RESEARCH_PROVIDER=duckduckgo
TAVILY_API_KEY=

# Security Limits
RATE_LIMIT_MAX_REQUESTS=30
RATE_LIMIT_WINDOW_MS=60000
```

### 5.3 Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Testing & Quality Verification

Run the complete test suite:
```bash
npm test
```
The test suite includes 23 automated tests covering:
- Input limits & schema boundaries
- Automatic niche and service classification
- SSRF prevention (blocking IPv4/IPv6 private ranges, cloud metadata, DNS rebinding)
- Heuristic scoring rubrics
- Platform compliance checks (character limits, TOS off-platform contact detection)
- End-to-end integration across Title, Description, and FAQ pipelines with live web research

### Building for Production
```bash
npm run build
```

---

## 7. Platform Limits & Guidelines (Fiverr Verified)

- **Gig Title**: Maximum **80 characters** (starts with "I will"), ideal display length 50–70 characters.
- **Gig Description**: Maximum **1,200 characters** hard ceiling. First 110 characters serve as search preview hook. No personal emails, phone numbers, external messenger handles, or direct payment methods.
- **FAQs**: Up to **10 FAQs maximum**, each answer limited to **300 characters**.

---

## 8. Disclaimer
GigScope AI is an independent software tool created to assist freelance sellers in researching public marketplace conventions and refining pre-publication drafts. GigScope AI is not affiliated with, endorsed by, or sponsored by Fiverr International Ltd.
