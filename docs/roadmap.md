# AIP — Product & Technical Roadmap

## Analytics Intelligence Platform

> **From static Digital Analytics pre-audit to automated Analytics QA & Intelligence.**

---

# 1. Purpose

This document defines the product and technical evolution of **Analytics Intelligence Platform (AIP)** after the V2 architecture redesign.

The roadmap is based on capabilities already implemented, limitations identified during development, and the long-term vision of the platform.

The objective is not to accumulate features.

The objective is to progressively increase:

```text
Observation depth
+
Audit reliability
+
Automation
+
User experience
+
Professional usability
```

while preserving the core AIP principle:

> **Never claim more than the available technical evidence can support.**

---

# 2. Product Vision

AIP started from a simple idea:

```text
URL
 ↓
Analytics Detection
 ↓
AI Audit
```

The long-term ambition is broader:

```text
Website / Application
        ↓
Static Analysis
        +
Runtime Analysis
        +
Network Analysis
        +
Consent Analysis
        +
DataLayer Analysis
        +
Journey Testing
        ↓
Analytics Intelligence Engine
        ↓
Scoring
        ↓
Recommendations
        ↓
Continuous QA
```

AIP should progressively evolve from an audit tool into an **Analytics Quality Assurance and Intelligence Platform**.

---

# 3. Evolution Overview

The current direction is:

```text
AIP V1
Prototype
   ↓
AIP V2
Analytics Intelligence Engine
   ↓
AIP V2.1
UX & Stabilization
   ↓
AIP V3
Runtime Analytics Engine
   ↓
AIP V3.x
Advanced Audit & Journey Analysis
   ↓
AIP V4
SaaS Platform
   ↓
Long-Term
Continuous Analytics QA & Intelligence
```

---

# 4. AIP V1 — Prototype

## Status

```text
COMPLETED
```

V1 validated the initial product concept.

The main objective was to prove that AIP could:

```text
Receive a URL

Retrieve HTML

Detect Analytics technologies

Use AI to generate an audit

Expose the result through a web application
```

---

# 5. V1 Capabilities

V1 introduced:

```text
Next.js application

URL analysis

HTML retrieval

Basic Analytics detection

OpenAI integration

Initial audit generation

Vercel deployment
```

Supported technologies included early detection of tools such as:

```text
Google Tag Manager

Google Analytics 4

Adobe Analytics

Piano Analytics

Eulerian Analytics
```

---

# 6. V1 Architectural Limitation

The V1 architecture mixed several responsibilities.

Conceptually:

```text
Fetch
+
Detection
+
Business interpretation
+
AI
```

were too tightly coupled.

This made future extension increasingly difficult.

V2 was therefore designed as an architectural redesign rather than a simple feature update.

---

# 7. AIP V2 — Analytics Intelligence Engine

## Status

```text
RELEASE CANDIDATE
```

V2 introduces the first structured architecture of AIP.

The core pipeline becomes:

```text
URL
 ↓
Detection Engine
 ↓
Knowledge Engine
 ↓
Scoring Engine
 ↓
AI Report Engine
 ↓
Structured Audit
```

This architecture is the foundation for future versions.

---

# 8. V2 Main Objective

The main V2 objective is:

> Transform AIP from an AI-powered prototype into a modular and explainable Digital Analytics audit engine.

The platform should separate:

```text
Observation

Interpretation

Evaluation

Communication
```

---

# 9. V2 Detection Engine

The Detection Engine identifies supported technologies from observable technical evidence.

The detector architecture is modular.

Supported or targeted detector families include:

```text
Analytics

Tag Management

Consent

Marketing Pixels

DataLayer
```

Examples include:

```text
Google Tag Manager

Google Analytics 4

Adobe Analytics

Adobe Experience Platform Launch

Piano Analytics

Eulerian

Didomi

OneTrust

Axeptio

Cookiebot

Meta Pixel

LinkedIn Insight Tag

TikTok Pixel

TagCommander
```

Coverage depends on the current detector implementation.

---

# 10. V2 Detection Evidence

V2 improves detection quality by introducing structured evidence.

A detector can expose:

```text
present

ids

evidence

certainty
```

