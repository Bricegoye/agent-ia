# AIP V2 — API & Orchestrator

## Technical Documentation

> **The API exposes the audit. The Orchestrator coordinates the engines.**

---

# 1. Purpose

The AIP API is the application entry point for executing a Digital Analytics audit.

Its main endpoint is:

```text
POST /api/agent
```

The API receives an audited URL and a report language, validates the request, executes the AIP audit pipeline and returns a structured response.

The API itself does not perform technology detection, scoring or AI analysis.

These responsibilities belong to the specialized AIP engines.

---

# 2. Position in the Architecture

The API sits between the user interface and the audit engines.

```text
User
  │
  ▼
Audit Interface
  │
  ▼
POST /api/agent
  │
  ▼
API Route
  │
  ▼
API Orchestrator
  │
  ├── Detection Engine
  │
  ├── Knowledge Engine
  │
  ├── Scoring Engine
  │
  └── AI Report Engine
  │
  ▼
Structured Audit Result
  │
  ▼
API Response
  │
  ▼
Audit Dashboard
```

This separation keeps HTTP concerns independent from audit business logic.

---

# 3. Main Endpoint

The primary audit endpoint is:

```text
POST /api/agent
```

Its responsibility is to start a complete AIP audit.

Example:

```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "language": "fr"
  }'
```

---

# 4. Request Content Type

The endpoint expects:

```text
Content-Type: application/json
```

The request body is a JSON object.

---

# 5. Request Payload

The audit request contains:

```json
{
  "url": "https://example.com",
  "language": "fr"
}
```

The two main parameters are:

```text
url
language
```

---

# 6. URL Parameter

`url` identifies the website to audit.

Example:

```json
{
  "url": "https://example.com"
}
```

The URL is passed to the audit pipeline and eventually to the HTML Fetcher.

The platform should reject requests that do not contain a usable URL.

---

# 7. Language Parameter

`language` controls the language of human-readable AI report content.

Current supported values are:

```text
fr
en
```

Example:

```json
{
  "language": "fr"
}
```

The language does not change:

```text
Technology names
Identifiers
URLs
JSON property names
Technical standards
```

when translation would reduce technical accuracy.

---

# 8. API Route Responsibility

The API route should remain lightweight.

Its responsibilities include:

```text
Read request
Validate basic input
Start execution timer
Call API Orchestrator
Return structured response
Handle errors
```

It should not contain detector-specific logic.

---

# 9. Separation of Concerns

Incorrect architecture:

```text
/api/agent
   │
   ├── Detect GTM
   ├── Detect GA4
   ├── Evaluate consent
   ├── Calculate score
   ├── Build AI prompt
   └── Return response
```

Correct AIP architecture:

```text
/api/agent
   │
   ▼
API Orchestrator
   │
   ├── Detection Engine
   ├── Knowledge Engine
   ├── Scoring Engine
   └── AI Report Engine
```

The route handles HTTP.

The engines handle business logic.

---

# 10. API Orchestrator

The `APIOrchestrator` coordinates the complete audit workflow.

Conceptually:

```ts
const result =
  await orchestrator.analyze(
    url,
    language
  );
```

Its role is coordination rather than detection.

---

# 11. Why an Orchestrator?

Without an orchestrator, the API route would need to understand the complete application pipeline.

That would create strong coupling between:

```text
HTTP
Detection
Knowledge
Scoring
AI
```

The Orchestrator provides a dedicated coordination layer.

---

# 12. Orchestration Flow

The complete workflow is conceptually:

```text
URL
 │
 ▼
Detection Engine
 │
 ▼
Detection Result
 │
 ▼
Knowledge Engine
 │
 ▼
Knowledge Insights
 │
 ▼
Scoring Engine
 │
 ▼
Scoring Result
 │
 ▼
AI Report Engine
 │
 ▼
AI Report
 │
 ▼
Complete Audit Result
```

Each stage consumes structured output from the previous layers.

---

# 13. Detection Execution

The Orchestrator starts technical analysis.

Conceptually:

```ts
const detection =
  await detectionEngine.analyze(url);
```

