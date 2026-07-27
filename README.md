# 🚀 AIP — Analytics Intelligence Platform

> **Automated Digital Analytics Audit & Intelligence Platform**

### Analyze. Score. Improve.

AIP is a Digital Analytics auditing platform designed to analyze a website's analytics ecosystem from a simple URL, identify supported tracking technologies, evaluate implementation maturity, and generate actionable audit recommendations.

The platform combines **deterministic detection and scoring engines** with **Generative AI** to transform technical signals into a structured Digital Analytics audit.

> **Deterministic engines establish the evidence. AI transforms that evidence into an actionable audit report.**

---

# 🌍 Live Application

AIP is deployed on Vercel:

**https://agent-ia-lilac.vercel.app/**

---

# 🎯 Why AIP?

Digital Analytics audits are often time-consuming and fragmented.

During a traditional pre-audit, an analyst may need to:

- inspect the website source code;
- identify Analytics technologies;
- detect Tag Management Systems;
- inspect Consent Management Platforms;
- identify advertising pixels;
- analyze DataLayer implementations;
- evaluate data quality;
- interpret technical findings;
- prioritize issues;
- produce recommendations.

Modern tracking architectures make this even more complex because technologies can be loaded through:

- Google Tag Manager;
- Adobe Experience Platform Launch;
- Consent Management Platforms;
- JavaScript runtime execution;
- server-side tracking;
- reverse proxies;
- CDN infrastructure;
- dynamic consent mechanisms.

AIP was created to automate a significant part of this first audit phase.

---

# 💡 The AIP Solution

AIP transforms a website URL into a structured Digital Analytics audit.

```text
Website URL
     │
     ▼
HTML Fetcher
     │
     ▼
Detection Engine
     │
     ▼
Knowledge Engine
     │
     ▼
Scoring Engine
     │
     ▼
AI Report Engine
     │
     ▼
Structured Digital Analytics Audit
```

Each engine has a clearly defined responsibility.

This architecture prevents the AI layer from becoming responsible for technical detection or scoring.

The Detection Engine establishes technical evidence.

The Knowledge Engine interprets relationships between detected technologies.

The Scoring Engine evaluates the implementation using deterministic rules.

Finally, the AI Report Engine transforms the structured audit data into a professional report.

---

# ✨ Key Features

## 🔍 Technology Detection

AIP analyzes website technical signals to identify supported Digital Analytics, Tag Management, Consent and Marketing technologies.

Current detection capabilities include technologies and signals such as:

### Analytics

- Google Analytics 4
- Adobe Analytics
- Piano Analytics
- Eulerian Analytics

### Tag Management

- Google Tag Manager
- Adobe Experience Platform Launch
- TagCommander

### Consent Management

- Didomi
- OneTrust
- Axeptio
- Cookiebot
- supported generic consent signals

### Advertising & Marketing

- Meta Pixel
- LinkedIn Insight Tag
- TikTok Pixel
- Floodlight

### Data Architecture

- Google DataLayer
- DataLayer events
- standard variables
- e-commerce structures
- consent signals

Each technology detection can contain:

- technology name;
- vendor;
- category;
- detected identifiers;
- technical evidence;
- detection sources;
- confidence level;
- implementation details.

---

# 🧠 Knowledge Engine

Technology detection alone is not enough to perform a Digital Analytics audit.

The **Knowledge Engine** applies deterministic Digital Analytics rules to the results produced by the Detection Engine.

It can identify situations such as:

- GTM detected without directly visible GA4;
- GA4 implemented directly without GTM;
- GTM detected without an identifiable DataLayer;
- multiple Tag Management Systems;
- multiple GTM containers;
- Consent Management Platforms requiring additional verification;
- advertising technologies without an identifiable CMP;
- no supported technology confirmed by static analysis.

Example:

```text
GTM detected
+
GA4 not visible in static HTML
        ↓
Knowledge Engine
        ↓
GA4 may be configured through GTM
        ↓
Runtime verification recommended
```

The objective is to distinguish **technical facts** from **audit interpretation**.

---

# 📊 Scoring Engine

AIP evaluates the observed Digital Analytics implementation across five categories.

| Category | Maximum Score |
|---|---:|
| Analytics | 20 |
| Tag Management | 20 |
| Consent | 20 |
| Marketing | 20 |
| Data Quality | 20 |
| **Global Score** | **100** |

The scoring system is **deterministic and rule-based**.

The AI model does not decide the score.

This means that identical technical evidence produces consistent scoring results.

