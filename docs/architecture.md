# AIP V2 — System Architecture

## Analytics Intelligence Platform

> **Analyze. Score. Improve.**

---

## 1. Purpose

This document describes the technical architecture of **AIP V2 — Analytics Intelligence Platform**.

AIP is designed to automate the first level of a Digital Analytics audit from a website URL.

The platform analyzes observable technical signals, identifies supported Analytics technologies, interprets the detected architecture, calculates a deterministic audit score, and generates an AI-assisted professional report.

AIP V2 introduces a modular architecture built around several specialized engines.

The fundamental architectural principle is:

> **Deterministic engines establish the evidence. AI transforms that evidence into an actionable audit report.**

This separation ensures that Generative AI does not become responsible for technology detection or audit scoring.

---

# 2. Architecture Overview

The AIP V2 audit pipeline follows this sequence:

```text
                        AIP V2
              Analytics Intelligence Platform

                         USER
                           │
                           ▼
                    Website URL
                           │
                           ▼
                    Audit Interface
                           │
                           ▼
                     /api/agent
                           │
                           ▼
                  API Orchestrator
                           │
                           ▼
                     HTML Fetcher
                           │
                           ▼
                  Detection Engine
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
      Technology Detection         Raw Signals
              │                         │
              └────────────┬────────────┘
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
                  Structured Response
                           │
                           ▼
                    Audit Dashboard
```

Each layer has a specific responsibility.

---

# 3. Architectural Principles

AIP V2 follows several architectural principles.

## 3.1 Separation of Concerns

Each engine is responsible for one specific type of processing.

```text
HTML Fetcher
    │
    └── Retrieve the document

Detection Engine
    │
    └── Establish technical evidence

Knowledge Engine
    │
    └── Interpret relationships and risks

Scoring Engine
    │
    └── Calculate deterministic scores

AI Report Engine
    │
    └── Transform structured findings into a report
```

This prevents a single component from becoming responsible for the entire audit.

---

## 3.2 Evidence Before Interpretation

AIP distinguishes technical evidence from interpretation.

For example:

```text
FACT

Google Tag Manager detected
Container:
GTM-XXXXXXX
```

The Detection Engine establishes this fact.

The Knowledge Engine can then interpret it:

```text
GTM detected
+
GA4 not directly visible
        ↓
GA4 may be configured through GTM
        ↓
Runtime verification recommended
```

The second statement is an interpretation, not a new detection.

---

## 3.3 Deterministic Logic Before AI

Technology detection and scoring do not depend on the AI model.

This provides several advantages:

- reproducibility;
- easier debugging;
- predictable scoring;
- better testability;
- reduced AI hallucination risk;
- clear responsibility boundaries.

The AI receives structured results produced by the application.

---

## 3.4 Explicit Uncertainty

AIP does not assume that an undetected technology is absent.

The platform follows the principle:

> **Not detected does not mean absent.**

This is essential because modern Analytics implementations can depend on:

- JavaScript runtime execution;
- Tag Management Systems;
- consent;
- server-side tracking;
- reverse proxies;
- CDN infrastructure;
- first-party tracking endpoints;
- anti-bot mechanisms.

Therefore:

```text
NOT DETECTED
      ≠
ABSENT
```

---

# 4. Main Components

AIP V2 consists of the following main technical components.

```text
┌──────────────────────────────┐
│        Audit Interface       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          API Route           │
│        /api/agent            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       API Orchestrator       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         HTML Fetcher         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Detection Engine       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Knowledge Engine      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         Scoring Engine       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        AI Report Engine      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Structured Audit       │
└──────────────────────────────┘
```

---

# 5. Audit Interface

The user starts an audit from the dedicated audit interface.

The interface collects at minimum:

```text
URL
Language
```

Example:

```text
URL:
https://example.com

Language:
French
```

The interface sends the request to:

```text
POST /api/agent
```

The UI does not perform Analytics detection itself.

Its responsibility is limited to:

- collecting user input;
- calling the API;
- handling loading states;
- handling errors;
- presenting the audit result.

---

# 6. API Route

The primary application endpoint is:

```text
POST /api/agent
```

The API route acts as the entry point to the audit pipeline.

Example request:

```json
{
  "url": "https://example.com",
  "language": "fr"
}
```

The API delegates the actual audit workflow to the **API Orchestrator**.

This keeps the HTTP layer separate from the business logic.

---

# 7. API Orchestrator

The API Orchestrator coordinates the different engines.

Conceptually:

```text
Request
   │
   ▼
Detection
   │
   ▼
Knowledge
   │
   ▼
Scoring
   │
   ▼
AI Report
   │
   ▼
Response
```

The orchestrator does not contain the detection rules itself.

Its responsibility is to coordinate the execution order and assemble the final result.

This design allows individual engines to evolve independently.

---

# 8. HTML Fetcher

Before any detection can occur, AIP needs access to the HTML returned by the audited website.

AIP V2 uses a centralized HTML Fetcher.

Its responsibilities include:

- sending the HTTP request;
- retrieving HTML;
- following redirects;
- managing request timeout;
- recording HTTP status;
- recording the final URL;
- recording response metadata;
- providing diagnostics when fetching fails.

Conceptual result:

```text
requestedUrl
finalUrl
status
statusText
redirected
contentType
server
html
htmlSize
```

Example diagnostic:

```text
[AIP Fetch]

requestedUrl: https://example.com
finalUrl: https://www.example.com/
status: 200
statusText: OK
contentType: text/html
htmlSize: 185000
```

Centralizing fetching is important because earlier implementations could otherwise create different fetch behaviors across the application.

AIP V2 therefore follows:

```text
ONE FETCHER
    ↓
ALL STATIC HTML ANALYSIS
```

---

# 9. Detection Engine

The Detection Engine is responsible for establishing technical facts.

Its main input is:

```text
HTML
```

Its main output is a structured list of technology detections.

Conceptually:

```text
HTML
 │
 ├── GTM Detector
 ├── GA4 Detector
 ├── Adobe Analytics Detector
 ├── Adobe Launch Detector
 ├── Consent Detectors
 ├── Advertising Detectors
 ├── DataLayer Detector
 └── Other Detectors
 │
 ▼
Structured Technology Results
```

Each detector is independent.

A typical result can contain:

```json
{
  "name": "Google Analytics 4",
  "key": "ga4",
  "vendor": "Google",
  "category": "Analytics",
  "present": true,
  "status": "Détecté directement",
  "ids": [
    "G-XXXXXXXXXX"
  ],
  "evidence": [
    "gtag/js",
    "G-XXXXXXXXXX"
  ],
  "sources": [
    "HTML statique"
  ],
  "certainty": "Élevé"
}
```

The Detection Engine does not generate business recommendations.

It establishes observable technical evidence.

---

# 10. Detection Confidence

AIP supports several confidence levels:

```text
Élevé
Moyen
Faible
```

Confidence allows downstream engines to distinguish strong evidence from weaker signals.

For example:

```text
Measurement ID detected
        ↓
High confidence

Generic keyword detected
        ↓
Potentially weaker confidence
```

The scoring system can require a minimum confidence level before awarding points.

---

# 11. Detection Status

A technology can have a detection status such as:

```text
Détecté directement

Possiblement chargé via GTM

Non détecté
```

This provides more context than a simple Boolean.

The distinction is particularly important for Tag Management architectures.

---

# 12. Raw Signals

The Detection Engine also exposes technical signals extracted from the document.

These can include:

```text
scriptSrcs
headSnippet
inlineScriptSnippet
```

Example:

```json
{
  "rawSignals": {
    "scriptSrcs": [
      "https://www.googletagmanager.com/gtm.js"
    ],
    "headSnippet": "...",
    "inlineScriptSnippet": "..."
  }
}
```

Raw signals are useful for:

- diagnostics;
- debugging;
- audit traceability;
- future detector improvements.

