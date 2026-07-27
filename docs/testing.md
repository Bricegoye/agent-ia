# AIP V2 — Testing & Non-Regression Strategy

## Technical Documentation

> **A release is not validated because it builds. It is validated because its critical behavior remains predictable across representative real-world cases.**

---

# 1. Purpose

This document defines the testing and non-regression strategy for **Analytics Intelligence Platform V2**.

The objective is to validate the complete audit pipeline:

```text
Website
   ↓
HTML Fetch
   ↓
Detection
   ↓
Knowledge
   ↓
Scoring
   ↓
AI Report
   ↓
API Response
```

Testing must verify both:

```text
Technical correctness
```

and:

```text
Audit consistency
```

---

# 2. Testing Philosophy

AIP analyzes real websites.

Real websites are unpredictable.

They can use:

```text
Static tags
Dynamic tags
Tag Managers
Consent platforms
Server-side tracking
CDNs
Anti-bot protection
JavaScript rendering
Custom DataLayers
Multiple Analytics technologies
```

Testing AIP only against synthetic HTML would therefore be insufficient.

The V2 strategy combines:

```text
Build validation
+
Technical tests
+
Real-world website tests
+
Non-regression tests
+
Manual audit review
```

---

# 3. Testing Layers

AIP testing can be divided into several levels.

```text
LEVEL 1
Build & TypeScript

LEVEL 2
Detector validation

LEVEL 3
Knowledge rules

LEVEL 4
Scoring

LEVEL 5
AI report

LEVEL 6
API integration

LEVEL 7
Real-world non-regression
```

Each layer protects a different part of the architecture.

---

# 4. Build Validation

Before testing the application, run:

```bash
npm run build
```

Expected result:

```text
Compiled successfully

TypeScript completed

Static pages generated

Production build finalized
```

A successful build validates:

```text
Next.js compilation
TypeScript compatibility
Imports
Application routes
Production bundling
```

---

# 5. Current Application Routes

A successful production build should include the main routes.

Example:

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

Main audit API.

Additional development routes may exist depending on the current branch.

---

# 6. Build Is Necessary but Not Sufficient

A successful build does not prove that AIP works correctly.

For example:

```text
Detector returns false positive
```

can still compile.

Likewise:

```text
Incorrect scoring
```

can still compile.

Therefore:

```text
BUILD SUCCESS
      ≠
RELEASE VALIDATED
```

Build validation is only the first gate.

---

# 7. Local Development Test

Start the development server:

```bash
npm run dev
```

Then test the audit endpoint.

Example:

```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "language": "fr"
  }' | python3 -m json.tool
```

---

# 8. What to Inspect

For each successful audit, inspect:

```text
success

url

executionTime

detection

knowledge

scoring

report
```

Depending on the exact API contract, property names may vary slightly.

The important point is to inspect the complete pipeline.

---

# 9. Detection Validation

For each detected technology, verify:

```text
Is the technology actually expected?

Is present correct?

Are IDs plausible?

Is evidence relevant?

Is certainty justified?

Is the detector relying on a strong signal?
```

The objective is to minimize both:

```text
False positives
```

and:

```text
False negatives
```

---

# 10. Detector Test Example

Suppose the response contains:

```json
{
  "key": "gtm",
  "present": true,
  "ids": [
    "GTM-XXXXXXX"
  ],
  "certainty": "Élevé"
}
```

Validation questions:

```text
Can the GTM identifier be found in the retrieved evidence?

Is the identifier format correct?

Could the signal come from documentation or unrelated text?

Is high certainty justified?
```

---

# 11. False Positive Testing

False positives are particularly dangerous because they create incorrect audit facts.

Example:

```text
HTML contains the word "analytics"
```

This should not automatically become:

```text
Google Analytics detected
```

Detection should rely on technology-specific evidence.

---

# 12. False Negative Testing

False negatives are also possible.

Example:

```text
GA4 loaded dynamically through GTM
```

Static HTML analysis may not expose:

```text
G-XXXXXXXXXX
```

AIP should therefore report:

```text
Not detected
```

rather than:

```text
Definitely absent
```

This distinction must also be preserved by the AI report.

---

# 13. Knowledge Engine Validation

Knowledge rules should be tested independently from detection.

Example:

```text
GTM = true
GA4 = false
```