This enables downstream engines to reason from technical observations rather than generic assumptions.

---

# 11. V2 Knowledge Engine

The Knowledge Engine introduces deterministic Digital Analytics expertise.

Example:

```text
GTM detected
+
GA4 not directly visible
        ↓
GA4 may be deployed through GTM.
```

Another example:

```text
GTM
+
Adobe Launch
        ↓
Multiple Tag Management Systems detected.
```

This separates:

```text
Technical detection
```

from:

```text
Analytics interpretation
```

---

# 12. V2 Scoring Engine

V2 introduces an Analytics maturity score based on observable evidence.

The global score is:

```text
0 → 100
```

with five categories:

```text
Analytics

Tag Management

Consent

Marketing

Data Quality
```

Each category contributes up to:

```text
20 points
```

---

# 13. V2 Data Quality

Data Quality is a major V2 improvement.

The platform can evaluate signals such as:

```text
DataLayer presence

Business events

Standard variables

E-commerce structures

Consent signals
```

The objective is to distinguish:

```text
Technical DataLayer presence
```

from:

```text
Structured business measurement
```

---

# 14. V2 AI Report Engine

The AI is no longer responsible for discovering Analytics facts.

Instead:

```text
Detection Engine
      ↓
Facts

Knowledge Engine
      ↓
Interpretation

Scoring Engine
      ↓
Evaluation

AI Report Engine
      ↓
Communication
```

The AI receives structured audit data and generates:

```text
Executive Summary

Strengths

Weaknesses

Recommendations

Priority Actions

Technical Analysis
```

---

# 15. V2 AI Guardrails

The report engine is designed to reduce hallucinations.

Important principles include:

```text
Do not invent technologies

Do not invent IDs

Do not modify deterministic scores

Do not interpret "not detected" as "absent"

Preserve uncertainty

Return structured JSON
```

---

# 16. V2 API Architecture

V2 introduces an orchestration layer.

```text
POST /api/agent
       ↓
API Orchestrator
       ↓
Detection
       ↓
Knowledge
       ↓
Scoring
       ↓
AI Report
```

The API route remains separate from business logic.

---

# 17. V2 Product UX

The product interface is separated into two major experiences.

## Product Presentation

```text
Navbar

Hero

Dashboard Preview

Features

How It Works
```

## Audit Experience

```text
/audit
```

This avoids mixing product marketing and URL analysis in the same Hero interface.

---

# 18. V2 Brand Direction

The product identity is:

```text
AIP
Analytics Intelligence Platform
```

with the positioning:

> **Analyze. Score. Improve.**

The visual direction follows a modern Analytics SaaS approach.

---

# 19. V2 Release Candidate

Before final release, V2 enters a stabilization phase.

The objective is no longer to add features.

The objective is to verify:

```text
Reliability

Consistency

Documentation

Deployment readiness
```

---

# 20. V2 Non-Regression Campaign

The Release Candidate should be validated against representative website profiles.

```text
GTM / GA4

Adobe

CMP / Didomi

Rich DataLayer

Low Signal

Fetch Failure
```

The objective is to expose regressions across different Analytics architectures.

---

# 21. V2 Release Gate

V2 can be released when:

```text
npm run build passes

Core API works

Representative tests pass

No unresolved P0 exists

No serious unresolved P1 exists

Known limitations are documented

Technical documentation is complete

Production deployment succeeds
```

---

# 22. V2 Known Boundary

The primary technical boundary of V2 is:

```text
STATIC HTML ANALYSIS
```

AIP can analyze observable HTML signals but does not yet execute the complete browser lifecycle.

This means some technologies can remain invisible.

---

# 23. V2 Release Scope

V2 should remain focused.

The Release Candidate should not introduce major new capabilities such as:

```text
Playwright

Authentication

Billing

PDF generation

Audit history

Large scoring redesign

Multi-page crawling
```

These belong to later releases.

---

# 24. AIP V2.1 — UX & Stabilization

## Objective

```text
Polish the V2 product
without redesigning the core engines.
```

V2.1 is primarily a product quality release.

---

# 25. V2.1 Responsive Design

Advanced responsive refinement is intentionally postponed from V2.

