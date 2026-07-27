# AIP V2 — Known Limitations

## Technical Documentation

> **AIP reports what can be technically observed. It does not claim visibility into what cannot be observed.**

---

# 1. Purpose

This document describes the known technical and functional limitations of **Analytics Intelligence Platform V2**.

The purpose is to clearly distinguish between:

```text
BUG
```

```text
KNOWN LIMITATION
```

and:

```text
FUTURE CAPABILITY
```

AIP V2 is primarily based on static analysis of the HTML returned by a website.

This architecture provides useful Digital Analytics signals, but it cannot observe every aspect of a modern tracking implementation.

Understanding this boundary is essential when interpreting an AIP audit.

---

# 2. Core Analysis Boundary

The current V2 analysis can be summarized as:

```text
URL
 ↓
HTTP Request
 ↓
HTML Response
 ↓
Static Signals
 ↓
Detection Engine
 ↓
Knowledge Engine
 ↓
Scoring Engine
 ↓
AI Report
```

AIP analyzes what is observable from the retrieved document.

It does not currently execute the website inside a complete browser environment.

---

# 3. Static Analysis

AIP V2 primarily analyzes static HTML.

This includes signals such as:

```text
<script> tags

Script URLs

Inline JavaScript

Analytics identifiers

Tag Manager identifiers

CMP references

Pixel references

DataLayer declarations

Technical patterns
```

These signals are valuable but represent only part of a modern web application.

---

# 4. Static HTML Is Not Runtime State

A modern website often changes significantly after JavaScript execution.

For example:

```text
Initial HTML
     ↓
JavaScript execution
     ↓
Consent initialization
     ↓
Tag Manager execution
     ↓
Analytics tags
     ↓
Network requests
```

AIP V2 mainly observes the first part of this lifecycle.

---

# 5. Not Detected Does Not Mean Absent

This is the most important limitation to understand.

```text
NOT DETECTED
      ≠
ABSENT
```

If AIP does not detect a technology, it means:

> No sufficiently reliable evidence of that technology was identified in the analyzed data.

It does not necessarily mean:

> The website does not use that technology.

---

# 6. Example — GA4 Through GTM

Consider:

```text
Google Tag Manager detected

GA4 Measurement ID not visible
```

GA4 may still be deployed through the GTM container after page execution.

Therefore AIP should report:

```text
GA4 not directly detected in the analyzed HTML.
```

rather than:

```text
GA4 is not installed.
```

---

# 7. Dynamic Tag Management

Tag Management Systems can dynamically inject technologies.

Examples include:

```text
Google Tag Manager

Adobe Experience Platform Launch

TagCommander

Tealium
```

A static HTML response may expose the Tag Manager itself while hiding the technologies deployed inside it.

---

# 8. GTM Container Visibility

AIP may detect:

```text
GTM-XXXXXXX
```

but cannot inspect the internal GTM container configuration from the public HTML alone.

Therefore V2 cannot directly determine:

```text
All tags configured in GTM

All triggers

All variables

Folder structure

Naming conventions

Tag firing conditions

Complete Consent Mode configuration
```

---

# 9. GTM Does Not Prove GA4

The following evidence:

```text
GTM detected
```

does not prove:

```text
GA4 deployed
```

The Knowledge Engine may indicate that GA4 could be configured through GTM.

This remains a hypothesis requiring runtime or container-level verification.

---

# 10. JavaScript Runtime

AIP V2 does not currently execute the full page JavaScript lifecycle in a real browser.

Therefore it cannot reliably observe everything created after:

```text
DOMContentLoaded

window.load

User interaction

Consent acceptance

SPA navigation

Async API calls
```

This is a major boundary of static analysis.

---

# 11. Network Requests

AIP V2 does not perform complete browser network monitoring.

It therefore cannot systematically confirm requests such as:

```text
google-analytics.com/g/collect

analytics.google.com

Adobe collection requests

Meta Pixel requests

TikTok events

LinkedIn conversion requests
```

Runtime network inspection is planned for a future version.

---

# 12. Tag Presence vs Tag Firing

Static detection can sometimes establish that code exists.