Expected insight:

```text
GA4 may be configured through GTM.
```

The rule should not claim:

```text
GA4 is absent.
```

---

# 14. Multiple Tag Management Test

Input:

```text
GTM = true
Adobe Launch = true
```

Expected:

```text
Warning:
Multiple Tag Management Systems detected
```

The recommendation should focus on governance and possible duplication.

---

# 15. GTM Without DataLayer Test

Input:

```text
GTM = true
DataLayer = false
```

Expected:

```text
Warning:
GTM detected without identifiable DataLayer
```

The wording must preserve static-analysis uncertainty.

---

# 16. CMP Test

Input:

```text
Didomi = true
```

Expected:

```text
CMP detected
```

and an insight recommending verification of Consent Mode when relevant.

It should not automatically claim:

```text
Consent Mode v2 is correctly configured.
```

---

# 17. Advertising Without CMP Test

Input:

```text
Meta Pixel = true
CMP = false
```

Expected:

```text
Critical or high-priority consent/governance insight
```

The wording should remain technical and cautious.

It should not present AIP as a legal compliance certification system.

---

# 18. Scoring Validation

The Scoring Engine must produce deterministic results.

For identical input:

```text
Detection A
```

the expected result is always:

```text
Score A
```

Repeated executions must not randomly change the score.

---

# 19. Global Score Boundary

The global score must remain:

```text
0 ≤ score ≤ 100
```

A score such as:

```text
105 / 100
```

is invalid.

---

# 20. Category Boundaries

Each V2 category has a maximum of:

```text
20
```

The categories are:

```text
Analytics

Tag Management

Consent

Marketing

Data Quality
```

No category should exceed its configured maximum.

---

# 21. Scoring Consistency

If several rules contribute to the same category, the category cap must still apply.

Example:

```text
Potential points = 30

Category maximum = 20
```

Expected:

```text
20 / 20
```

---

# 22. Data Quality Testing

Data Quality requires dedicated regression testing.

Suggested scenarios:

```text
No DataLayer

DataLayer only

DataLayer with GTM internal events

DataLayer with business events

DataLayer with standard variables

DataLayer with e-commerce structure

Rich DataLayer
```

---

# 23. Internal GTM Events Test

Input:

```text
gtm.js
gtm.dom
gtm.load
```

Expected interpretation:

```text
Technical DataLayer activity
```

but not:

```text
Rich business DataLayer
```

This distinction protects Data Quality scoring.

---

# 24. Business Event Test

A DataLayer containing events such as:

```text
purchase

add_to_cart

generate_lead

form_submit
```

provides stronger business measurement evidence than one containing only GTM lifecycle events.

The Data Quality score should reflect this difference.

---

# 25. Standard Variable Test

Examples of useful variables include:

```text
page_name

page_type

user_status

transaction_id

currency

value

search_term
```

A richer structured DataLayer should generally receive stronger Data Quality evaluation.

---

# 26. E-commerce Test

Example signals:

```text
ecommerce

items

item_id

item_name

quantity

price
```

Expected:

```text
E-commerce structure identified
```

without claiming that the complete purchase tracking implementation is necessarily correct.

---

# 27. AI Report Validation

The AI report should be checked against the deterministic audit data.

Review:

```text
Executive Summary

Strengths

Weaknesses

Recommendations

Priority Actions

Technical Analysis
```

---

# 28. AI Hallucination Test

The most important AI test is:

```text
Does the report mention technologies
that were not detected?
```

If yes, investigate whether the statement is:

```text
A recommendation
```

or:

```text
An invented fact
```

Invented facts are regressions.

---

# 29. AI Identifier Test

The AI must not invent:

```text
GTM IDs

GA4 Measurement IDs

Adobe Report Suites

Pixel IDs
```

Identifiers mentioned as facts must come from the Detection Engine.

---

# 30. AI Score Test

If the Scoring Engine returns:

```text
65 / 100
```

the AI must not report:

```text
75 / 100
```

The deterministic score is authoritative.

---

# 31. AI Uncertainty Test

When a technology is not detected, inspect the wording.

Correct:

```text
No GA4 Measurement ID was identified
in the analyzed static HTML.
```

Incorrect:

```text
The website does not use GA4.
```

This is one of the most important non-regression checks.

---

# 32. French Language Test