V2.1 should improve:

```text
Mobile layout

Tablet layout

Navbar behavior

Hero responsiveness

Dashboard Preview scaling

Audit form layout

Result cards

Spacing

Typography
```

---

# 26. V2.1 UX Refinement

Potential improvements include:

```text
Better loading experience

Audit progress feedback

Clearer error states

Improved score explanation

Better recommendation hierarchy

Improved evidence display

Better empty states
```

---

# 27. Audit Progress

Instead of a generic loading indicator, AIP could progressively display:

```text
Fetching website...

Detecting technologies...

Evaluating Analytics architecture...

Calculating score...

Generating recommendations...
```

This would make longer audits feel more transparent.

---

# 28. V2.1 Error UX

Fetch failures should become understandable product states.

Example:

```text
We could not access this website.

The site may block automated requests
or require browser execution.
```

Technical details can remain available when useful.

---

# 29. V2.1 Score Explanation

Users should be able to understand:

```text
Why did I get this score?
```

Possible UX:

```text
Analytics       18 / 20
Tag Management  20 / 20
Consent         12 / 20
Marketing       10 / 20
Data Quality    15 / 20
```

with evidence explaining each category.

---

# 30. V2.1 Evidence UX

A future audit result could expose:

```text
Detected

Evidence

Confidence

Impact
```

for each technology.

This reinforces AIP's explainability.

---

# 31. V2.1 Testing Automation

V2.1 can begin introducing automated regression tests.

Priority:

```text
Detector fixtures

Knowledge rules

Scoring rules

API contract
```

This reduces dependence on manual real-world testing.

---

# 32. V2.1 HTML Fixtures

Introduce controlled HTML fixtures.

Example:

```text
tests/
└── fixtures/
    ├── ga4-direct.html
    ├── gtm.html
    ├── adobe.html
    ├── didomi.html
    ├── datalayer-rich.html
    └── no-signals.html
```

These fixtures provide deterministic regression inputs.

---

# 33. V2.1 Security Hardening

Before broader public exposure, strengthen:

```text
URL validation

SSRF protection

Private network blocking

Timeout handling

Request limits

Input validation
```

---

# 34. V2.1 Observability

Improve backend diagnostics.

Possible metrics:

```text
Fetch duration

Detection duration

Knowledge duration

Scoring duration

AI duration

Total execution time
```

This will help prepare the runtime architecture.

---

# 35. V2.1 Code Quality

Potential improvements:

```text
Unit tests

Schema validation

Centralized errors

Structured logging

Shared constants

Detector test coverage

Prompt versioning
```

V2.1 should strengthen the existing architecture rather than add major complexity.

---

# 36. AIP V3 — Runtime Analytics Engine

## Strategic Objective

V3 addresses the largest V2 limitation:

```text
STATIC VISIBILITY
```

by introducing:

```text
BROWSER RUNTIME VISIBILITY
```

---

# 37. Runtime Architecture

Conceptually:

```text
URL
 │
 ├───────────────┐
 │               │
 ▼               ▼
Static Engine   Runtime Engine
 │               │
 │               ▼
 │           Browser Evidence
 │               │
 └───────┬───────┘
         ▼
   Unified Evidence
         ↓
   Knowledge Engine
         ↓
   Scoring Engine
         ↓
   AI Report
```

Static analysis should remain available.

Runtime analysis complements it.

---

# 38. Playwright

A candidate runtime technology is:

```text
Playwright
```

The browser engine could:

```text
Open the page

Execute JavaScript

Observe network requests

Inspect cookies

Inspect DataLayer

Interact with consent

Observe SPA navigation
```

---

# 39. Runtime DOM

V3 should inspect the rendered DOM after JavaScript execution.

This allows detection of scripts injected dynamically after initial page load.

---

# 40. Runtime Network

Network monitoring is one of the most important V3 capabilities.

AIP could observe requests to:

```text
Google Analytics

Adobe Analytics

Meta

TikTok

LinkedIn

Piano

Eulerian

Custom collection endpoints
```

This moves AIP from:

```text
Code appears present
```

toward:

```text
Tracking request actually observed
```

---