It cannot always prove that the code successfully fires.

These are different concepts:

```text
TAG PRESENT
```

and:

```text
TAG EXECUTED
```

A tag can exist in HTML but fail at runtime.

---

# 13. Example — Present but Broken

A page may contain:

```text
GA4 script
```

but the implementation could still fail because of:

```text
JavaScript error

Consent blocking

Incorrect configuration

Network blocking

Invalid Measurement ID

Trigger condition
```

Static detection alone cannot guarantee successful data collection.

---

# 14. Detection Does Not Guarantee Collection

Therefore:

```text
Technology detected
```

does not necessarily mean:

```text
Data successfully collected
```

AIP V2 detects implementation signals.

It does not certify end-to-end data collection.

---

# 15. Server-Side Tracking

Server-side Analytics architectures create another important visibility limitation.

Examples include:

```text
GTM Server-Side

Server-side GA4

Server-side Meta CAPI

Adobe Edge Network

Custom collection proxies
```

Some tracking logic may execute entirely outside the browser-visible page.

---

# 16. Reverse Proxy Collection

Analytics requests can be routed through first-party domains.

Example:

```text
analytics.example.com
```

instead of:

```text
google-analytics.com
```

Static pattern detection may not identify the underlying vendor with certainty.

---

# 17. Server-Side First Architectures

Some organizations increasingly use server-side-first measurement architectures.

In these environments:

```text
Browser-visible signals
```

may represent only a small part of the real measurement architecture.

AIP V2 should therefore remain conservative when auditing such websites.

---

# 18. Consent Management

Consent implementations are often highly dynamic.

A CMP can:

```text
Load asynchronously

Inject scripts dynamically

Modify consent states

Block tags

Release tags after consent

Communicate with Tag Managers
```

Static HTML does not expose the complete consent lifecycle.

---

# 19. CMP Detection

AIP V2 can detect supported CMP technologies when recognizable evidence is present.

Examples may include:

```text
Didomi

OneTrust

Axeptio

Cookiebot
```

depending on the supported detector set.

However:

```text
CMP detected
```

does not prove:

```text
CMP correctly configured
```

---

# 20. Consent Mode

Consent Mode requires runtime behavior analysis for complete validation.

AIP V2 cannot fully confirm:

```text
Default consent state

Consent update state

Timing

Region-specific configuration

Advanced vs Basic Consent Mode

Tag behavior before consent

Tag behavior after consent
```

Static signals may provide clues but not complete proof.

---

# 21. Consent Mode v2

The same limitation applies to Consent Mode v2 parameters such as:

```text
ad_storage

analytics_storage

ad_user_data

ad_personalization
```

AIP may identify these values when they appear in static code.

However, runtime validation is required to verify their effective behavior.

---

# 22. GDPR Compliance

AIP V2 is not a legal compliance certification tool.

It may identify technical signals related to:

```text
CMP presence

Consent technologies

Advertising pixels

Consent Mode
```

but these signals are insufficient to determine complete GDPR compliance.

---

# 23. Compliance Wording

AIP should prefer wording such as:

```text
Consent configuration should be reviewed.
```

rather than:

```text
The website violates GDPR.
```

Legal compliance depends on factors outside the scope of the current technical audit.

---

# 24. DataLayer Analysis

AIP V2 can inspect DataLayer signals visible in the retrieved HTML.

This can include:

```text
dataLayer declarations

Events

Variables

E-commerce structures

Consent signals
```

However, many DataLayer operations happen only at runtime.

---

# 25. Runtime DataLayer

A website may start with:

```js
window.dataLayer = [];
```

and later push hundreds of events after page execution.

Static HTML may therefore show:

```text
Minimal DataLayer
```

while runtime inspection would reveal:

```text
Rich DataLayer
```

This can produce false negatives in Data Quality analysis.

---

# 26. GTM Internal Events

AIP distinguishes business events from technical GTM lifecycle events where possible.

Examples:

```text
gtm.js

gtm.dom

gtm.load
```

These events confirm technical DataLayer activity but do not prove business measurement maturity.

---

# 27. Business Event Visibility