Run an audit with:

```json
{
  "language": "fr"
}
```

Expected:

```text
Human-readable report content in French
```

Technical names remain unchanged.

Examples:

```text
Google Tag Manager
GA4
DataLayer
Consent Mode
```

---

# 33. English Language Test

Run the same audit with:

```json
{
  "language": "en"
}
```

Expected:

```text
Human-readable report content in English
```

The underlying technical detections and scores should remain consistent.

---

# 34. Language Consistency

Changing:

```text
fr
```

to:

```text
en
```

should not change:

```text
Detected technologies

IDs

Certainty

Category scores

Global score
```

Only report language should change.

---

# 35. API Integration Test

The API test validates all engines together.

```text
Request
   ↓
Route
   ↓
Orchestrator
   ↓
Detection
   ↓
Knowledge
   ↓
Scoring
   ↓
AI Report
   ↓
Response
```

This is one of the most important Release Candidate tests.

---

# 36. Representative Website Strategy

AIP V2 uses a small but representative real-world test campaign.

The objective is not to test hundreds of websites.

The objective is to test several different Analytics architectures.

The campaign should contain approximately:

```text
5–6 representative sites
```

---

# 37. Required Test Profiles

The Release Candidate campaign should include:

```text
1. GTM / GA4 site

2. Adobe-oriented site

3. CMP / Didomi site

4. Rich DataLayer site

5. Low-signal site

6. Fetch-failure site
```

One website may cover more than one profile.

---

# 38. GTM / GA4 Profile

Purpose:

```text
Validate Google ecosystem detection.
```

Inspect:

```text
GTM

GA4

Measurement IDs

DataLayer

Knowledge rules

Analytics score

Tag Management score
```

A known site where the implementation has previously produced useful AIP results should be preferred.

---

# 39. Direct GA4 Profile

A site with GA4 implemented directly in the page is especially useful.

Expected:

```text
GA4 detected

GTM potentially not detected
```

Possible Knowledge Engine insight:

```text
GA4 appears to be implemented directly.
```

This validates the distinction between:

```text
Direct GA4
```

and:

```text
GA4 through GTM
```

---

# 40. Adobe Profile

Purpose:

```text
Validate Adobe-related detectors.
```

Possible signals include:

```text
Adobe Analytics

Adobe Experience Platform Launch
```

The test should verify that Adobe technologies are not confused with generic JavaScript assets.

---

# 41. CMP / Didomi Profile

Purpose:

```text
Validate consent technology detection.
```

A known Didomi implementation is particularly useful.

Inspect:

```text
Didomi detection

CMP category

Consent insights

AI wording

Consent score
```

---

# 42. Rich DataLayer Profile

Purpose:

```text
Validate Data Quality logic.
```

Inspect:

```text
DataLayer presence

Business events

Standard variables

E-commerce variables

Consent signals

Data Quality score
```

This test protects one of the most sophisticated areas of AIP V2.

---

# 43. Low-Signal Profile

Purpose:

```text
Validate conservative behavior.
```

A low-signal site should not cause AIP to invent technologies simply to populate the report.

Expected:

```text
Limited detections

Conservative scoring

Cautious report

Runtime verification recommendations
```

---

# 44. Fetch-Failure Profile

Purpose:

```text
Validate infrastructure failure handling.
```

Some real websites block server-side requests.

Examples observed during V2 development included sites returning:

```text
HTTP 403 Forbidden
```

behind anti-bot infrastructure.

---

# 45. Expected Fetch-Failure Behavior

Expected:

```json
{
  "success": false,
  "error": "Unable to fetch ..."
}
```

Not:

```text
Score = 0
```

Not:

```text
No Analytics detected
```

Not:

```text
AI-generated audit based on guesses
```

---

# 46. Cloudflare Case

A typical blocked response can expose:

```text
status: 403

statusText: Forbidden

server: cloudflare
```

This should be interpreted as:

```text
Access blocked
```

not:

```text
Website contains no Analytics technologies
```

---

# 47. Fetch Diagnostic Validation

When fetch fails, inspect server logs.

Useful information includes:

```text
requestedUrl

finalUrl

status

statusText

redirected

contentType

server

htmlSize
```

This helps distinguish:

```text
Real website HTML
```

from:

```text
Anti-bot block page
```