# 41. Network Evidence

Future evidence could include:

```json
{
  "vendor": "Google Analytics",
  "endpoint": "/g/collect",
  "requestObserved": true
}
```

This provides much stronger evidence than static code alone.

---

# 42. Runtime DataLayer

V3 should inspect:

```js
window.dataLayer
```

after page execution.

This enables analysis of:

```text
Runtime events

Variables

Consent state

E-commerce objects

Tag Manager lifecycle
```

---

# 43. Runtime Data Quality

Runtime analysis allows AIP to better distinguish:

```text
Empty DataLayer
```

from:

```text
Rich event architecture
```

and:

```text
Static declarations
```

from:

```text
Actual event activity
```

---

# 44. Cookie Analysis

V3 could inspect browser cookies.

Examples:

```text
_ga

_ga_*

_fbp

Adobe cookies

CMP cookies
```

This provides additional evidence of active technologies.

---

# 45. Consent Runtime

V3 should begin evaluating consent behavior.

Potential flow:

```text
Page Load
   ↓
Observe default state
   ↓
Observe requests
   ↓
Accept consent
   ↓
Observe updated state
   ↓
Compare requests
```

This enables much deeper consent QA.

---

# 46. Consent Before Interaction

AIP could inspect:

```text
Which Analytics requests fire before consent?
```

This is more meaningful than simply detecting a CMP script.

---

# 47. Consent After Interaction

After consent interaction, AIP could compare:

```text
Before Consent
```

and:

```text
After Consent
```

to identify behavioral differences.

---

# 48. Consent Mode Runtime

Runtime inspection can improve visibility into:

```text
analytics_storage

ad_storage

ad_user_data

ad_personalization
```

and their updates during the page lifecycle.

---

# 49. SPA Detection

V3 should support Single Page Applications more effectively.

The browser engine could observe:

```text
History API changes

Router navigation

Virtual pageviews

DataLayer pushes

Analytics requests
```

without requiring a full page reload.

---

# 50. Runtime Confidence

The Detection Engine may eventually combine evidence levels.

Example:

```text
Static script detected
+
Runtime request observed
+
Cookie observed
        ↓
Very strong evidence
```

This could improve certainty modeling.

---

# 51. Static vs Runtime Comparison

AIP could expose differences such as:

```text
STATIC

GTM detected
GA4 not visible

RUNTIME

GTM detected
GA4 request observed
```

This would make the audit significantly more informative.

---

# 52. Runtime Performance

Browser audits are more expensive than static audits.

They require:

```text
Browser startup

JavaScript execution

Page resources

Network monitoring

Interaction time
```

Therefore V3 must introduce stronger resource controls.

---

# 53. Runtime Timeouts

Browser execution should have explicit limits.

Potential controls:

```text
Navigation timeout

Maximum audit duration

Maximum requests

Maximum redirects

Maximum browser memory
```

---

# 54. Browser Infrastructure

Runtime analysis may eventually require dedicated infrastructure rather than relying exclusively on standard serverless functions.

Possible architecture:

```text
Frontend
   ↓
Audit API
   ↓
Job Queue
   ↓
Browser Worker
   ↓
Audit Result
```

This may become necessary as runtime complexity increases.

---

# 55. AIP V3.x — Advanced Audit

Once runtime analysis is stable, AIP can expand beyond single-page inspection.

The next step is:

```text
PAGE AUDIT
      ↓
SITE / JOURNEY AUDIT
```

---

# 56. Multi-Page Audit

AIP could analyze several pages from the same website.

Example:

```text
Homepage

Listing

Product

Search

Cart

Checkout

Confirmation
```

This provides a much more representative view of the Analytics implementation.

---

# 57. Site Architecture Comparison

AIP could compare technologies across pages.

Example:

```text
Homepage
GTM + GA4

Checkout
Adobe Launch + Adobe Analytics
```

This could reveal fragmented tracking architectures.

---

# 58. Automated Page Discovery

A future crawler could identify important pages automatically.

Possible sources:

```text
Internal links

Sitemap

Navigation

Structured data
```

Page selection should remain controlled to avoid excessive crawling.

---

# 59. Journey Testing