The Detection Engine is responsible for:

```text
HTML retrieval
Technology detection
Identifiers
Evidence
Confidence
Raw signals
```

depending on the current implementation.

---

# 14. Detection Result

The result contains structured technical information.

Conceptually:

```json
{
  "url": "https://example.com",
  "fetchedAt": "...",
  "htmlSize": 100000,
  "tools": [],
  "rawSignals": {}
}
```

This becomes the technical evidence foundation for the rest of the audit.

---

# 15. Knowledge Execution

The Detection Result is passed to the Knowledge Engine.

Conceptually:

```ts
const knowledge =
  evaluateKnowledgeRules(detection);
```

The Knowledge Engine evaluates relationships between technologies.

---

# 16. Knowledge Result

The result is an array of structured insights.

Example:

```json
[
  {
    "key": "gtm-detected",
    "severity": "success",
    "title": "Google Tag Manager détecté",
    "description": "...",
    "relatedTools": [
      "gtm"
    ]
  }
]
```

These insights remain deterministic.

---

# 17. Scoring Execution

The structured detection data is evaluated by the Scoring Engine.

Conceptually:

```ts
const scoring =
  scoringEngine.calculate(detection);
```

The exact method name depends on the current implementation.

The important architectural principle is:

```text
Scoring consumes structured evidence.
```

---

# 18. Scoring Result

The result contains:

```text
Global Score
Maximum Score
Grade
Category Scores
```

Conceptually:

```json
{
  "globalScore": 75,
  "maxScore": 100,
  "grade": "C",
  "categories": []
}
```

The score is authoritative and deterministic.

---

# 19. AI Report Execution

The Orchestrator then creates an `AIReportInput`.

Conceptually:

```ts
{
  detection,
  knowledge,
  scoring,
  language
}
```

This input is passed to:

```ts
aiReportEngine.generate(...)
```

---

# 20. AI Report Result

The AI Report Engine returns:

```json
{
  "executiveSummary": "...",
  "strengths": [
    "..."
  ],
  "weaknesses": [
    "..."
  ],
  "recommendations": [
    "..."
  ],
  "priorityActions": [
    "..."
  ],
  "technicalAnalysis": "..."
}
```

The response has already passed JSON parsing and report validation.

---

# 21. Complete Audit Result

The Orchestrator can then assemble the complete audit.

Conceptually:

```text
Detection
+
Knowledge
+
Scoring
+
AI Report
=
Complete Audit
```

This result is returned to the API route.

---

# 22. Successful API Response

A successful response conceptually follows this structure:

```json
{
  "success": true,
  "url": "https://example.com",
  "executionTime": 12000,
  "detection": {},
  "knowledge": [],
  "scoring": {},
  "report": {}
}
```

The exact structure should follow the application's TypeScript contract.

---

# 23. Success Flag

The `success` property indicates whether the audit pipeline completed successfully.

Example:

```json
{
  "success": true
}
```

For an audit failure:

```json
{
  "success": false
}
```

This allows the frontend to distinguish successful audits from failures without parsing error strings.

---

# 24. Execution Time

The API records audit execution duration.

Example:

```json
{
  "executionTime": 782
}
```

The value represents execution duration in milliseconds.

Conceptually:

```text
Request Start
     │
     ▼
Audit Pipeline
     │
     ▼
Request End
     │
     ▼
executionTime
```

---

# 25. Why Execution Time Matters

Execution time provides useful information for:

```text
Performance monitoring
Debugging
Runtime comparison
Future optimization
AI latency analysis
Fetch latency analysis
```

It can also help identify unusually slow external websites.

---

# 26. External Dependencies

A complete audit can depend on external systems.

Examples:

```text
Audited Website
AI Provider
Network
DNS
```

This means API execution time can vary significantly even when AIP application code has not changed.

---

# 27. Fetch Failures

One of the most important failure scenarios is inability to retrieve the target website.

Examples include:

```text
HTTP 403 Forbidden
HTTP 429 Too Many Requests
Timeout
DNS failure
Connection failure
Anti-bot protection
```