---

# 48. Regression Severity Levels

Issues discovered during Release Candidate testing should be classified.

A simple model is:

```text
P0 — Blocker

P1 — Critical

P2 — Important

P3 — Minor
```

---

# 49. P0 — Blocker

Examples:

```text
Application cannot build

/api/agent completely broken

All audits fail

Scoring crashes

Major security issue

Production deployment impossible
```

A P0 blocks release.

---

# 50. P1 — Critical

Examples:

```text
Major detector produces systematic false positives

Score fundamentally incorrect

AI invents technologies systematically

Successful sites are interpreted as fetch failures

Core audit output unusable
```

A serious unresolved P1 should normally block Release Candidate validation.

---

# 51. P2 — Important

Examples:

```text
Specific detector edge case

Report wording occasionally too strong

One category slightly inconsistent

Unsupported website architecture

Non-critical UI issue
```

A P2 may be accepted if documented and planned for a future version.

---

# 52. P3 — Minor

Examples:

```text
Formatting issue

Small wording issue

Minor spacing issue

Non-blocking diagnostic inconsistency
```

P3 issues generally do not block release.

---

# 53. Release Candidate Rule

The V2 functional code can be frozen when:

```text
Build passes

Core API works

Representative sites are tested

No unresolved P0 exists

No serious unresolved P1 exists

Known limitations are documented
```

At that point:

```text
Functional Development
        ↓
Release Candidate
        ↓
Documentation
        ↓
Deployment
```

---

# 54. What Code Freeze Means

Code freeze does not mean:

```text
The software is perfect.
```

It means:

```text
The current feature scope is stable enough
to stop adding functionality before release.
```

After freeze, changes should focus on:

```text
Release blockers

Documentation

Deployment

Critical regressions
```

---

# 55. What Should Not Happen During Freeze

Avoid adding major new features such as:

```text
New detector families

Playwright

Authentication

Audit history

PDF generation

New scoring model
```

during Release Candidate stabilization.

Those belong to the next roadmap phase.

---

# 56. Non-Regression Table

A simple campaign table can be maintained.

```text
┌──────────────────────┬──────────────────────┬──────────┐
│ Test Profile         │ Main Validation      │ Status   │
├──────────────────────┼──────────────────────┼──────────┤
│ GTM / GA4            │ Google detection     │ ⏳       │
│ Adobe                │ Adobe detection      │ ⏳       │
│ CMP / Didomi         │ Consent detection    │ ⏳       │
│ Rich DataLayer       │ Data Quality         │ ⏳       │
│ Low Signal           │ Conservative audit   │ ⏳       │
│ Fetch Failure        │ Error handling       │ ⏳       │
└──────────────────────┴──────────────────────┴──────────┘
```

Statuses can be changed to:

```text
PASS
FAIL
KNOWN LIMITATION
```

after validation.

---

# 57. Test Record

For each site, record:

```text
URL

Date

Expected profile

HTTP result

Main detections

Global score

Important insights

AI report quality

Result

Notes
```

This creates a useful Release Candidate test history.

---

# 58. Example Test Record

```text
URL:
https://example.com

Profile:
GTM / GA4

Fetch:
PASS

Expected:
GTM detected

Observed:
GTM detected

Knowledge:
PASS

Scoring:
PASS

AI:
PASS

Result:
PASS
```

---

# 59. Known-Site Testing

When possible, use sites whose implementation is already partly known.

This provides stronger validation than random websites.

For example, if the tester knows that a site contains:

```text
Direct GA4
```

the site becomes a useful detector reference case.

---

# 60. Why Random Sites Are Not Enough

A random site can produce:

```text
No GA4 detected
```

but without independent knowledge we may not know whether this means:

```text
Correct negative
```

or:

```text
False negative
```

Known implementation examples are therefore valuable for detector validation.

---

# 61. Real-World Variability

Even known websites can change.

A company may:

```text
Change CMP

Change GTM container

Move to server-side tracking

Deploy new consent logic

Change CDN

Enable anti-bot protection
```

Therefore test expectations should be reviewed when a real site changes.

---

# 62. External Website Tests Are Not Permanent Fixtures

Public websites should not be treated as perfectly stable automated fixtures.

They are better suited to:

```text
Manual regression

Release validation

Exploratory testing
```