AIP could execute predefined user journeys.

Example:

```text
Open product
     ↓
Add to cart
     ↓
Open cart
     ↓
Checkout
     ↓
Purchase
```

At each stage, AIP could inspect Analytics events.

---

# 60. Event QA

Journey testing could validate events such as:

```text
view_item

add_to_cart

view_cart

begin_checkout

purchase
```

AIP could verify:

```text
Event presence

Parameters

Sequence

Duplicates

Missing events
```

---

# 61. Measurement Plan Validation

A future user could provide a measurement specification.

Example:

```text
Expected event:
purchase

Expected parameters:
transaction_id
value
currency
items
```

AIP could compare:

```text
EXPECTED
```

against:

```text
OBSERVED
```

---

# 62. Tagging Plan QA

This opens a major future capability:

```text
Tagging Plan
      ↓
AIP Runtime Audit
      ↓
Implementation Comparison
      ↓
QA Report
```

This would move AIP beyond discovery into implementation validation.

---

# 63. Duplicate Event Detection

Runtime analysis could identify:

```text
Duplicate pageviews

Duplicate purchases

Multiple identical pixel calls

Repeated DataLayer events
```

These are common Digital Analytics quality problems.

---

# 64. Missing Parameter Detection

AIP could detect situations such as:

```text
purchase event observed
```

but:

```text
transaction_id missing
```

or:

```text
currency missing
```

This provides actionable QA findings.

---

# 65. Cross-Domain Analysis

Advanced audits could evaluate tracking across multiple domains.

Example:

```text
www.example.com
      ↓
booking.partner.com
      ↓
payment.example-pay.com
```

Potential checks:

```text
Cross-domain configuration

Session continuity

Measurement IDs

Referral issues
```

---

# 66. Server-Side Intelligence

Future runtime/network analysis may help identify server-side architectures.

Possible signals:

```text
First-party collection endpoints

Custom tracking subdomains

Proxy patterns

Server container routes
```

The system should remain cautious when vendor identification is uncertain.

---

# 67. Advanced Scoring

Once runtime evidence exists, the scoring model can evolve.

Potential dimensions:

```text
Implementation Quality

Consent Quality

DataLayer Quality

Event Coverage

E-commerce Quality

Tracking Reliability

Governance
```

The V2 score should remain versioned rather than silently changing meaning.

---

# 68. Score Versioning

Future reports could include:

```json
{
  "scoreVersion": "3.0"
}
```

This makes historical comparisons more reliable.

---

# 69. AIP V4 — SaaS Platform

Once the audit engine is mature, AIP can evolve into a full SaaS product.

The focus changes from:

```text
Can AIP perform the audit?
```

to:

```text
Can organizations use AIP continuously?
```

---

# 70. User Authentication

V4 could introduce:

```text
Account creation

Login

Passwordless authentication

OAuth
```

Users could access their own audit workspace.

---

# 71. Audit History

Audits could be persisted.

Example:

```text
Project
  │
  ├── Audit — January
  ├── Audit — February
  └── Audit — March
```

This enables historical comparison.

---

# 72. Audit Comparison

AIP could answer:

```text
What changed since the previous audit?
```

Example:

```text
GA4 added

CMP changed

DataLayer improved

Meta Pixel removed

Score increased from 62 to 78
```

---

# 73. Projects

Users could organize audits by project.

Example:

```text
Project: Client A

Domains:
www.client-a.com
shop.client-a.com
account.client-a.com
```

---

# 74. Organizations

Enterprise users may require:

```text
Organizations

Teams

Roles

Permissions

Shared projects
```

This would support agency and consulting use cases.

---

# 75. Audit Quotas

SaaS plans could control:

```text
Static audits

Runtime audits

Multi-page audits

AI reports

Exports
```

Runtime audits will likely be more expensive than static audits.

---

# 76. PDF Reports

AIP could generate professional PDF reports.

Potential sections:

```text
Executive Summary

Analytics Score

Technology Stack

Category Analysis

Risks

Recommendations

Priority Actions

Technical Evidence
```

---

# 77. PowerPoint Reports

Consulting-oriented exports could generate presentation-ready PowerPoint decks.

