# AIP V2 — Knowledge Engine

## Technical Documentation

> **Detection establishes facts. Knowledge gives those facts meaning.**

---

# 1. Purpose

The **Knowledge Engine** is the interpretation layer of AIP.

While the Detection Engine answers:

> **What technologies and technical signals can AIP confirm?**

the Knowledge Engine answers:

> **What do these findings mean from a Digital Analytics perspective?**

Its responsibility is to transform structured technical detections into meaningful audit insights using deterministic rules.

The Knowledge Engine does not detect technologies itself.

It does not calculate the audit score.

It does not generate the final AI report.

---

# 2. Position in the AIP Architecture

The Knowledge Engine operates after technology detection and before scoring.

```text
Website
   │
   ▼
HTML Fetcher
   │
   ▼
Detection Engine
   │
   ▼
Structured Technical Evidence
   │
   ▼
Knowledge Engine
   │
   ▼
Analytics Insights
   │
   ├──────────────► Scoring Engine
   │
   └──────────────► AI Report Engine
```

This separation keeps technical evidence distinct from audit interpretation.

---

# 3. Core Principle

The Knowledge Engine follows a simple principle:

```text
FACTS
  +
DETERMINISTIC RULES
  =
AUDIT INSIGHTS
```

Example:

```text
FACT 1
Google Tag Manager detected

FACT 2
GA4 not directly detected

        ↓

KNOWLEDGE RULE

        ↓

INSIGHT
GA4 may be configured through GTM.
Runtime or container verification is recommended.
```

The Knowledge Engine does not change Fact 2 into:

```text
GA4 is absent
```

because the available evidence does not support that conclusion.

---

# 4. Why a Knowledge Engine?

Technology detection alone produces limited business value.

For example:

```text
GTM = true
GA4 = false
DataLayer = false
```

is technically useful, but an Analytics professional naturally asks:

```text
What does this combination mean?
```

Possible interpretation:

```text
GTM is present.

GA4 is not directly visible and may therefore
be configured inside GTM.

No DataLayer could be confirmed from static HTML.

Runtime verification is recommended.
```

The Knowledge Engine formalizes this reasoning.

---

# 5. Separation From Detection

The Detection Engine and Knowledge Engine have different responsibilities.

## Detection Engine

```text
What can be observed?
```

Examples:

```text
GTM detected
GA4 detected
DataLayer detected
Didomi detected
Meta Pixel detected
```

## Knowledge Engine

```text
What relationships or risks can be inferred
from those confirmed observations?
```

Examples:

```text
Multiple Tag Management Systems detected

GTM detected without directly visible GA4

Advertising technologies detected without
a supported CMP being confirmed
```

This separation is fundamental to AIP V2.

---

# 6. Separation From AI

Knowledge rules are deterministic.

They are implemented in application code.

The intended architecture is:

```text
Detection
    ↓
Knowledge Rules
    ↓
Structured Insights
    ↓
AI Report
```

not:

```text
Detection
    ↓
LLM invents audit rules
```

This provides:

- reproducibility;
- transparency;
- testability;
- easier debugging;
- controlled business logic.

---

# 7. Analytics Insight Model

Knowledge Engine findings use a structured format.

```ts
export type AnalyticsInsight = {
  key: string;
  severity: InsightSeverity;
  title: string;
  description: string;
  relatedTools: string[];
};
```

Each insight therefore contains:

```text
Unique Key
Severity
Title
Description
Related Technologies
```

---

# 8. Insight Severity

AIP supports four severity levels:

```ts
export type InsightSeverity =
  | "info"
  | "warning"
  | "success"
  | "critical";
```

Severity helps classify the importance and nature of an insight.

---

## Success

Used when AIP identifies a positive architecture signal.

Example:

```text
Google Tag Manager detected
```

---

## Info

Used for useful contextual information that does not necessarily represent a problem.

Example:

```text
GA4 may be configured through GTM.
```

---

## Warning

Used when an implementation deserves verification or may introduce risk.

Example:

```text
Multiple GTM containers detected.
```

---

## Critical

Used for situations with potentially significant Analytics, consent or governance impact.

Example:

```text
Advertising technologies detected
without a supported CMP being confirmed.
```

Severity does not replace professional judgment.

It helps prioritize audit findings.

---

# 9. Rule Evaluation

The Knowledge Engine evaluates the complete detection result.