However, AIP maintains an important architectural distinction:

```text
Raw Signal
     ↓
Potential Evidence
     ↓
Detector Validation
     ↓
Structured Detection
```

A raw signal should not automatically become a confirmed technology without appropriate detector logic.

---

# 13. DataLayer Detection

The DataLayer detector performs deeper analysis than a basic script detector.

It can identify:

```text
window.dataLayer
dataLayer.push()
```

It also extracts event and variable information.

Events can be separated into:

```text
GTM Internal Events
        │
        ├── gtm.js
        ├── gtm.dom
        ├── gtm.load
        ├── gtm.click
        └── ...

Business Events
        │
        └── application-specific events
```

The detector can also inspect standard variable families.

```text
Navigation
User
Commerce
E-commerce
Forms
Search
```

This information is later used by the Scoring Engine to evaluate Data Quality.

---

# 14. Knowledge Engine

The Knowledge Engine receives the structured Detection Engine results.

Its responsibility is to identify relationships, risks and implementation patterns.

Conceptually:

```text
Detection Results
       │
       ▼
Knowledge Rules
       │
       ▼
Analytics Insights
```

Example:

```text
GTM = detected
GA4 = not directly detected

        ↓

Insight:

GA4 may be configured through GTM.
Runtime or container verification is recommended.
```

Another example:

```text
Advertising Tool = detected
CMP = not confirmed

        ↓

Insight:

Advertising technologies are present,
but no supported CMP has been confirmed.
```

Knowledge rules are deterministic.

The AI does not create these rules dynamically.

---

# 15. Analytics Insights

Knowledge Engine outputs use structured severities.

Supported levels include:

```text
info
warning
success
critical
```

A typical insight contains:

```json
{
  "key": "gtm-without-visible-ga4",
  "severity": "info",
  "title": "GA4 potentiellement configuré via GTM",
  "description": "Google Tag Manager est détecté, mais aucun Measurement ID GA4 n'est visible dans le HTML statique.",
  "relatedTools": [
    "gtm",
    "ga4"
  ]
}
```

This structured format can be consumed by both the UI and the AI Report Engine.

---

# 16. Scoring Engine

The Scoring Engine converts technical findings into a standardized audit score.

AIP V2 evaluates five categories:

```text
Analytics
Tag Management
Consent
Marketing
Data Quality
```

Each category has a maximum score of:

```text
20 points
```

Therefore:

```text
Analytics       20
Tag Management  20
Consent         20
Marketing       20
Data Quality    20
                ──
Global          100
```

---

# 17. Deterministic Scoring

Scoring rules are deterministic.

Example:

```text
Reliable Analytics tool detected
        ↓
Analytics points awarded
```

A rule can use:

```text
Tool Key
Tool Category
Minimum Confidence
Detection State
```

Example conceptual rule:

```text
Category:
Analytics

Condition:
At least one Analytics technology detected

Minimum certainty:
Moyen

Points:
20
```

This ensures:

```text
Same Evidence
     ↓
Same Rules
     ↓
Same Score
```

The AI cannot arbitrarily change the score.

---

# 18. Data Quality Scoring

Data Quality uses richer information than simple technology presence.

Possible signals include:

```text
DataLayer present
Business events
Standard variables
E-commerce structure
Consent signals
```

This allows AIP to distinguish between:

```text
DataLayer exists
```

and:

```text
DataLayer contains useful measurement structure
```

This is an important evolution beyond simple tag detection.

---

# 19. Global Score

Category scores are aggregated into a normalized global score.

Conceptually:

```text
Total earned points
        ÷
Total available points
        ×
100
```

The final result contains:

```text
globalScore
maxScore
grade
categories
```

Example:

```json
{
  "globalScore": 75,
  "maxScore": 100,
  "grade": "C"
}
```

---

# 20. AI Report Engine

The AI Report Engine is the final intelligence layer.

It receives structured data from:

```text
Detection Engine
Knowledge Engine
Scoring Engine
```