Potential structure:

```text
Audit Overview

Executive Score

Analytics Architecture

Consent

Data Quality

Key Findings

Recommendations

Roadmap
```

This could significantly reduce consultant reporting time.

---

# 78. White-Label Reports

A future professional plan could support:

```text
Client logo

Consulting company logo

Custom colors

Custom report title

Custom footer
```

This would make AIP useful for agencies and independent consultants.

---

# 79. Sharing

Audits could be shared using secure links.

Example:

```text
Audit
 ↓
Share
 ↓
Read-only Client View
```

---

# 80. API Access

A mature AIP platform could expose a public API.

Example:

```text
POST /api/v1/audits

GET /api/v1/audits/:id
```

This would allow integration with external QA and deployment workflows.

---

# 81. Webhooks

Future integrations could notify external systems when an audit completes.

Examples:

```text
Slack

Microsoft Teams

Jira

n8n

Custom webhook
```

---

# 82. CI/CD Integration

Long term, AIP could become part of deployment pipelines.

Example:

```text
Website Deployment
       ↓
AIP QA
       ↓
Analytics Regression Check
       ↓
PASS / FAIL
```

This represents a major evolution from manual audit toward automated Analytics QA.

---

# 83. Scheduled Audits

Projects could run automatically.

Example:

```text
Daily

Weekly

After deployment
```

AIP could detect regressions without waiting for a manual audit.

---

# 84. Regression Alerts

Example:

```text
Yesterday:
GA4 detected

Today:
GA4 no longer detected
```

AIP could generate:

```text
ALERT
Analytics implementation changed.
```

---

# 85. Continuous Analytics Monitoring

This creates the foundation for:

```text
Continuous Analytics QA
```

rather than one-time audits.

The platform could continuously monitor:

```text
Tags

Events

Consent

DataLayer

Network requests

Scores
```

---

# 86. Long-Term Vision

The long-term evolution is:

```text
PRE-AUDIT TOOL
      ↓
ANALYTICS AUDITOR
      ↓
RUNTIME QA ENGINE
      ↓
MEASUREMENT VALIDATION PLATFORM
      ↓
CONTINUOUS ANALYTICS INTELLIGENCE
```

---

# 87. Analytics Intelligence Layer

Over time, AIP could build deeper Analytics knowledge around:

```text
Technology architecture

Implementation quality

Measurement design

Consent

E-commerce

Marketing pixels

DataLayer governance

Runtime behavior

Historical changes
```

The objective is not merely technology detection.

It is technical interpretation.

---

# 88. Consultant Use Case

For Digital Analytics consultants, AIP could automate:

```text
Pre-audit discovery

Technology mapping

Initial scoring

Evidence collection

Recommendations

QA

Report preparation

Regression checks
```

This allows consultants to spend more time on:

```text
Strategy

Business requirements

Measurement design

Stakeholder alignment

Advanced analysis
```

---

# 89. Enterprise Use Case

For organizations, AIP could become a monitoring layer across multiple websites.

Example:

```text
Global Organization
       ↓
20 Websites
       ↓
AIP Monitoring
       ↓
Analytics Quality Dashboard
```

---

# 90. Agency Use Case

Agencies could manage multiple clients.

Example:

```text
Agency
 │
 ├── Client A
 │    ├── Website
 │    └── App
 │
 ├── Client B
 │
 └── Client C
```

AIP could provide standardized Analytics QA across the portfolio.

---

# 91. Analytics Governance

Long-term AIP could contribute to governance.

Potential checks:

```text
Naming conventions

Measurement ID consistency

Tag duplication

Event taxonomy

DataLayer conventions

Consent standards

Tracking architecture
```

---

# 92. AI Evolution

AI capabilities can evolve alongside deterministic engines.

The principle should remain:

```text
Deterministic engines
       ↓
Facts
       ↓
AI
       ↓
Explanation and assistance
```

AI should augment technical evidence rather than replace it.

---

# 93. Future AI Capabilities

Potential future capabilities include:

```text
Audit comparison summaries

Automatic remediation guidance

Tagging plan generation

Measurement plan suggestions

Executive summaries

Technical implementation guidance
```