Conceptually:

```ts
evaluateKnowledgeRules(
  detectionResult
)
```

The function receives:

```text
AnalyticsDetectionResult
```

and returns:

```text
AnalyticsInsight[]
```

---

# 10. Technology Presence Helper

Knowledge rules frequently need to determine whether a technology was confirmed.

Conceptually:

```ts
isDetected(tools, "gtm")
```

The helper checks:

```text
tool.key matches requested key

AND

tool.present = true
```

This prevents rules from treating a tool object with:

```text
present = false
```

as a positive detection.

---

# 11. Google Tag Manager Rule

When GTM is detected, AIP can generate a positive insight.

Example:

```text
Google Tag Manager detected
```

Interpretation:

```text
A Tag Management System is available
and can centralize Analytics and Marketing deployments.
```

This is classified as:

```text
success
```

The insight does not claim that the GTM container is correctly governed.

It only interprets the confirmed presence of GTM.

---

# 12. GTM Without Visible GA4

One of the most important Knowledge Engine rules is:

```text
GTM detected
+
GA4 not directly detected
```

This generates an informational insight.

Conceptually:

```text
GA4 may be configured through GTM.
```

Why?

Because GA4 tags configured inside GTM may not expose their Measurement ID in the initial HTML.

Therefore:

```text
GA4 not detected
        ≠
GA4 absent
```

Recommended next steps may include:

```text
GTM container inspection
Browser runtime analysis
Network analysis
```

---

# 13. Direct GA4 Implementation

Another useful architecture pattern is:

```text
GA4 detected
+
GTM not detected
```

This suggests a direct GA4 implementation.

For example:

```text
gtag.js
+
G-XXXXXXXXXX
+
no GTM container
```

The Knowledge Engine can produce:

```text
GA4 appears to be implemented directly.
```

This is a stronger conclusion because direct GA4 evidence exists.

---

# 14. GTM Without DataLayer

AIP can identify:

```text
GTM detected
+
DataLayer not confirmed
```

This produces a warning.

Example interpretation:

```text
Google Tag Manager is present,
but no DataLayer was identified in the static HTML.
```

However, the wording remains cautious because the DataLayer could:

- be initialized later;
- be generated dynamically;
- exist only on specific pages;
- become available after consent;
- use patterns not yet recognized by AIP.

Therefore runtime verification can be recommended.

---

# 15. Multiple Tag Management Systems

AIP can identify situations where both:

```text
Google Tag Manager
```

and:

```text
Adobe Experience Platform Launch
```

are detected.

This generates a governance warning.

Potential risks include:

- duplicate tracking;
- duplicated events;
- conflicting triggers;
- inconsistent governance;
- unclear ownership;
- measurement discrepancies.

The rule does not automatically state that a problem exists.

It states that the architecture deserves verification.

---

# 16. Multiple GTM Containers

The GTM detector can extract container IDs.

Example:

```text
GTM-AAAAAAA
GTM-BBBBBBB
```

When more than one container is confirmed, the Knowledge Engine can generate:

```text
Multiple GTM containers detected.
```

This is a warning because multiple containers may be intentional.

Possible legitimate scenarios include:

- regional containers;
- business-unit separation;
- migration periods;
- specialized applications.

Therefore the recommendation is verification rather than automatic condemnation.

---

# 17. Consent Management

AIP can detect supported Consent Management Platforms.

Current examples include:

```text
Didomi
OneTrust
Axeptio
Cookiebot
Generic supported consent signals
```

When a CMP is detected, the Knowledge Engine can recommend additional verification.

---

# 18. CMP and Consent Mode

A detected CMP does not automatically prove that Google Consent Mode is correctly configured.

Therefore the Knowledge Engine can generate:

```text
CMP detected: verify Consent Mode.
```

This distinction is important.

```text
CMP PRESENT
      ≠
CONSENT MODE CORRECTLY CONFIGURED
```

A professional audit may still need to verify:

```text
analytics_storage
ad_storage
ad_user_data
ad_personalization
default consent state
consent updates
```

Some of these checks require runtime analysis.

---

# 19. GA4 Without Supported CMP

When:

```text
GA4 detected
+
no supported CMP confirmed
```

AIP can generate a warning.

The correct interpretation is:

```text
GA4 was detected,
but AIP did not confirm a supported CMP
from the analyzed static evidence.
```