Stable automated unit tests should use controlled input fixtures.

---

# 63. Future HTML Fixtures

A future automated test suite should include stored HTML fixtures.

Example:

```text
fixtures/
├── ga4-direct.html
├── gtm.html
├── adobe-launch.html
├── didomi.html
├── datalayer-rich.html
└── no-analytics.html
```

These provide deterministic detector tests.

---

# 64. Why Fixtures Matter

If a public website changes tomorrow, an automated test could fail even though AIP code is correct.

Fixtures provide:

```text
Stable input
+
Known expected output
```

This makes them ideal for unit and regression testing.

---

# 65. Future Detector Unit Tests

Example:

```ts
expect(
  detectGA4(ga4Fixture)
).toMatchObject({
  present: true
});
```

Each detector should eventually have:

```text
Positive cases

Negative cases

Edge cases

False-positive cases
```

---

# 66. Future Knowledge Unit Tests

Knowledge rules are deterministic and easy to test.

Example:

```text
INPUT

GTM = true
GA4 = false
```

Expected:

```text
gtm-without-visible-ga4
```

Another:

```text
GTM = true
Adobe Launch = true
```

Expected:

```text
multiple-tag-management-systems
```

---

# 67. Future Scoring Unit Tests

Scoring tests should validate:

```text
Rule points

Certainty thresholds

Category maximums

Global maximum

Data Quality progression
```

Because scoring is deterministic, expected values can be exact.

---

# 68. Future AI Engine Tests

AI generation itself is probabilistic.

However, the Report Engine wrapper can still be tested deterministically using a mock AI client.

Tests can cover:

```text
Valid JSON

Invalid JSON

Missing fields

Empty fields

Parsing errors

Validation errors
```

---

# 69. Prompt Evaluation

AI report quality requires a different type of testing.

A prompt evaluation dataset could contain:

```text
Audit Input

Expected facts

Forbidden claims

Required recommendations

Expected language
```

The generated report can then be reviewed against these constraints.

---

# 70. Forbidden Claim Testing

For each audit, define statements that must not appear.

Example:

```text
Detection:
GA4 not detected
GTM detected
```

Forbidden:

```text
"GA4 is definitely not installed."
```

Allowed:

```text
"GA4 could not be confirmed from static HTML."
```

This is useful for AI regression testing.

---

# 71. Recommendation Grounding Test

Every recommendation should ideally connect to evidence.

Example:

```text
Recommendation:
Implement a structured DataLayer.
```

Expected supporting evidence:

```text
DataLayer absent
```

or:

```text
DataLayer quality limited
```

Recommendations should not be random generic advice unrelated to the audit.

---

# 72. Priority Action Test

Priority actions should be:

```text
Actionable

Limited

Relevant

Ordered
```

The report prompt currently requests a maximum of:

```text
5
```

priority actions.

---

# 73. UI Validation

The audit UI should also be tested manually.

Inspect:

```text
Loading state

Successful result

Score display

Category scores

Detection status

AI recommendations

Error state
```

The UI should reflect API results without recalculating business logic.

---

# 74. Landing Page Validation

Before release, validate:

```text
Navbar

Hero

Dashboard Preview

Features

How It Works

Start Audit CTA
```

The landing page should clearly separate:

```text
Product presentation
```

from:

```text
Actual URL audit
```

---

# 75. Audit Page Validation

The dedicated `/audit` route should allow users to:

```text
Enter URL

Start audit

Understand loading state

Receive audit results

Understand fetch errors
```

This separation improves the SaaS product experience.

---

# 76. Responsive Scope

Advanced responsive refinement is not part of the core V2 Release Candidate scope.

Detailed responsive optimization can be handled in a subsequent UI roadmap.

The V2 release should still remain usable, but pixel-perfect responsive refinement is not a release blocker unless it makes the application unusable.

---

# 77. Deployment Validation

After local Release Candidate validation, deploy to Vercel.

Then repeat a reduced smoke-test campaign against the production URL.

At minimum test:

```text
Landing page

/audit

One successful audit

One fetch failure

French report

Production environment variables
```

---

# 78. Production Build vs Local Development

Some issues appear only in production.

Possible causes:

```text
Environment variables

Network restrictions

Serverless timeout

Different Node runtime

External API configuration
```

Therefore local success does not replace production smoke testing.