Each should remain grounded in structured evidence.

---

# 94. Predictive Capabilities

Predictive Analytics is not required for the immediate AIP roadmap.

The platform should first establish strong:

```text
Observation

Detection

QA

Historical data
```

before attempting predictive models.

Historical audit data could eventually enable more advanced intelligence.

---

# 95. Architecture Principle

Each future capability should preserve modularity.

```text
Fetcher

Static Engine

Runtime Engine

Detection Engine

Knowledge Engine

Scoring Engine

AI Report Engine

Export Engine

Persistence Layer
```

This avoids returning to a monolithic architecture.

---

# 96. Product Principle

AIP should avoid adding features merely because they are technically interesting.

Each major feature should answer one of these questions:

```text
Does it improve detection?

Does it improve audit reliability?

Does it save analyst time?

Does it improve explainability?

Does it improve QA?

Does it improve client usability?
```

If not, it should not be a priority.

---

# 97. Roadmap Priorities

The current priority order is:

```text
1. Stabilize V2

2. Release V2

3. Polish UX in V2.1

4. Strengthen automated testing

5. Introduce runtime analysis

6. Add multi-page / journey QA

7. Add persistence and SaaS features

8. Introduce continuous monitoring
```

---

# 98. What Comes Next

Immediately after the V2 Release Candidate:

```text
Non-Regression Validation
        ↓
Documentation Completion
        ↓
Production Deployment
        ↓
V2 Release
```

Then:

```text
V2.1
UX + Responsive + Stabilization
```

Only after the V2 baseline is stable should the project move toward:

```text
V3 Runtime Engine
```

---

# 99. Strategic Milestones

The roadmap can be summarized through five major milestones.

## Milestone 1

```text
AIP can understand static Analytics evidence.
```

→ V2

## Milestone 2

```text
AIP can observe what happens in the browser.
```

→ V3

## Milestone 3

```text
AIP can validate complete user journeys.
```

→ V3.x

## Milestone 4

```text
AIP can manage audits over time.
```

→ V4

## Milestone 5

```text
AIP can continuously detect Analytics regressions.
```

→ Long-Term Platform

---

# 100. Final Vision

The final ambition of Analytics Intelligence Platform is not simply:

```text
"Tell me which Analytics tools are installed."
```

It is:

```text
"Tell me how this measurement architecture works,
what is working,
what is missing,
what changed,
what should be improved,
and whether the implementation remains healthy over time."
```

The evolution is therefore:

```text
DETECTION
    ↓
UNDERSTANDING
    ↓
SCORING
    ↓
QA
    ↓
MONITORING
    ↓
INTELLIGENCE
```

---

# 101. Roadmap Summary

```text
┌───────────────────────────────────────────────┐
│ AIP V2                                        │
│ Static Analytics Intelligence Engine          │
│ Detection + Knowledge + Scoring + AI          │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ AIP V2.1                                      │
│ UX + Responsive + Testing + Hardening         │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ AIP V3                                        │
│ Runtime Browser Analytics Engine              │
│ Network + Cookies + DataLayer + Consent       │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ AIP V3.x                                      │
│ Multi-Page + Journey + Event QA               │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ AIP V4                                        │
│ SaaS Platform                                 │
│ History + Projects + Reports + Teams          │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ LONG-TERM                                     │
│ Continuous Analytics QA & Intelligence        │
└───────────────────────────────────────────────┘
```

---

# 102. Final Principle

AIP should evolve progressively without sacrificing the foundation established in V2:

> **Observe first. Interpret second. Score deterministically. Use AI to explain.**

And above all:

> **Analyze. Score. Improve.**

---

# Related Documentation

- [`architecture.md`](./architecture.md)
- [`detection-engine.md`](./detection-engine.md)
- [`knowledge-engine.md`](./knowledge-engine.md)
- [`scoring-engine.md`](./scoring-engine.md)
- [`ai-report-engine.md`](./ai-report-engine.md)
- [`api.md`](./api.md)
- [`testing.md`](./testing.md)
- [`limitations.md`](./limitations.md)

---

**AIP — Analytics Intelligence Platform**

**Analyze. Score. Improve.**