The Knowledge Engine should not state:

```text
The website has no CMP.
```

This distinction reflects the core AIP principle:

> **Not detected does not mean absent.**

---

# 20. Advertising Without Supported CMP

A stronger governance scenario is:

```text
Advertising technology detected
+
no supported CMP confirmed
```

Supported advertising technologies may include:

```text
Meta Pixel
LinkedIn Insight Tag
TikTok Pixel
Floodlight
```

This can generate a:

```text
critical
```

insight.

However, the wording must remain technically accurate.

AIP can say:

```text
Advertising technologies were detected,
but no supported CMP could be confirmed.
```

It should not automatically claim legal non-compliance.

Legal compliance requires broader context than static technical detection alone.

---

# 21. Advertising Technology Aggregation

The Knowledge Engine can group several advertising technologies into one logical condition.

Conceptually:

```text
Meta Pixel
   OR
LinkedIn Insight
   OR
TikTok Pixel
   OR
Floodlight

        ↓

Advertising technology detected
```

This allows rules to reason about technology families rather than individual products.

---

# 22. Consent Technology Aggregation

The same principle applies to CMPs.

Conceptually:

```text
Didomi
   OR
OneTrust
   OR
Axeptio
   OR
Generic Consent Detector

        ↓

Supported consent technology detected
```

This keeps knowledge rules easier to understand.

---

# 23. No Technology Confirmed

AIP also handles the scenario where no supported technology is confirmed.

This can happen because:

- the site genuinely exposes few Analytics signals;
- technologies load dynamically;
- consent blocks tracking;
- the website uses unsupported technologies;
- tracking is server-side;
- static HTML does not contain enough evidence.

The Knowledge Engine should therefore communicate uncertainty.

Correct:

```text
No supported Analytics or Tag Management
technology could be confirmed from the static HTML.
```

Incorrect:

```text
The website does not use Analytics.
```

---

# 24. The "Not Detected ≠ Absent" Rule

This principle is implemented across the Knowledge Engine.

```text
NOT DETECTED
      │
      ▼
INSUFFICIENT EVIDENCE
```

not:

```text
NOT DETECTED
      │
      ▼
CONFIRMED ABSENT
```

This protects the audit from overconfident conclusions.

---

# 25. Static Analysis Context

Knowledge rules must always be interpreted within the technical boundaries of AIP V2.

AIP currently analyzes primarily:

```text
Static HTML
```

It does not yet fully observe:

```text
Runtime JavaScript
Network requests
Consent interactions
Runtime cookies
SPA navigation
Runtime DataLayer changes
```

Therefore many Knowledge Engine descriptions explicitly recommend:

```text
Runtime verification
```

when appropriate.

---

# 26. Example — GTM Architecture

Detection:

```text
GTM
present = true

GA4
present = false

DataLayer
present = true
```

Knowledge interpretation:

```text
SUCCESS

Google Tag Manager detected.
```

```text
INFO

GA4 is not directly visible.
It may be configured through GTM.
```

No warning is generated for DataLayer absence because it was detected.

---

# 27. Example — Direct GA4

Detection:

```text
GA4
present = true

GTM
present = false
```

Knowledge interpretation:

```text
SUCCESS

GA4 appears to be implemented directly.
```

Evidence remains in the Detection Engine.

Interpretation remains in the Knowledge Engine.

---

# 28. Example — Advertising Governance

Detection:

```text
Meta Pixel
present = true

CMP
not confirmed
```

Knowledge interpretation:

```text
CRITICAL

Advertising technology was detected,
but no supported CMP could be confirmed
from the available static evidence.
```

The insight can recommend additional consent verification.

---

# 29. Example — Complex Tag Management

Detection:

```text
GTM
present = true

Adobe Launch
present = true
```

Knowledge interpretation:

```text
WARNING

Multiple Tag Management Systems detected.
```

Potential audit questions:

```text
Why are both systems required?

Which team owns each system?

Are tags duplicated?

Is this a migration architecture?

Are event definitions consistent?
```

The Knowledge Engine surfaces the question.

A human auditor can investigate further.

---

# 30. Related Tools

Each insight can reference the technologies involved.

Example:

```json
{
  "relatedTools": [
    "gtm",
    "ga4"
  ]
}
```

This is useful for:

- UI presentation;
- traceability;
- report generation;
- future filtering;
- future audit navigation.