The AI is not asked to rediscover the website architecture from scratch.

Instead, it transforms the structured audit into human-readable recommendations.

The report contains:

```text
Executive Summary
Strengths
Weaknesses
Recommendations
Priority Actions
Technical Analysis
```

---

# 21. AI Grounding

The AI Report Engine follows strict grounding rules.

It must:

- remain factual;
- use the provided audit data;
- avoid inventing technologies;
- avoid inventing identifiers;
- distinguish facts from recommendations;
- respect uncertainty;
- avoid treating undetected technologies as definitively absent.

Conceptually:

```text
Structured Evidence
        ↓
Controlled Prompt
        ↓
AI Interpretation
        ↓
Structured JSON Report
```

Not:

```text
Website
   ↓
AI guesses everything
```

This distinction is central to AIP V2.

---

# 22. Report Validation

The AI response is expected to be valid structured JSON.

Required report properties include:

```text
executiveSummary
strengths
weaknesses
recommendations
priorityActions
technicalAnalysis
```

AIP validates that required fields are present and non-empty.

This prevents incomplete AI responses from silently entering the application.

---

# 23. Language Support

The report engine currently supports:

```text
fr → French
en → English
```

Technical identifiers remain unchanged when translation would reduce accuracy.

Examples:

```text
GTM-XXXXXXX
G-XXXXXXXXXX
Adobe Analytics
dataLayer
Measurement ID
```

---

# 24. End-to-End Audit Flow

A complete audit follows this sequence.

```text
1. User enters URL

              ↓

2. UI sends POST /api/agent

              ↓

3. API validates request

              ↓

4. Orchestrator starts audit

              ↓

5. HTML Fetcher retrieves page

              ↓

6. Detection Engine executes detectors

              ↓

7. Structured technologies are produced

              ↓

8. Knowledge Engine evaluates rules

              ↓

9. Analytics insights are produced

              ↓

10. Scoring Engine calculates category scores

              ↓

11. Global score is calculated

              ↓

12. AI Report Engine receives structured audit data

              ↓

13. AI generates structured report

              ↓

14. Report is validated

              ↓

15. API returns complete audit

              ↓

16. UI displays results
```

---

# 25. Structured Audit Response

Conceptually, the final response contains:

```json
{
  "success": true,
  "url": "https://example.com",
  "generatedAt": "...",
  "executionTime": 12000,

  "detection": {
    "tools": [],
    "rawSignals": {}
  },

  "knowledge": [],

  "scoring": {
    "globalScore": 0,
    "maxScore": 100,
    "grade": "F",
    "categories": []
  },

  "report": {
    "executiveSummary": "...",
    "strengths": [],
    "weaknesses": [],
    "recommendations": [],
    "priorityActions": [],
    "technicalAnalysis": "..."
  }
}
```

This structure keeps technical evidence and AI-generated interpretation separated.

---

# 26. Error Handling

AIP can encounter external errors during the audit.

Examples include:

```text
HTTP 403
HTTP 429
Timeout
DNS failure
Invalid response
Anti-bot protection
```

The HTML Fetcher records diagnostic information when possible.

For example:

```text
requestedUrl
finalUrl
HTTP status
server
contentType
htmlSize
```

A site refusing access is not interpreted as a site without Analytics technologies.

Instead:

```text
FETCH FAILURE
     ↓
AUDIT CANNOT BE COMPLETED
```

This is fundamentally different from:

```text
FETCH SUCCESS
     ↓
NO SUPPORTED TECHNOLOGY CONFIRMED
```

---

# 27. Static Analysis Boundary

AIP V2 primarily operates using static HTML analysis.

The architecture boundary is therefore:

```text
HTTP Response
      ↓
HTML
      ↓
Static Detection
```

AIP V2 does not yet fully execute:

```text
Browser Runtime
JavaScript Lifecycle
Network Monitoring
User Consent Interaction
Runtime Cookies
Runtime DataLayer
```

These capabilities belong to the planned runtime architecture.