Events such as:

```text
purchase

add_to_cart

generate_lead

form_submit
```

may only be pushed after user interaction.

A static homepage audit may therefore not expose them.

---

# 28. Page Scope

AIP V2 analyzes a supplied URL.

This does not mean it audits the complete website.

For example:

```text
Homepage
```

may use different tracking from:

```text
Checkout

Account

Search

Product page

Booking funnel
```

A single-page audit cannot represent every site journey.

---

# 29. Multi-Page Architecture

Large websites frequently have different technical stacks across sections.

Example:

```text
www.example.com
     ↓
GTM

shop.example.com
     ↓
Adobe Launch

account.example.com
     ↓
Custom tracking
```

AIP V2 does not automatically crawl and compare the complete domain architecture.

---

# 30. Single URL Scope

The V2 audit should therefore be interpreted as:

```text
Audit of observable signals
for the requested URL
```

not:

```text
Complete certification of the entire domain.
```

---

# 31. Single Page Applications

SPA frameworks introduce additional complexity.

Examples:

```text
React

Next.js

Vue

Angular
```

Analytics events may fire during client-side route changes without full HTML reloads.

Static analysis cannot observe these navigation events.

---

# 32. SPA Pageviews

A SPA may implement pageviews using:

```text
History API

Router events

Custom DataLayer events

Virtual pageviews
```

AIP V2 cannot fully validate these mechanisms without runtime navigation.

---

# 33. User Interactions

Many important Analytics events require interaction.

Examples:

```text
Button clicks

Form submissions

Video plays

Search

Login

Checkout

Purchase
```

Static HTML analysis cannot reproduce these user journeys.

---

# 34. E-commerce Validation

AIP may detect e-commerce structures in HTML or DataLayer signals.

However, it cannot guarantee:

```text
Purchase event fires correctly

Revenue is accurate

Currency is correct

Items are complete

Transaction IDs are unique

Refund tracking works
```

These require runtime and data validation.

---

# 35. Authentication

Some website sections require authentication.

Examples:

```text
Customer account

Checkout

Subscription area

Internal application
```

AIP V2 does not authenticate into private user areas.

Therefore those areas are outside the normal audit scope.

---

# 36. Geo-Dependent Implementations

Websites may serve different tracking configurations based on:

```text
Country

Region

Language

Privacy jurisdiction

IP address
```

A server-side request from one region may not receive the same implementation as a real user in another region.

---

# 37. A/B Testing

Websites may use experimentation platforms.

Different visitors may receive different:

```text
Scripts

Tracking configurations

Page variants

Consent experiences
```

A single fetch captures only one response variant.

---

# 38. Personalization

Personalization systems can dynamically change page content and tracking.

Therefore the observed implementation may not represent every user segment.

---

# 39. Anti-Bot Protection

Some websites block automated HTTP requests.

Common infrastructure includes:

```text
Cloudflare

Akamai

Imperva

Custom WAFs

Bot Management systems
```

AIP V2 does not attempt to bypass these security systems.

---

# 40. HTTP 403

During V2 testing, some websites returned:

```text
HTTP 403 Forbidden
```

Example:

```text
status: 403

statusText: Forbidden

server: cloudflare
```

This means AIP was denied access to the requested resource.

---

# 41. 403 Is Not a Detector Bug

When the remote server intentionally returns:

```text
403 Forbidden
```

the Detection Engine has no valid page to analyze.

Therefore this scenario is classified as:

```text
FETCH LIMITATION
```

rather than:

```text
DETECTION FAILURE
```

provided AIP correctly reports the fetch error.

---

# 42. Block Page Detection

A blocked response may still contain HTML.

For example:

```text
<html>
Cloudflare challenge...
</html>
```

AIP should not treat this block page as the actual website.

The HTTP status and fetch diagnostics are therefore important.

---

# 43. HTTP 429

Websites may also return:

```text
429 Too Many Requests
```

This indicates rate limiting.

AIP should treat this as a fetch failure or temporary access restriction rather than a valid audit result.

---

# 44. Timeouts

Some websites may respond too slowly.

AIP uses a timeout to prevent requests from hanging indefinitely.