---

# 31. Stable Insight Keys

Each insight uses a stable technical key.

Examples:

```text
gtm-detected

gtm-without-visible-ga4

ga4-direct-implementation

gtm-without-datalayer

multiple-tag-management-systems

multiple-gtm-containers

cmp-detected-consent-mode-check

ga4-without-consent

advertising-without-consent

no-analytics-tool-detected
```

Stable keys allow future application features such as:

- filtering;
- analytics;
- rule-specific UI components;
- regression tests;
- localization;
- audit comparisons.

---

# 32. Knowledge Rules and Scoring

Knowledge rules and scoring rules are related but separate.

Knowledge asks:

```text
What does this architecture mean?
```

Scoring asks:

```text
How many points should this evidence receive?
```

Example:

```text
GA4 detected

Knowledge:
Direct Analytics implementation identified.

Scoring:
Analytics category receives points.
```

The Knowledge Engine should not manipulate the score directly.

---

# 33. Knowledge Rules and AI Reporting

The AI Report Engine receives Knowledge Engine insights.

This gives the AI pre-interpreted business context.

Instead of forcing the AI to infer:

```text
GTM true
GA4 false
```

from scratch, AIP can provide:

```text
GA4 may be configured through GTM.
```

This reduces the amount of reasoning delegated to the LLM and helps maintain consistency.

---

# 34. Knowledge Engine as Domain Expertise

The Knowledge Engine represents an important part of AIP's Digital Analytics expertise.

AIP is not only a technology scanner.

The long-term objective is to encode increasingly rich Digital Analytics knowledge.

Examples:

```text
Tracking Architecture
Consent Governance
DataLayer Quality
Analytics Governance
Tag Management Governance
Advertising Governance
Measurement Quality
```

This is what progressively transforms AIP from a detector into an Analytics Intelligence Platform.

---

# 35. Rule Design Principles

A good Knowledge Engine rule should be:

### Evidence-Based

It must rely on structured Detection Engine results.

### Deterministic

The same evidence should trigger the same insight.

### Explainable

A human should understand why the rule triggered.

### Conservative

It should not turn missing evidence into certainty.

### Actionable

When appropriate, the insight should suggest what needs verification.

---

# 36. Avoiding Overstatement

Knowledge Engine wording is important.

Avoid:

```text
GA4 is not installed.
```

Prefer:

```text
GA4 was not directly detected.
```

Avoid:

```text
The site is not GDPR compliant.
```

Prefer:

```text
Advertising technologies were detected,
but no supported CMP could be confirmed.
Consent configuration should be reviewed.
```

Avoid:

```text
The DataLayer is bad.
```

Prefer:

```text
No structured DataLayer could be confirmed
from the available static evidence.
```

---

# 37. Runtime Verification

A recurring Knowledge Engine recommendation is runtime verification.

Runtime analysis can answer questions static analysis cannot.

Examples:

```text
Does GA4 fire after consent?

Which requests are sent?

What consent state is applied?

Which tags fire through GTM?

What exists in window.dataLayer after load?

Which cookies are created?

Does tracking change after consent?
```

These capabilities are planned for the Runtime Detection evolution.

---

# 38. V2 QA Findings

The V2 QA campaign validated the Knowledge Engine against several real-world architectures.

Validated scenarios included:

```text
GTM detected
GA4 direct implementation
CMP detected
Advertising technology detected
DataLayer detected
No supported technology confirmed
```

The campaign also validated the importance of cautious wording.

In particular:

> **Not detected does not mean absent.**

became a central product rule.

---

# 39. AI Overstatement Identified During QA

QA also identified cases where the AI report could phrase conclusions more strongly than the deterministic evidence justified.

Examples of risky language include:

```text
"guarantees active tracking"

"probably configured"

"implementation is incomplete"
```

when the available evidence does not fully prove those conclusions.

This reinforces the importance of the Knowledge Engine.

The deterministic layer should provide the strongest justified interpretation before the report reaches the AI.

---

# 40. Knowledge Engine Evolution

Future versions can expand the rule library.

Potential rule families include:

## GA4

```text
Consent Mode
Cross-domain tracking
E-commerce structure
Measurement ID governance
Event strategy
```

## GTM

```text
Container governance
Multiple containers
Naming conventions
Environment strategy
Tag duplication
```

## Adobe