---

# 28. Why Static Analysis First?

Static analysis was deliberately selected as the foundation of V2.

Advantages include:

- simpler infrastructure;
- faster execution;
- deterministic inputs;
- easier debugging;
- lower resource usage;
- easier deployment;
- clear evidence extraction;
- easier automated testing.

It also creates a stable base before introducing browser automation.

---

# 29. Known Architectural Limitations

Static analysis introduces known limitations.

## Dynamic Tags

Tags loaded after JavaScript execution may not be visible.

## Consent-Based Loading

Technologies may appear only after consent.

## Tag Manager Configuration

Tags configured inside GTM may not be exposed in the initial HTML.

## Server-Side Tracking

Some tracking can occur without recognizable client-side scripts.

## Anti-Bot Systems

Services such as Cloudflare can refuse automated HTTP requests.

## Unsupported Technologies

AIP only formally detects technologies for which a detector currently exists.

These limitations are documented rather than hidden.

---

# 30. Runtime Architecture — V2.1 Direction

AIP V2.1 is expected to extend the current architecture with browser-based analysis.

Conceptually:

```text
                         URL
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
       Static Fetch              Runtime Browser
             │                         │
             ▼                         ▼
       Static HTML               JavaScript
                                 Network
                                 Cookies
                                 DataLayer
                                 Consent
             │                         │
             └────────────┬────────────┘
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
```

Playwright is one candidate technology for this runtime layer.

The goal is not to replace static analysis.

The objective is to combine:

```text
Static Evidence
      +
Runtime Evidence
      =
Higher Detection Coverage
```

---

# 31. Modularity and Extensibility

AIP is designed so that new detectors can be added without redesigning the entire platform.

Conceptually:

```text
lib/detectors/

gtm.ts
ga4.ts
adobe-analytics.ts
adobe-launch.ts
didomi.ts
onetrust.ts
cookiebot.ts
meta-pixel.ts
datalayer.ts
...
```

A new technology detector should return the common `AnalyticsToolDetection` structure.

This means downstream engines can process new technologies using the same data model.

---

# 32. Why the Architecture Matters

The architecture is designed to prevent AIP from becoming a simple AI wrapper.

A simple implementation could look like:

```text
URL
 ↓
HTML
 ↓
LLM
 ↓
Report
```

This would make:

- detection difficult to validate;
- scoring inconsistent;
- debugging harder;
- hallucinations more dangerous;
- results difficult to reproduce.

AIP instead uses:

```text
URL
 ↓
Evidence Collection
 ↓
Deterministic Detection
 ↓
Deterministic Knowledge Rules
 ↓
Deterministic Scoring
 ↓
Controlled AI Interpretation
 ↓
Audit
```

This architecture provides a stronger foundation for a professional Analytics auditing platform.

---

# 33. Architecture Summary

AIP V2 separates the audit into four main intelligence layers.

```text
DETECTION
"What can be technically confirmed?"

        ↓

KNOWLEDGE
"What does this architecture imply?"

        ↓

SCORING
"How does the observed implementation perform?"

        ↓

AI REPORT
"How can these findings be communicated and prioritized?"
```

Together, these layers transform raw website signals into a structured Digital Analytics audit.

---

# 34. Core Architecture Principle

The central architectural principle of AIP V2 remains:

> **Deterministic engines establish the evidence. AI transforms that evidence into an actionable audit report.**

This principle guides both the current implementation and the future evolution of the platform.

---

## Related Documentation

- [`detection-engine.md`](./detection-engine.md)
- [`knowledge-engine.md`](./knowledge-engine.md)
- [`scoring-engine.md`](./scoring-engine.md)
- [`ai-report-engine.md`](./ai-report-engine.md)
- [`api.md`](./api.md)
- [`testing.md`](./testing.md)
- [`limitations.md`](./limitations.md)
- [`roadmap.md`](./roadmap.md)

---

**AIP — Analytics Intelligence Platform**

**Analyze. Score. Improve.**