A timeout means:

```text
Website could not be analyzed within
the configured execution window.
```

It does not mean:

```text
No Analytics implementation exists.
```

---

# 45. DNS and Network Failures

Other fetch failures can include:

```text
DNS resolution error

Connection reset

TLS error

Network interruption
```

These are infrastructure failures rather than Analytics audit findings.

---

# 46. Redirects

A requested URL may redirect to another URL.

Example:

```text
example.com
    ↓
www.example.com
```

AIP analyzes the document ultimately retrieved.

Complex redirect chains may affect execution time or fail depending on remote infrastructure.

---

# 47. Authentication Redirects

Some URLs may redirect to:

```text
Login pages

Access gateways

Bot challenges

Regional pages
```

The resulting HTML may not represent the intended page.

Future versions may add stronger page-content validation.

---

# 48. CDN Variability

CDNs may return different content based on:

```text
Location

Headers

Cookies

Bot classification

Device

Cache state
```

AIP's fetched HTML may therefore differ from what a user's browser receives.

---

# 49. Browser Differences

AIP's HTTP fetcher can send browser-like headers.

However:

```text
Browser-like HTTP request
```

is not equivalent to:

```text
Real browser execution
```

A real browser provides:

```text
JavaScript runtime

DOM

Cookies

Storage

Rendering

Network lifecycle

User interactions
```

which static fetch does not.

---

# 50. Technology Detector Coverage

AIP can only reliably detect technologies for which detection logic exists.

If a website uses an unsupported technology:

```text
Unsupported Analytics vendor
```

AIP may return no detection for that tool.

This does not mean the website has no Analytics solution.

---

# 51. Unknown Technologies

Future versions may introduce:

```text
Unknown analytics signal

Unknown tag manager

Unknown CMP
```

classification.

V2 primarily focuses on supported technologies with known detection patterns.

---

# 52. Technology Versions

AIP may detect a technology family without always identifying its exact version.

Example:

```text
Adobe Analytics detected
```

does not necessarily imply that AIP can determine:

```text
Exact library version

Exact migration history

Every Adobe configuration parameter
```

---

# 53. Custom Implementations

Organizations may build custom tracking libraries.

Example:

```text
analytics-client.js
```

which internally sends data to a known or private analytics backend.

Without recognizable vendor signals, AIP may not classify the implementation correctly.

---

# 54. Obfuscated JavaScript

Production JavaScript can be:

```text
Minified

Bundled

Obfuscated

Dynamically generated
```

This can reduce static detection visibility.

AIP avoids aggressive inference from ambiguous code because that would increase false positives.

---

# 55. False Negatives

Known architecture limitations can create false negatives.

Common causes include:

```text
Dynamic loading

Consent blocking

Tag Manager deployment

Server-side tracking

Runtime DataLayer

Obfuscation

Unsupported technology
```

AIP's wording and scoring should remain conservative when evidence is limited.

---

# 56. False Positives

Detection logic can also potentially produce false positives.

AIP reduces this risk through:

```text
Technology-specific patterns

ID validation

Evidence collection

Certainty levels

Non-regression testing
```

False-positive detector bugs should be treated seriously because they create incorrect audit facts.

---

# 57. Certainty

Certainty levels help express evidence strength.

Conceptually:

```text
High

Medium

Low
```

A technology detected from a strong identifier should have stronger certainty than one inferred from a generic pattern.

---

# 58. Certainty Is Not Probability

AIP certainty should be interpreted as:

```text
Strength of technical evidence
```

not as a mathematically calibrated probability.

For example:

```text
High certainty
```

does not mean:

```text
95% statistical probability.
```

---

# 59. Knowledge Engine Limitations

The Knowledge Engine is deterministic.

This provides consistency, but it also means:

```text
Only implemented rules can produce insights.
```

A valid relationship not represented by a rule may not generate an insight.

---

# 60. Knowledge Is Not Exhaustive

The absence of a Knowledge Engine warning does not prove that the implementation is perfect.

The engine evaluates its current rule set.

Future versions can progressively add more Analytics expertise.

---

