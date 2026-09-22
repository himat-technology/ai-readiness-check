# AI Readiness Check by Himat Technology

A colorful, production-ready web app that audits any public website for **AI search readiness** — crawlability, sitemaps, technical SEO, structured data, content signals, performance, and AI crawler permissions.

> **Live demo:** [himat.tech/free-tools/ai-readiness-check](https://himat.tech/free-tools/ai-readiness-check)

---

## About Himat Technology

| | |
|---|---|
| **Website** | [himat.co.in](https://himat.co.in) |
| **Email** | [info@himat.co.in](mailto:info@himat.co.in) |
| **Phone** | [94452 34023](tel:+919445234023) |
| **Demo tool** | [AI Readiness Check](https://himat.tech/free-tools/ai-readiness-check) |

### Social

- [Facebook — Himat Technology](https://www.facebook.com/people/Himat-technology/61593829197445/)
- [LinkedIn — Himat Technology](https://www.linkedin.com/company/himat-technology)
- [Instagram — @himat_technology](https://www.instagram.com/himat_technology?igsh=djdmcGxweWtwYWI0)

---

## Features

- Live website analysis via `POST /api/analyze`
- Weighted AI Readiness Score (0–100) across 6 categories
- Detailed pass / warning / fail audit checks
- Prioritized recommendations with suggested fixes
- Platform compatibility for ChatGPT, Google AI Overviews, Perplexity, Gemini, Claude, Bing Copilot
- AI crawler detection (GPTBot, ClaudeBot, PerplexityBot, and more)
- Structured data inspector (JSON-LD, Microdata, RDFa)
- JSON + PDF export and copyable audit summary
- Scan history stored in browser `localStorage`
- Vibrant, brand-forward UI with Himat contact & social links

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn-style UI primitives
- React Hook Form + Zod
- Cheerio, Axios, robots-parser, fast-xml-parser
- Recharts, Sonner, Lucide React, pdf-lib

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Compare against the public demo: [https://himat.tech/free-tools/ai-readiness-check](https://himat.tech/free-tools/ai-readiness-check)

### Other scripts

```bash
npm run build   # production build
npm start       # run production server
npm run lint    # ESLint
```

## Environment

Copy `.env.example` to `.env.local` (optional — not required for local scans):

```bash
cp .env.example .env.local
```

## API

### `POST /api/analyze`

Request:

```json
{
  "url": "https://example.com"
}
```

Successful response includes `success`, overall `score`, `categories`, `checks`, `recommendations`, `crawlers`, `schemas`, `platforms`, and a full `report` object.

## Project structure

```
app/                  # App Router pages + API
  api/analyze/        # Analysis endpoint
components/
  charts/             # Score gauge + category chart
  dashboard/          # Score dashboard + skeletons
  forms/              # URL analyzer form
  layout/             # Hero, FAQ, CTA, footer
  reports/            # Audit, recommendations, export, history
  ui/                 # Shared UI primitives
hooks/                # useAnalyze, useScanHistory
lib/
  analyzers/          # Fetch, robots, sitemap, SEO, content, schema, performance
  scoring/            # Weighted scoring engine
  site.ts             # Himat brand & contact config
  export.ts           # JSON summary + PDF generation
types/                # Shared TypeScript types
```

## Scoring weights

| Category            | Weight |
|---------------------|--------|
| Crawlability        | 20%    |
| Sitemap Health      | 15%    |
| Technical SEO       | 20%    |
| Content Quality     | 15%    |
| AI Discoverability  | 15%    |
| Performance Signals | 15%    |

Score levels: **90–100** Excellent · **75–89** Good · **50–74** Needs Improvement · **0–49** Poor

## Contact

Need help optimizing your site for AI search?

- **Email:** [info@himat.co.in](mailto:info@himat.co.in)
- **Call:** [94452 34023](tel:+919445234023)
- **Web:** [himat.co.in](https://himat.co.in)
- **Demo:** [himat.tech free tool](https://himat.tech/free-tools/ai-readiness-check)

## License

See [LICENSE](./LICENSE).

Built with care by **[Himat Technology](https://himat.co.in)**.