AIP also assigns a global grade based on the resulting score.

---

# 🗂️ DataLayer Analysis

AIP goes beyond simple technology detection by analyzing available DataLayer signals.

The DataLayer detector can inspect:

- `window.dataLayer`;
- `dataLayer.push()`;
- GTM internal events;
- business events;
- navigation variables;
- user variables;
- commerce variables;
- e-commerce structures;
- form variables;
- search variables;
- consent-related signals.

Example variable categories:

```text
Navigation
├── page_name
├── page_type
├── page_category
├── page_location
└── page_referrer

User
├── user_id
├── user_status
├── login_status
└── customer_type

Commerce
├── currency
├── value
├── transaction_id
└── payment_type

E-commerce
├── ecommerce
├── items
├── item_id
├── item_name
├── quantity
└── price
```

This provides a first level of evaluation of the site's measurement architecture and data quality.

---

# 🤖 AI Report Engine

Once detection, knowledge analysis and scoring are complete, the **AI Report Engine** transforms the structured audit into a professional report.

The report contains:

- Executive Summary
- Strengths
- Weaknesses
- Recommendations
- Priority Actions
- Technical Analysis

Reports can currently be generated in:

- 🇫🇷 French
- 🇬🇧 English

The AI layer receives structured information produced by the previous engines and is instructed to remain grounded in the available evidence.

The AI is not responsible for calculating the score.

---

# ⚠️ Evidence-Based Detection

One of the core principles of AIP is:

> **Not detected does not mean absent.**

Modern Analytics technologies may not be visible in the initial HTML because they can be:

- deployed through a Tag Management System;
- loaded after user consent;
- executed dynamically in the browser;
- implemented server-side;
- routed through reverse proxies;
- loaded through first-party endpoints;
- protected by CDN or anti-bot systems.

AIP therefore distinguishes between:

```text
Technology confirmed
        ≠
Technology not detected
        ≠
Technology confirmed absent
```

When technical evidence is insufficient, AIP recommends additional runtime or manual verification instead of automatically concluding that a technology is absent.

---

# 🏗️ AIP V2 Architecture

AIP V2 introduces a modular architecture where each responsibility is isolated.

```text
                         AIP V2
                Analytics Intelligence Platform

                              │
                              ▼
                       Website URL
                              │
                              ▼
                       HTML Fetcher
                              │
                              ▼
                    Detection Engine
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
      Technology Detection              Raw Signals
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
                     Knowledge Engine
                              │
                              ▼
                      Scoring Engine
                              │
                              ▼
                     AI Report Engine
                              │
                              ▼
                   Structured Audit API
                              │
                              ▼
                       Audit Interface
```

---

# ⚙️ Detection Engine

The Detection Engine is responsible for identifying technologies from observable technical signals.

Each detector is independent and focuses on a specific technology or technical family.

A typical detection result contains:

```json
{
  "name": "Google Analytics 4",
  "key": "ga4",
  "vendor": "Google",
  "category": "Analytics",
  "present": true,
  "status": "Détecté directement",
  "ids": ["G-XXXXXXXXXX"],
  "evidence": ["gtag/js", "G-XXXXXXXXXX"],
  "sources": ["HTML statique"],
  "certainty": "Élevé"
}
```

This structured format allows other engines to consume detection results without performing technology detection themselves.

---

# 🌐 HTML Fetcher

AIP uses a centralized HTML Fetcher before executing the Detection Engine.

Its responsibilities include:

- retrieving website HTML;
- following redirects;
- managing request timeout;
- collecting HTTP status information;
- recording the final URL;
- exposing useful diagnostic information;
- providing the HTML to the Detection Engine.

Centralizing this logic prevents multiple parts of the application from implementing different fetch strategies.

---

# 🔌 API

The main audit endpoint is:

```text
POST /api/agent
```

Example request:

```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "language": "fr"
  }'
```

A successful audit can return:

```json
{
  "success": true,
  "url": "https://example.com",
  "generatedAt": "2026-07-27T00:00:00.000Z",
  "executionTime": 12000,
  "detection": {},
  "scoring": {},
  "report": {}
}
```

The response combines the results of the complete audit pipeline.

---

# 🖥️ Product Interface

AIP V2 introduces a redesigned SaaS-oriented interface.

The landing page presents the platform separately from the audit workflow.

Main product sections include:

```text
Navbar
   │
   ▼
Hero
   │
   ▼
Product / Dashboard Preview
   │
   ▼
Features
   │
   ▼
How It Works
   │
   ▼
Start Audit
```