# 61. Scoring Limitations

The V2 score evaluates observable evidence.

It should not be interpreted as an absolute measurement of the organization's entire Analytics maturity.

The score is closer to:

```text
Technical maturity based on
observable AIP evidence
```

---

# 62. Score Is Not Business Performance

A score of:

```text
80 / 100
```

does not mean:

```text
The company's Analytics program is 80% successful.
```

AIP does not directly evaluate:

```text
Team skills

Governance processes

Data adoption

Business impact

Reporting quality

Decision-making culture
```

unless such dimensions are explicitly introduced in future versions.

---

# 63. Score and Static Visibility

A sophisticated runtime architecture may receive a lower score if important signals are invisible to static analysis.

This is another reason the score must be interpreted within the current analysis scope.

---

# 64. AI Report Limitations

The AI Report Engine is grounded in structured audit data.

This significantly reduces hallucination risk.

However, generative AI remains probabilistic.

The generated wording can vary between executions.

---

# 65. AI Does Not Own Detection

The AI should never be treated as the authoritative detector.

The architecture is:

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

AI
      ↓
Communication
```

This separation is intentional.

---

# 66. AI Hallucination Risk

Prompt constraints reduce hallucination but cannot theoretically eliminate all model errors.

AIP therefore uses:

```text
Structured input

Restricted prompt

JSON output

Output validation

Regression testing
```

to control the risk.

---

# 67. AI Output Validation

V2 validates required report fields.

However, current validation does not prove that every generated sentence is semantically correct.

Human review remains useful for high-stakes client deliverables.

---

# 68. AI Report Is Not a Consultant Replacement

AIP is designed to accelerate:

```text
Pre-audit

Technical discovery

Initial assessment

Recommendation preparation
```

It is not intended to completely replace expert analysis for complex enterprise implementations.

---

# 69. AI Provider Dependency

AI report generation depends on an external AI service.

Possible failures include:

```text
API outage

Timeout

Rate limit

Invalid credentials

Provider-side changes
```

A future version may support degraded operation where deterministic audit results remain available even if AI generation fails.

---

# 70. AI Latency

AI generation can represent a significant part of audit execution time.

Therefore the total response time can vary depending on the provider.

Future versions may optimize:

```text
Prompt size

Model choice

Caching

Asynchronous processing
```

---

# 71. Prompt Evolution

Changing report prompts can modify:

```text
Wording

Prioritization

Report detail

Risk interpretation
```

even if the application code remains unchanged.

Prompt modifications should therefore be regression tested.

---

# 72. Security — User-Provided URLs

AIP accepts a URL and fetches it from the server.

This creates potential SSRF risks in a public production environment.

Production hardening should prevent access to:

```text
localhost

Private networks

Cloud metadata services

Internal infrastructure
```

---

# 73. Security — Prompt Injection

Website HTML is untrusted content.

A malicious website could contain text such as:

```text
Ignore previous instructions.
```

Website content must always remain:

```text
DATA
```

and never become:

```text
AI INSTRUCTIONS
```

Future evidence filtering can further strengthen this boundary.

---

# 74. Security — Secrets

AIP must never expose:

```text
AI API keys

Environment secrets

Internal credentials
```

through:

```text
Frontend code

API responses

Git repository

Logs
```

---

# 75. Public SaaS Limitations

The V2 Release Candidate focuses on the audit engine and product experience.

It does not yet include a complete production SaaS platform.

Examples of capabilities not currently central to V2 include:

```text
Authentication

Billing

Subscription management

Audit quotas

Audit history

Organizations

Team workspaces

Persistent reports
```

---

# 76. Audit Persistence

V2 audits are primarily executed on demand.

A complete persistent audit history system is a future capability.

Without persistence, AIP does not automatically provide:

```text
Historical comparisons

Trend analysis

Audit version history
```

---

# 77. PDF Export

Professional PDF export is not part of the current V2 core.

The structured audit architecture is designed so this can be added later.

Future flow:

```text
Audit Result
    ↓
PDF Renderer
    ↓
Client Report
```

---

# 78. PowerPoint Export

PowerPoint generation is also a future capability.

The existing structured report can later populate:

```text
Executive slides