---

# 79. Environment Validation

Verify that required production environment variables are configured.

Do not expose their values.

Examples can include:

```text
AI API credentials

Model configuration
```

The production deployment should never rely on `.env.local` being uploaded.

---

# 80. Git Validation

Before release:

```bash
git status
```

Expected:

```text
nothing to commit, working tree clean
```

Then ensure the Release Candidate branch is pushed.

Example:

```bash
git push origin v2-analytics-engine
```

---

# 81. Documentation Validation

Before release, confirm the documentation set exists.

```text
README.md

docs/
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

Documentation is part of the Release Candidate.

---

# 82. Final RC Checklist

```text
[ ] npm run build passes

[ ] Landing page works

[ ] /audit works

[ ] /api/agent works

[ ] Detection Engine validated

[ ] Knowledge Engine validated

[ ] Scoring Engine validated

[ ] AI Report validated

[ ] FR report validated

[ ] EN report validated

[ ] Fetch failure validated

[ ] No unresolved P0

[ ] No serious unresolved P1

[ ] Known limitations documented

[ ] README updated

[ ] Technical documentation complete

[ ] Git working tree clean

[ ] Branch pushed

[ ] Vercel deployment tested
```

---

# 83. Release Decision

The final Release Candidate decision should answer:

```text
Does AIP reliably execute its V2 scope?
```

Not:

```text
Can AIP analyze every website perfectly?
```

The latter is unrealistic for a static Analytics audit engine.

---

# 84. V2 Success Criteria

AIP V2 can be considered successful when it demonstrates:

```text
Modular architecture

Multi-technology detection

Deterministic knowledge rules

Deterministic scoring

Structured AI reporting

Controlled uncertainty

Dedicated audit UX

Stable API orchestration

Documented limitations

Successful production deployment
```

---

# 85. What V2 Does Not Need to Prove

V2 does not need to prove:

```text
Perfect detection on every website

Complete runtime tracking validation

Legal compliance certification

Server-side tracking visibility

Complete anti-bot bypass

Production-scale multi-user SaaS architecture
```

These belong to later stages of the platform.

---

# 86. Regression Rule

Once the Release Candidate is validated:

> **Any modification to Detection, Knowledge, Scoring, Prompt or API orchestration should trigger targeted non-regression testing before release.**

This protects the core audit contract.

---

# 87. Recommended Test Sequence

For future releases:

```text
1. npm run build

2. Detector tests

3. Knowledge tests

4. Scoring tests

5. API integration test

6. AI report review

7. Representative websites

8. UI smoke test

9. Production smoke test
```

This sequence moves from cheap deterministic tests toward more expensive external tests.

---

# 88. Testing Principle

The most important testing principle in AIP is:

```text
OBSERVED
   ≠
ASSUMED
```

The test process must verify that AIP reports what the evidence supports rather than what the system expects to find.

This applies equally to:

```text
Detection

Knowledge

Scoring

AI reporting
```

---

# 89. Summary

AIP V2 uses a layered validation strategy.

```text
BUILD
  ↓
DETECTORS
  ↓
KNOWLEDGE
  ↓
SCORING
  ↓
AI REPORT
  ↓
API
  ↓
REAL WEBSITES
  ↓
UI
  ↓
PRODUCTION
```

The Release Candidate campaign focuses on representative profiles:

```text
GTM / GA4

Adobe

CMP / Didomi

Rich DataLayer

Low Signal

Fetch Failure
```

The release can proceed when:

```text
Build passes

Core pipeline works

No P0 remains

No serious P1 remains

Known limitations are documented
```

The objective is not perfection.

The objective is a **stable, explainable and technically credible AIP V2 baseline** that can safely serve as the foundation for future runtime analysis and SaaS capabilities.

---

# Related Documentation

- [`architecture.md`](./architecture.md)
- [`detection-engine.md`](./detection-engine.md)
- [`knowledge-engine.md`](./knowledge-engine.md)
- [`scoring-engine.md`](./scoring-engine.md)
- [`ai-report-engine.md`](./ai-report-engine.md)
- [`api.md`](./api.md)
- [`limitations.md`](./limitations.md)
- [`roadmap.md`](./roadmap.md)

---

**AIP — Analytics Intelligence Platform**

**Analyze. Score. Improve.**