The audit workflow is accessible through a dedicated audit interface.

---

# 📸 Product Preview

Screenshots of the AIP V2 interface can be added here.

## Landing Page

```text
[ AIP V2 Landing Page Screenshot ]
```

## Audit Dashboard

```text
[ AIP Audit Dashboard Screenshot ]
```

## Detection & Scoring

```text
[ AIP Detection / Scoring Screenshot ]
```

---

# 🧪 Quality Assurance

Before the V2 Release Candidate, AIP was tested against several real-world websites representing different Analytics architectures.

The QA campaign covered scenarios including:

- Google Tag Manager;
- direct Google Analytics 4 implementation;
- Adobe Analytics;
- Consent Management Platforms;
- DataLayer implementations;
- advertising pixels;
- websites with limited detectable signals;
- websites protected by anti-bot infrastructure.

The campaign validated the main V2 pipeline:

```text
HTML Fetch
    ↓
Technology Detection
    ↓
Knowledge Rules
    ↓
Scoring
    ↓
AI Report
```

Representative tests successfully validated detection scenarios involving:

- GTM;
- GA4;
- Adobe Analytics / AppMeasurement;
- Cookiebot;
- Didomi;
- DataLayer;
- Meta Pixel;
- Floodlight.

The QA campaign also helped identify product limitations and future improvements.

---

# ⚠️ Known Limitations

AIP V2 primarily performs **static HTML analysis**.

This provides fast and deterministic analysis but introduces several limitations.

## Dynamic JavaScript

Technologies loaded only after browser-side JavaScript execution may not be visible.

## Consent-Dependent Tracking

Analytics or marketing tags may only load after the user accepts specific consent categories.

## Tag Management Systems

A technology configured inside GTM or another Tag Management System may not appear directly in the initial HTML.

## Server-Side Tracking

Server-side or proxy-based implementations may not expose recognizable client-side signals.

## Anti-Bot Protection

Some websites protected by systems such as Cloudflare may reject automated HTTP requests.

In these situations, AIP can receive responses such as:

```text
HTTP 403 Forbidden
```

This is considered an external access limitation rather than proof that the audited website does not contain Analytics technologies.

## Technology Coverage

AIP can only formally detect technologies currently supported by its Detection Engine.

Additional technologies and CMPs will progressively be added.

---

# 🛠️ Tech Stack

AIP is currently built with:

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Lucide React
- React Circular Progressbar

### Backend / Application

- Next.js API Routes
- TypeScript
- Node.js

### Artificial Intelligence

- OpenAI API

### Architecture

- Modular Detection Engine
- Rule-Based Knowledge Engine
- Deterministic Scoring Engine
- AI Report Engine

### Development & Deployment

- Git
- GitHub
- Vercel

---

# 📂 Project Structure

A simplified representation of the AIP V2 project:

```text
agent-ia/
│
├── app/
│   ├── api/
│   │   └── agent/
│   │
│   ├── audit/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── home/
│   └── layout/
│
├── lib/
│   ├── detectors/
│   ├── knowledge/
│   ├── scoring/
│   ├── report/
│   ├── orchestrator/
│   ├── ai/
│   ├── html-fetcher.ts
│   └── types.ts
│
├── docs/
│
├── public/
│
├── package.json
└── README.md
```

---

# 🚀 Local Development

## 1. Clone the repository

```bash
git clone https://github.com/Bricegoye/agent-ia.git
```

```bash
cd agent-ia
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create:

```text
.env.local
```

Add the required environment variables.

Example:

```env
OPENAI_API_KEY=your_openai_api_key
```

Never commit API keys or secrets to GitHub.

---

## 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The audit interface is available at:

```text
http://localhost:3000/audit
```

---

## 5. Production build

Before deployment:

```bash
npm run build
```

A successful build validates the Next.js production compilation and TypeScript checks.

---

# 🧬 Project Evolution

AIP started as a simple experiment around automated Digital Analytics auditing.

The architecture has progressively evolved from a proof of concept into a modular Analytics Intelligence Platform.

---

## ✅ V1 — Proof of Concept

The first version validated the core idea:

```text
URL
 ↓
HTML
 ↓
Basic Detection
 ↓
OpenAI
 ↓
Audit
```

V1 introduced:

- URL analysis;
- HTML fetching;
- initial Analytics technology detection;
- OpenAI-generated audit;
- Next.js interface;
- Vercel deployment.

The objective of V1 was primarily to validate the product concept.

---

## ✅ V2 — Analytics Intelligence Engine

V2 represents a major architectural evolution.

Instead of sending basic website information directly to an AI model, AIP now uses several specialized engines.

```text
Detection
    ↓