In these cases, the Detection Engine cannot establish reliable audit evidence.

---

# 28. HTTP 403 Example

During V2 testing, some websites returned:

```text
HTTP 403 Forbidden
```

Example diagnostic:

```text
requestedUrl: https://www.example.com
finalUrl: https://www.example.com/
status: 403
statusText: Forbidden
server: cloudflare
```

This is a website access restriction.

It is not equivalent to:

```text
No Analytics technologies detected
```

---

# 29. Fetch Failure Response

A fetch failure can produce an API response such as:

```json
{
  "success": false,
  "url": "https://example.com",
  "executionTime": 295,
  "error": "Unable to fetch https://example.com - HTTP 403 Forbidden"
}
```

This communicates that the audit could not be completed.

---

# 30. Failure Does Not Equal Zero Score

A critical rule is:

```text
FETCH FAILURE
      ≠
0 / 100
```

If AIP cannot retrieve the website, there is insufficient evidence to calculate a meaningful audit score.

Correct:

```text
Audit unavailable
```

Incorrect:

```text
Analytics maturity = 0
```

---

# 31. Low-Signal Site vs Fetch Failure

These scenarios must remain separate.

## Low-Signal Site

```text
HTTP fetch succeeds
        ↓
HTML analyzed
        ↓
Few supported signals detected
        ↓
Conservative audit
```

## Fetch Failure

```text
HTTP fetch fails
        ↓
No reliable HTML
        ↓
Audit cannot continue
```

This distinction is essential for audit integrity.

---

# 32. Error Handling

The API route catches application errors and converts them into structured responses.

Conceptually:

```ts
try {
  // Execute audit
} catch (error) {
  // Return structured failure
}
```

This prevents raw application exceptions from becoming the user-facing API contract.

---

# 33. Structured Error Response

A typical failure response contains:

```json
{
  "success": false,
  "url": "https://example.com",
  "executionTime": 500,
  "error": "..."
}
```

The frontend can then present a controlled error state.

---

# 34. Error Logging

The server can log detailed errors for debugging.

Example:

```text
[AIP] Error:
Unable to fetch https://example.com
```

Detailed server logs can include:

```text
Stack trace
HTTP status
Fetcher diagnostics
Execution context
```

The user-facing response can remain simpler.

---

# 35. Fetch Diagnostics

The HTML Fetcher can log diagnostic metadata.

Example:

```text
[AIP Fetch] {
  requestedUrl: "...",
  finalUrl: "...",
  status: 403,
  statusText: "Forbidden",
  redirected: false,
  contentType: "text/html",
  server: "cloudflare",
  htmlSize: 773
}
```

These diagnostics are useful when investigating failed audits.

---

# 36. Requested URL vs Final URL

HTTP redirects can change the final page URL.

Example:

```text
Requested:
https://example.com

Final:
https://www.example.com/
```

Tracking both values improves debugging and future audit traceability.

---

# 37. HTTP Status

The Fetcher records HTTP status.

Examples:

```text
200 OK
301 Moved Permanently
302 Found
403 Forbidden
404 Not Found
429 Too Many Requests
500 Internal Server Error
```

AIP should distinguish successful HTML retrieval from error pages.

---

# 38. Content Type

The Fetcher can inspect:

```text
Content-Type
```

Expected web documents generally return something similar to:

```text
text/html
```

This metadata can help detect unexpected responses.

---

# 39. Server Information

When available, response headers may expose server infrastructure.

Example:

```text
cloudflare
```

This can help explain anti-bot behavior.

However, server metadata is diagnostic information and should not be interpreted as an Analytics technology.

---

# 40. HTML Size

The Fetcher records:

```text
htmlSize
```

Example:

```text
htmlSize: 185432
```

HTML size can be useful for:

```text
Debugging
Performance diagnostics
Detecting suspiciously small block pages
Comparing responses
```

A 403 page of a few hundred bytes is very different from a complete application document.

---

# 41. Redirect Handling

The HTTP layer may encounter redirects.

AIP records the final resolved URL when possible.

Conceptually:

```text
Requested URL
     ↓
Redirect
     ↓
Final URL
     ↓
HTML Analysis
```

The audit should analyze the final document actually retrieved.

---

# 42. Timeout Handling

External websites may respond slowly or never complete the request.

The HTML Fetcher therefore uses a timeout.

Conceptually:

```text
Fetch starts
    ↓
Timeout threshold reached
    ↓
Request aborted
    ↓
Structured audit failure
```

This prevents an audit request from hanging indefinitely.

---

# 43. User-Agent

The HTML Fetcher sends a browser-like User-Agent.

This improves compatibility with websites that reject unknown or minimal HTTP clients.

However, some websites still use sophisticated anti-bot protection.

A browser-like User-Agent does not guarantee access.

---

# 44. Anti-Bot Systems

Modern websites may use:

```text
Cloudflare
Akamai
Imperva
Bot Management
CAPTCHA
JavaScript challenges
```

Static server-side fetch requests may be blocked even when the site works normally in a browser.

This is one reason runtime browser analysis is planned for future versions.

---

# 45. API HTTP Status vs Audit Success

The current application can return an HTTP response while the internal audit result contains:

```json
{
  "success": false
}
```

These are two different concepts.

```text
HTTP transport succeeded
```

does not necessarily mean:

```text
Audit succeeded
```

The application-level `success` flag represents audit completion.

---

# 46. Future HTTP Status Strategy

A future API contract may use more explicit HTTP status codes.

Examples:

```text
200
Audit completed

400
Invalid request

422
Audit could not be processed

429
Application rate limit

500
Internal application failure

502 / 503
External dependency failure
```

Any such change should be documented and kept consistent for frontend consumers.

---

# 47. Invalid Request

The API should reject requests with missing or invalid input.

Examples:

```json
{}
```

```json
{
  "url": ""
}
```

```json
{
  "language": "fr"
}
```

A valid audit requires a usable URL.

---

# 48. URL Validation

Future validation can become stricter.

Possible checks include:

```text
Valid URL syntax

Allowed protocols

HTTP / HTTPS only

No unsupported schemes

Protection against internal network targets
```

The last point becomes especially important for security.

---

# 49. SSRF Considerations

Because AIP fetches user-provided URLs from the server, the endpoint must consider **Server-Side Request Forgery (SSRF)** risks.

A malicious user could attempt to request:

```text
localhost

127.0.0.1

private network addresses

cloud metadata endpoints

internal services
```

Production versions should restrict which targets the fetcher is allowed to access.

---

# 50. Allowed Protocols

The audit system should normally accept:

```text
http://
https://
```

and reject schemes such as:

```text
file://
ftp://
data:
javascript:
```

This reduces security risk.

---

# 51. Private Network Protection

Future production hardening should prevent requests to private or local infrastructure.

Examples include:

```text
127.0.0.1
localhost
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
169.254.0.0/16
```

DNS resolution should also be considered to reduce DNS rebinding risks.

---

# 52. Rate Limiting

A public audit endpoint can generate expensive operations.

A single request may involve:

```text
External website fetch
Detection processing
Knowledge processing
Scoring
AI API request
```

Future production versions should therefore consider rate limiting.

---

# 53. Why Rate Limiting Matters

Rate limiting protects against:

```text
Abuse

AI API cost explosion

Accidental request loops

Denial-of-service patterns

External website overloading
```

This will become increasingly important when runtime browser analysis is introduced.

---

# 54. Request Size

The current request body is intentionally small.

Example:

```json
{
  "url": "...",
  "language": "fr"
}
```

Users do not upload arbitrary HTML through the main audit endpoint.

AIP retrieves the website itself.

This keeps the public request contract simple.

---

# 55. Response Size

The complete response can be significantly larger than the request because it includes:

```text
Detection results

Evidence

Raw signals

Knowledge insights

Scoring

AI report
```

Future production versions may choose to reduce raw diagnostic information returned to the frontend.

---

# 56. Raw Signals in API Responses

Raw signals are valuable during development.

Examples:

```text
scriptSrcs
headSnippet
inlineScriptSnippet
```

However, they can increase:

```text
Response size
Frontend complexity
Information exposure
```

Future production APIs may separate:

```text
Public audit result
```

from:

```text
Debug audit result
```

---

# 57. Development vs Production Diagnostics

During development, detailed diagnostics are useful.

```text
HTTP headers
HTML size
Raw signals
Stack traces
```

In production, some of this information may need to remain server-side.

A future logging strategy can distinguish:

```text
User-facing errors
```

from:

```text
Developer diagnostics
```

---

# 58. API Response as Product Contract

The API response is not just an internal object.

It becomes a contract between:

```text
Backend
Frontend
Future exports
Future integrations
```

Changes to field names should therefore be made carefully.

For example:

```text
globalScore
```

should not be casually renamed if multiple components depend on it.

---

# 59. TypeScript Contracts

AIP uses TypeScript types to define data exchanged between engines.

Examples include:

```text
AnalyticsDetectionResult
AnalyticsInsight
ScoringResult
AIReport
AIReportInput
```

These types help protect the API pipeline from incompatible data structures.

---

# 60. Orchestrator as Integration Boundary

The Orchestrator is where the engine outputs are combined.

Conceptually:

```text
DetectionResult
      +
AnalyticsInsight[]
      +
ScoringResult
      +
AIReport
      ↓
Complete Audit Result
```

This makes the Orchestrator an important integration boundary.

---

# 61. Orchestrator Should Remain Thin

The Orchestrator should coordinate engines.

It should not gradually absorb their business logic.

Avoid:

```text
if GA4 detected:
   add 20 points

if GTM detected:
   generate recommendation
```

inside the Orchestrator.

Those responsibilities belong to:

```text
Scoring Engine
Knowledge Engine
```

respectively.

---

# 62. Execution Order

The execution order matters.

```text
Detection
    ↓
Knowledge
    ↓
Scoring
    ↓
AI Report
```

The AI Report Engine depends on results from the earlier stages.

Running it before scoring would prevent it from receiving the complete audit context.

---

# 63. Failure Propagation

If a critical upstream stage fails, downstream stages should not fabricate results.

Example:

```text
HTML Fetch fails
      ↓
Detection unavailable
      ↓
Knowledge unavailable
      ↓
Scoring unavailable
      ↓
AI report should not speculate
```

This preserves audit integrity.

---

# 64. Partial Results

Future versions may support partial audit results.

For example:

```text
Detection succeeds

Knowledge succeeds

Scoring succeeds

AI provider fails
```

AIP could potentially return:

```text
Technical audit available

AI report unavailable
```

instead of failing the entire request.

This is a possible future resilience improvement.

---

# 65. Current Simplicity

V2 favors a simple pipeline.

Conceptually:

```text
All required stages succeed
        ↓
success = true
```

or:

```text
Critical stage fails
        ↓
success = false
```

This makes Release Candidate behavior easier to understand and test.

---

# 66. Future Audit IDs

A future persistent version of AIP could assign an audit identifier.

Example:

```json
{
  "auditId": "audit_123456"
}
```

This would allow:

```text
Audit history
Report retrieval
PDF generation
Comparison
Sharing
```

AIP V2 does not require persistent audit IDs for the core pipeline.

---

# 67. Future Asynchronous Audits

Runtime analysis may make audits significantly slower.

A future API architecture could become asynchronous.

Example:

```text
POST /api/audits
      ↓
Audit ID
      ↓
Processing
      ↓
GET /api/audits/:id
      ↓
Result
```

This is not required for the current static V2 architecture.

---

# 68. Future API Structure

As AIP grows, the API could evolve toward endpoints such as:

```text
POST /api/audits

GET /api/audits/:id

GET /api/audits/:id/report

GET /api/audits/:id/export

POST /api/audits/:id/runtime
```

The current `/api/agent` endpoint remains appropriate for the V2 Release Candidate.

---

# 69. Runtime Integration

Future runtime analysis may add a second evidence source.

Conceptually:

```text
API Orchestrator
       │
       ├── Static Detection
       │
       └── Runtime Detection
               │
               ▼
        Unified Evidence
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

The Orchestrator is naturally positioned to coordinate this evolution.

---

# 70. Playwright Direction

One planned runtime approach is browser automation using Playwright.

This could allow AIP to observe:

```text
JavaScript execution

Network requests

Cookies

Runtime DataLayer

Consent behavior

SPA navigation
```

This will require additional API resource management because browser audits are more expensive than static HTTP fetches.

---

# 71. Performance Considerations

The main sources of API latency can include:

```text
Website fetch
Redirects
Slow origin server
Detection processing
AI generation
```

In the current architecture, AI generation can represent a significant portion of total execution time.

---

# 72. Future Timing Breakdown

Future observability could expose internal timing metrics.

Example:

```json
{
  "timings": {
    "fetch": 450,
    "detection": 25,
    "knowledge": 2,
    "scoring": 3,
    "aiReport": 5200,
    "total": 5680
  }
}
```

This would make performance optimization much easier.

---

# 73. Logging Strategy

A future logging system could use structured logs.

Example:

```json
{
  "event": "audit_fetch_failed",
  "url": "https://example.com",
  "status": 403,
  "executionTime": 295
}
```

Structured logging would improve production observability.

---

# 74. Sensitive Information

Logs should avoid exposing:

```text
API keys
Authentication tokens
Secrets
Sensitive environment variables
```

The API response should never expose the AI provider API key.

---

# 75. Environment Variables

External AI credentials are stored in environment configuration.

For example:

```text
.env.local
```

Environment files containing secrets must not be committed to Git.

Production secrets should be configured through the deployment platform.

---

# 76. CORS

The current Next.js application uses its own API route from its own frontend.

If AIP later exposes the API to external clients, a deliberate CORS strategy will be required.

This should not be opened broadly without considering:

```text
Authentication
Rate limiting
Abuse protection
API costs
```

---

# 77. Authentication

The V2 Release Candidate can remain focused on the core audit functionality.

A future SaaS version may introduce:

```text
User authentication

Audit quotas

Account limits

Usage tracking

Paid plans
```

At that point the API layer will become responsible for access control before starting expensive audits.

---

# 78. Audit Quotas

Future plans could limit:

```text
Audits per day

Runtime audits

AI reports

PDF exports
```

The API is the natural enforcement boundary for such quotas.

---

# 79. API Versioning

As the API contract evolves, versioning may eventually become useful.

Example:

```text
/api/v1/audits
```

or through explicit response metadata.

V2 currently prioritizes application development over public API versioning.

---

# 80. Testing the API Locally

The endpoint can be tested with `curl`.

Example:

```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "language": "fr"
  }' | python3 -m json.tool
```

`python3 -m json.tool` formats the JSON response for easier inspection.

---

# 81. Useful API Test Cases

The Release Candidate should include several scenarios.

```text
Successful GA4 / GTM audit

Adobe Analytics audit

CMP audit

Rich DataLayer audit

Low-signal audit

Fetch failure
```

These cases validate both business logic and API behavior.

---

# 82. Successful Test

Expected:

```json
{
  "success": true
}
```

and valid:

```text
Detection
Knowledge
Scoring
Report
```

sections.

---

# 83. Fetch Failure Test

Expected:

```json
{
  "success": false,
  "error": "..."
}
```

The application must not produce a fake audit score.

---

# 84. Language Test

Run:

```json
{
  "language": "fr"
}
```

then:

```json
{
  "language": "en"
}
```

The technical result should remain consistent.

Only human-readable report content should change language.

---

# 85. Regression Testing

API tests are important because the endpoint integrates all AIP engines.

A detector can work correctly in isolation while the complete pipeline still fails because of:

```text
Type mismatch

Orchestrator bug

Prompt issue

Scoring issue

Serialization issue

Error handling regression
```

End-to-end API testing protects the integration layer.

---

# 86. Build Validation

Before a Release Candidate, run:

```bash
npm run build
```

The build should complete successfully.

This verifies:

```text
Next.js compilation

TypeScript validation

Route compilation