```text
Adobe Analytics architecture
Adobe Launch relationships
Report Suite indicators
AppMeasurement patterns
```

## Consent

```text
Consent Mode v2
CMP configuration
Default consent state
Consent updates
Vendor relationships
```

## DataLayer

```text
Business event coverage
Variable consistency
E-commerce completeness
Naming quality
Data governance
```

---

# 41. Future Rule Model

As the Knowledge Engine grows, rules may eventually become more formally structured.

Conceptually:

```ts
interface KnowledgeRule {
  id: string;

  severity: InsightSeverity;

  conditions: RuleCondition[];

  title: string;

  description: string;

  relatedTools: string[];
}
```

This could make the rule system easier to:

- test;
- document;
- configure;
- version;
- localize.

The current V2 implementation remains intentionally simpler.

---

# 42. Localization

Knowledge Engine insights are currently closely tied to the application's report language strategy.

Future versions could separate:

```text
Rule Logic
    ↓
Insight Key
    ↓
Localization Layer
    ↓
French / English
```

This would allow the deterministic rules to remain language-independent.

---

# 43. Testing Strategy

Knowledge rules should eventually receive dedicated automated tests.

Example:

```text
INPUT

GTM = true
GA4 = false

EXPECTED

gtm-detected
gtm-without-visible-ga4
```

Another example:

```text
INPUT

GTM = true
Adobe Launch = true

EXPECTED

multiple-tag-management-systems
```

This would provide strong regression protection as the rule library grows.

---

# 44. Adding a Knowledge Rule

When adding a rule:

```text
1. Identify the technical facts required.

2. Verify that those facts are produced
   by the Detection Engine.

3. Define the interpretation.

4. Choose the appropriate severity.

5. Write conservative wording.

6. Add related tool keys.

7. Test positive scenario.

8. Test negative scenario.

9. Verify AI report behavior.

10. Verify that scoring remains independent.
```

---

# 45. Knowledge Rule Checklist

```text
[ ] Based on structured evidence

[ ] Does not perform new technology detection

[ ] Deterministic

[ ] Severity justified

[ ] Wording does not overstate evidence

[ ] Related technologies included

[ ] Does not directly modify scoring

[ ] Static-analysis limitations considered

[ ] Positive scenario tested

[ ] Negative scenario tested
```

---

# 46. Knowledge Engine Boundary

The Knowledge Engine should interpret evidence.

It should not become:

```text
another Detection Engine
```

and it should not become:

```text
another AI Report Engine
```

Its architectural boundary is:

```text
STRUCTURED FACTS
       ↓
DOMAIN RULES
       ↓
STRUCTURED INSIGHTS
```

---

# 47. Why the Knowledge Engine Matters

Without the Knowledge Engine:

```text
AIP = Technology Scanner
```

With the Knowledge Engine:

```text
AIP = Technology Scanner
        +
      Digital Analytics Reasoning
```

This is one of the most important architectural evolutions from AIP V1 to AIP V2.

---

# 48. Long-Term Direction

The Knowledge Engine can progressively become a reusable Digital Analytics knowledge base.

Future capabilities may include:

```text
Implementation Best Practices

Governance Rules

Consent Rules

Measurement Architecture Rules

DataLayer Quality Rules

E-commerce Rules

Analytics Maturity Rules

Industry-Specific Rules
```

The long-term objective is not simply to detect more technologies.

It is to understand more about the quality and implications of the detected architecture.

---

# 49. Summary

The Knowledge Engine transforms structured technical evidence into Digital Analytics insights.

```text
Detection Engine
      │
      ▼
Technical Facts
      │
      ▼
Knowledge Rules
      │
      ▼
Structured Insights
      │
      ├────► Scoring Context
      │
      └────► AI Report
```

Its role can be summarized as:

> **Detection tells AIP what is observable. Knowledge tells AIP what those observations mean.**

---

# Related Documentation

- [`architecture.md`](./architecture.md)
- [`detection-engine.md`](./detection-engine.md)
- [`scoring-engine.md`](./scoring-engine.md)
- [`ai-report-engine.md`](./ai-report-engine.md)
- [`api.md`](./api.md)
- [`testing.md`](./testing.md)
- [`limitations.md`](./limitations.md)
- [`roadmap.md`](./roadmap.md)

---

**AIP — Analytics Intelligence Platform**

**Analyze. Score. Improve.**