Score slides

Technology slides

Recommendations

Roadmap slides
```

without redesigning the core engines.

---

# 79. Runtime Analysis

The largest planned technical improvement is runtime browser analysis.

A future browser engine could observe:

```text
Rendered DOM

Network requests

Cookies

DataLayer changes

Consent lifecycle

SPA navigation

JavaScript-injected tags
```

This would address many V2 visibility limitations.

---

# 80. Playwright

Playwright is a candidate technology for runtime analysis.

Conceptually:

```text
URL
 ↓
Browser
 ↓
Page Execution
 ↓
Network + DOM + Cookies + DataLayer
 ↓
Runtime Evidence
 ↓
Detection Engine
```

This capability belongs to a future version rather than the current static V2 scope.

---

# 81. Static + Runtime Architecture

The long-term architecture should not necessarily replace static analysis.

Instead, it can combine both.

```text
Static HTML Analysis
          +
Runtime Browser Analysis
          ↓
Unified Evidence
          ↓
Knowledge
          ↓
Scoring
          ↓
AI Report
```

Static analysis remains valuable because it is:

```text
Fast

Cheap

Simple

Deterministic
```

---

# 82. Runtime Is Not Perfect Either

Runtime analysis will solve many limitations but introduce new ones.

Examples:

```text
Higher execution cost

Longer audits

Browser crashes

Consent interaction complexity

CAPTCHA

Authentication

Anti-bot detection

Resource management
```

Therefore AIP should maintain layered analysis rather than assuming browser automation solves every problem.

---

# 83. Multi-Page Audit

A future version may audit several strategic pages.

Example:

```text
Homepage

Product page

Search page

Cart

Checkout

Confirmation
```

This would provide a more representative view of the measurement architecture.

---

# 84. Journey Testing

Longer term, AIP could execute user journeys.

Example:

```text
Visit product
     ↓
Add to cart
     ↓
Checkout
     ↓
Purchase
```

and validate Analytics events at each step.

This would transform AIP from static auditor toward an automated measurement QA platform.

---

# 85. Limitation Classification

Known limitations should be classified consistently.

## Type A — Static Architecture

Examples:

```text
Runtime tags invisible
SPA navigation invisible
Dynamic DataLayer incomplete
```

## Type B — External Infrastructure

Examples:

```text
403
429
Timeout
CAPTCHA
```

## Type C — Coverage

Examples:

```text
Unsupported technology
Missing knowledge rule
```

## Type D — Product Scope

Examples:

```text
No authentication
No history
No PDF
```

This classification helps avoid treating every limitation as a bug.

---

# 86. Bug vs Limitation Example

Scenario:

```text
Norauto returns HTTP 403 from Cloudflare.
```

If AIP reports:

```text
Unable to fetch — HTTP 403
```

then:

```text
KNOWN EXTERNAL LIMITATION
```

If AIP reports:

```text
No Analytics technologies detected
Score 0/100
```

then:

```text
BUG
```

because the application incorrectly interpreted the failed fetch.

---

# 87. Another Bug vs Limitation Example

Scenario:

```text
GA4 is loaded dynamically through GTM.
```

AIP static analysis does not detect GA4.

If AIP reports:

```text
GA4 not directly detected.
Runtime verification recommended.
```

then:

```text
KNOWN STATIC LIMITATION
```

If AIP reports:

```text
The website definitely does not use GA4.
```

then:

```text
BUG / REPORT REGRESSION
```

because the conclusion exceeds the evidence.

---

# 88. Release Candidate Perspective

A Release Candidate does not require all known limitations to disappear.

It requires:

```text
Limitations are understood

Limitations are documented

Application behavior is predictable

No critical limitation is misrepresented

No P0 remains

No serious unresolved P1 remains
```

This is the standard used for AIP V2.

---

# 89. What Is Acceptable for V2

Examples of acceptable known limitations:

```text
Static analysis cannot observe all runtime tags.

Some Cloudflare websites return 403.

Server-side tracking may be invisible.

SPA navigation is not executed.