Production build generation
```

A successful build is required before deployment.

---

# 87. Current V2 Routes

The application currently includes routes such as:

```text
/
```

Landing page.

```text
/audit
```

Audit interface.

```text
/api/agent
```

Main audit endpoint.

Development or testing routes may also exist during implementation.

Production relevance should be reviewed before final release.

---

# 88. API and Frontend

The `/audit` interface calls `/api/agent`.

Conceptually:

```text
User enters URL
      ↓
Start Audit
      ↓
POST /api/agent
      ↓
Loading State
      ↓
API Response
      ↓
Audit Results
```

The frontend should not duplicate backend audit logic.

---

# 89. Loading State

Because audits involve external network and AI calls, requests can take several seconds.

The frontend should therefore provide a clear loading state.

This prevents users from assuming the application has frozen.

---

# 90. Error State

When:

```text
success = false
```

the UI should display a controlled audit error.

For example:

```text
The website could not be analyzed.
```

Technical details can be displayed selectively depending on the product UX.

---

# 91. API Design Philosophy

The AIP API follows the same architectural philosophy as the rest of V2:

```text
Simple responsibilities

Structured data

Explicit failures

Deterministic business logic

Controlled AI usage

Extensible architecture
```

---

# 92. Current API Boundary

The API currently provides:

```text
Single URL audit

Static HTML analysis

Knowledge evaluation

Scoring

AI report generation
```

It does not yet provide:

```text
Persistent audit history

Authentication

Public API keys

Runtime browser analysis

Async job processing

PDF export endpoint

PowerPoint export endpoint
```

These belong to future product evolution.

---

# 93. Production Hardening Priorities

Before exposing AIP as a larger public SaaS API, the main hardening priorities include:

```text
SSRF protection

Rate limiting

Authentication

Request validation

Structured logging

Monitoring

AI cost controls

Runtime resource limits

Schema validation
```

These are architectural improvements rather than blockers for validating the V2 core engine.

---

# 94. End-to-End API Flow

The complete request lifecycle can be summarized as:

```text
CLIENT
  │
  │ POST /api/agent
  │
  ▼
API ROUTE
  │
  │ Validate Request
  │ Start Timer
  │
  ▼
API ORCHESTRATOR
  │
  ├────► Detection Engine
  │          │
  │          ▼
  │      Technical Evidence
  │
  ├────► Knowledge Engine
  │          │
  │          ▼
  │      Analytics Insights
  │
  ├────► Scoring Engine
  │          │
  │          ▼
  │      Score / 100
  │
  └────► AI Report Engine
             │
             ▼
        Structured Report
             │
             ▼
       COMPLETE AUDIT
             │
             ▼
          API ROUTE
             │
             │ executionTime
             │ success
             │
             ▼
           CLIENT
```

---

# 95. Summary

The AIP API provides the entry point to the complete Digital Analytics audit pipeline.

The endpoint:

```text
POST /api/agent
```

receives:

```text
URL
Language
```

and coordinates:

```text
Detection
Knowledge
Scoring
AI Report
```

through the API Orchestrator.

The API returns a structured audit containing:

```text
Technical evidence

Analytics insights

Category scores

Global score

AI-generated report

Execution metadata
```

The central principle is:

> **The API exposes the audit workflow, while the Orchestrator coordinates specialized engines without replacing their responsibilities.**

The complete backend flow is:

```text
API
 ↓
ORCHESTRATOR
 ↓
DETECTION
 ↓
KNOWLEDGE
 ↓
SCORING
 ↓
AI REPORT
 ↓
STRUCTURED RESPONSE
```

---

# Related Documentation

- [`architecture.md`](./architecture.md)
- [`detection-engine.md`](./detection-engine.md)
- [`knowledge-engine.md`](./knowledge-engine.md)
- [`scoring-engine.md`](./scoring-engine.md)
- [`ai-report-engine.md`](./ai-report-engine.md)
- [`testing.md`](./testing.md)
- [`limitations.md`](./limitations.md)
- [`roadmap.md`](./roadmap.md)

---

**AIP — Analytics Intelligence Platform**

**Analyze. Score. Improve.**