Knowledge
    ↓
Scoring
    ↓
AI Reporting
```

V2 introduces:

- modular technology detectors;
- structured detection results;
- confidence levels;
- technical evidence;
- Knowledge Engine;
- deterministic scoring;
- advanced DataLayer analysis;
- Analytics / Tag Management / Consent / Marketing categories;
- AI Report Engine;
- French and English reports;
- centralized HTML Fetcher;
- improved error diagnostics;
- dedicated audit interface;
- redesigned SaaS landing page;
- real-world QA campaign.

---

# 🔮 Roadmap

## 🔜 V2.1 — Runtime Detection & UI Refinements

The next iteration will focus on increasing detection coverage and improving the user experience.

Planned areas include:

### Runtime Analysis

- Playwright integration;
- browser-based analysis;
- JavaScript runtime inspection;
- network request analysis;
- runtime DataLayer inspection;
- dynamically loaded tag detection;
- consent-dependent tag analysis.

### Detection Coverage

Additional support may include:

- TarteAuCitron;
- Real Cookie Banner;
- additional CMPs;
- enhanced Matomo detection;
- additional Analytics and Marketing technologies.

### DataLayer Intelligence

- richer event classification;
- business event analysis;
- e-commerce validation;
- variable coverage;
- data quality diagnostics.

### UI / UX

- responsive improvements;
- mobile optimization;
- audit experience refinements;
- clearer error and limitation messages.

---

## 🔮 V3 — Advanced Audit & Reporting

Future product capabilities may include:

- audit history;
- audit comparison;
- advanced Analytics maturity scoring;
- PDF report generation;
- PowerPoint export;
- tagging plan generation;
- advanced recommendations;
- project / client audit management;
- extended governance analysis.

---

# 🌟 Long-Term Vision

The long-term objective of AIP is to allow a Digital Analytics professional to enter:

```text
https://www.client.com
```

and obtain a structured audit containing:

```text
Technology Detection
        +
Analytics Architecture
        +
Tag Management
        +
Consent
        +
Marketing Pixels
        +
DataLayer Quality
        +
Analytics Maturity Score
        +
Prioritized Recommendations
        +
Professional Audit Report
```

The objective is not to replace the Digital Analytics consultant.

The objective is to automate repetitive technical pre-audit tasks so that analysts and consultants can spend more time on:

- architecture;
- measurement strategy;
- data quality;
- governance;
- business requirements;
- optimization.

---

# 💡 Engineering Philosophy

AIP follows several principles.

### Evidence before assumptions

Technical conclusions should be supported by observable evidence.

### Deterministic logic before AI interpretation

Detection and scoring should remain predictable and testable.

### AI as an intelligence layer

Generative AI is used to interpret structured findings and communicate them effectively, not to replace the technical detection engines.

### Explicit uncertainty

When AIP cannot prove something, the platform should communicate uncertainty rather than invent a conclusion.

### Modular architecture

Each engine should remain independently maintainable and extensible.

---

# 📚 Documentation

Detailed technical documentation is maintained in the `/docs` directory.

Planned documentation includes:

```text
docs/
│
├── architecture.md
├── detection-engine.md
├── knowledge-engine.md
├── scoring-engine.md
├── ai-report-engine.md
├── api.md
├── testing.md
├── limitations.md
└── roadmap.md
```

The README provides the product and architecture overview, while `/docs` contains deeper technical documentation.

---

# 📌 Project Status

```text
AIP V1                     ✅ Completed

AIP V2
├── Detection Engine       ✅
├── Knowledge Engine       ✅
├── Scoring Engine         ✅
├── AI Report Engine       ✅
├── Audit API              ✅
├── Landing Page           ✅
├── Audit Interface        ✅
├── QA Campaign            ✅
└── Release Candidate      ✅

AIP V2.1                   🔜 Planned
```

---

# 👨‍💻 Author

**Brice Goye**

**Senior Digital Analytics & AI/Data Solutions Engineer**

AIP is a personal engineering project exploring the intersection of:

- Digital Analytics;
- Analytics engineering;
- automated auditing;
- rule-based systems;
- data quality;
- Generative AI;
- modern web application development.

The project was designed both as a practical Digital Analytics tool and as an exploration of how deterministic analytics engineering can be combined with Generative AI.

---

# 📄 License

MIT