Complete Consent Mode behavior is not validated.
```

These are architectural boundaries.

---

# 90. What Is Not Acceptable for V2

Examples:

```text
Application crashes on normal input.

Score exceeds 100.

AI invents technologies as facts.

Fetch failures become 0/100 audits.

Known detector produces systematic false positives.

API cannot complete normal supported audits.
```

These are bugs and should be addressed before release if severe.

---

# 91. Communication Principle

AIP should communicate limitations without undermining the usefulness of the audit.

The correct message is not:

```text
Static analysis is unreliable.
```

The correct message is:

```text
Static analysis provides valuable observable evidence,
while runtime verification is required for signals that
only exist after browser execution.
```

Both statements can be true:

```text
V2 provides useful technical intelligence.
```

and:

```text
V2 does not see everything.
```

---

# 92. Product Positioning

AIP V2 is best positioned as:

> **An automated Digital Analytics pre-audit and technical intelligence platform based on observable implementation evidence.**

It should not currently be positioned as:

> **A complete certification of every tracking request across every user journey.**

This distinction keeps product claims aligned with technical reality.

---

# 93. Why These Limitations Matter

Explicitly documenting limitations improves:

```text
Technical credibility

Audit interpretation

User expectations

Developer decisions

Roadmap prioritization

Client communication
```

A mature technical product should explain both what it can do and where its evidence boundary ends.

---

# 94. Limitations Drive the Roadmap

Many future AIP capabilities directly originate from V2 limitations.

```text
STATIC LIMITATION
      ↓
Runtime Browser Analysis

SINGLE PAGE LIMITATION
      ↓
Multi-Page Audit

NO NETWORK VISIBILITY
      ↓
Request Monitoring

DYNAMIC CONSENT LIMITATION
      ↓
Consent Runtime QA

NO HISTORY
      ↓
Audit Persistence

NO CLIENT EXPORT
      ↓
PDF / PowerPoint
```

The roadmap is therefore an extension of observed technical needs rather than a random feature list.

---

# 95. V2 Boundary Summary

AIP V2 can reliably work with:

```text
Observable static HTML signals

Known technology patterns

Structured detector evidence

Deterministic knowledge rules

Deterministic scoring

Grounded AI reporting
```

AIP V2 has limited visibility into:

```text
Runtime-only tags

Network behavior

Server-side architectures

Dynamic consent states

SPA navigation

Authenticated journeys

Complete multi-page implementations
```

---

# 96. Final Principle

The central principle for interpreting an AIP V2 audit is:

```text
AIP reports evidence,
not assumptions.
```

Therefore:

```text
DETECTED
=
Evidence found

NOT DETECTED
=
No sufficient evidence found

FETCH FAILED
=
No reliable audit possible

RUNTIME UNKNOWN
=
Browser verification required
```

These states must never be confused.

---

# 97. Summary

AIP V2 intentionally prioritizes:

```text
Explainability

Deterministic evidence

Modular architecture

Conservative conclusions

Controlled AI usage
```

over pretending to provide perfect visibility into every possible Analytics implementation.

Its main current limitation is the boundary between:

```text
STATIC OBSERVATION
```

and:

```text
RUNTIME BEHAVIOR
```

This boundary is understood, documented and directly informs the next evolution of the platform.

The future direction is therefore:

```text
STATIC ANALYSIS
       +
RUNTIME ANALYSIS
       +
MULTI-PAGE EVIDENCE
       +
NETWORK OBSERVATION
       ↓
MORE COMPLETE AUDIT
```

while preserving the V2 principle:

> **Never claim more than the available evidence can support.**

---

# Related Documentation

- [`architecture.md`](./architecture.md)
- [`detection-engine.md`](./detection-engine.md)
- [`knowledge-engine.md`](./knowledge-engine.md)
- [`scoring-engine.md`](./scoring-engine.md)
- [`ai-report-engine.md`](./ai-report-engine.md)
- [`api.md`](./api.md)
- [`testing.md`](./testing.md)
- [`roadmap.md`](./roadmap.md)

---

**AIP — Analytics Intelligence Platform**

**Analyze. Score. Improve.**