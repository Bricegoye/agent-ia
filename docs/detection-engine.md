# AIP V2 — Detection Engine

## Technical Documentation

> **Detection establishes facts. Interpretation comes later.**

---

# 1. Purpose

The **Detection Engine** is the technical evidence layer of AIP.

Its responsibility is to analyze the HTML retrieved from an audited website and identify supported Digital Analytics, Tag Management, Consent, Advertising and Data Architecture technologies.

The Detection Engine answers one primary question:

> **What can AIP technically confirm from the available evidence?**

It does not calculate the audit score.

It does not generate recommendations.

It does not ask the AI model to guess which technologies are installed.

Its responsibility is detection.

---

# 2. Position in the AIP Architecture

The Detection Engine operates immediately after the HTML Fetcher.

```text
Website URL
     │
     ▼
HTML Fetcher
     │
     ▼
Detection Engine
     │
     ├── Technology Detection
     ├── Identifiers
     ├── Evidence
     ├── Confidence
     ├── Implementation Details
     └── Raw Signals
     │
     ▼
Knowledge Engine
```

Its output becomes the technical foundation for the rest of the audit.

---

# 3. Core Principle

AIP follows an evidence-based detection model.

```text
Observable Signal
      ↓
Detector
      ↓
Validation
      ↓
Structured Detection
```

A technology should not be considered confirmed simply because its name appears somewhere in the HTML.

The detector should look for meaningful technical patterns.

Examples include:

```text
Script URLs
Measurement IDs
Container IDs
JavaScript objects
Initialization calls
Tracking functions
Known vendor domains
DataLayer structures
```

---

# 4. Detection Result Model

AIP uses a common data structure for technology detections.

```ts
export type AnalyticsToolDetection = {
  name: string;
  key: string;
  vendor: string;
  category: ToolCategory;
  documentationUrl: string;
  description: string;

  present: boolean;

  status: DetectionStatus;

  ids: string[];

  evidence: string[];

  sources: string[];

  certainty: CertaintyLevel;

  details?: Record<string, unknown>;
};
```

Using a shared structure allows all downstream engines to consume technology results consistently.

---

# 5. Tool Categories

AIP currently supports the following technology categories:

```ts
export type ToolCategory =
  | "Analytics"
  | "Tag Management"
  | "Consent"
  | "Advertising"
  | "UX Analytics"
  | "A/B Testing"
  | "DataLayer"
  | "Other";
```

These categories are used by:

- Detection Engine;
- Knowledge Engine;
- Scoring Engine;
- Audit interface;
- AI Report Engine.

---

# 6. Detection Status

A detection can use one of the following statuses:

```ts
export type DetectionStatus =
  | "Détecté directement"
  | "Possiblement chargé via GTM"
  | "Non détecté";
```

These statuses provide more information than a simple Boolean.

---

## Direct Detection

```text
Détecté directement
```

means that AIP found direct technical evidence.

Example:

```text
https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX
```

---

## Potential GTM Loading

```text
Possiblement chargé via GTM
```

can be used when the technology is not directly visible but the architecture suggests that it may be deployed through Google Tag Manager.

This should not be treated as confirmed detection.

---

## Not Detected

```text
Non détecté
```

means:

> AIP did not find sufficient evidence using the current detector and available analysis method.

It does **not** mean:

> The technology is definitely absent from the website.

---

# 7. Confidence Levels

AIP uses three confidence levels:

```ts
export type CertaintyLevel =
  | "Élevé"
  | "Moyen"
  | "Faible";
```

Confidence represents the strength of the available evidence.

Conceptually:

```text
Strong unique identifier
        ↓
Élevé

Several compatible signals
        ↓
Moyen

Weak or indirect evidence
        ↓
Faible
```

Confidence can also be consumed by the Scoring Engine.

For example, a scoring rule can require:

```text
minimumCertainty = Moyen
```

before awarding points.

---

# 8. Detector Architecture

AIP uses specialized detectors.

Conceptually:

```text
HTML
 │
 ├── GTM Detector
 │
 ├── GA4 Detector
 │
 ├── Adobe Analytics Detector
 │
 ├── Adobe Launch Detector
 │
 ├── Consent Detectors
 │
 ├── Marketing Detectors
 │
 ├── DataLayer Detector
 │
 └── Other Detectors
 │
 ▼
AnalyticsToolDetection[]
```

Each detector focuses on one technology or technical family.

This makes the system easier to:

- maintain;
- test;
- extend;
- debug.

---

# 9. Detector Registry

The detectors are executed through a centralized detector registry.

Conceptually:

```ts
runDetectors(html)
```

The registry executes the available detectors and returns a unified array:

```ts
AnalyticsToolDetection[]
```

This means the Detection Engine does not need to understand the internal implementation of every detector.

---

# 10. Google Tag Manager Detection

The GTM detector searches for recognizable Google Tag Manager patterns.

Typical evidence includes:

```text
googletagmanager.com/gtm.js
GTM-XXXXXXX
```

A successful detection can produce:

```json
{
  "name": "Google Tag Manager",
  "key": "gtm",
  "vendor": "Google",
  "category": "Tag Management",
  "present": true,
  "ids": [
    "GTM-XXXXXXX"
  ],
  "certainty": "Élevé"
}
```

Container IDs are useful for both technical auditing and governance analysis.

---

# 11. Multiple GTM Containers

AIP can detect multiple GTM container IDs.

Example:

```text
GTM-AAAAAAA
GTM-BBBBBBB
```

This information can later trigger a Knowledge Engine insight.

The Detection Engine only establishes:

```text
Multiple IDs detected
```

The Knowledge Engine interprets the potential governance risk.

---

# 12. Google Analytics 4 Detection

The GA4 detector searches for signals such as:

```text
G-XXXXXXXXXX
googletagmanager.com/gtag/js
gtag("config", ...)
```

Example direct implementation:

```html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX">
</script>
```

followed by:

```js
gtag("config", "G-XXXXXXXXXX");
```

This represents strong direct evidence.

---

# 13. GA4 Through GTM

A common scenario is:

```text
GTM detected
GA4 Measurement ID not visible
```

This does not prove GA4 is absent.

The Detection Engine reports the available evidence.

The Knowledge Engine can later produce:

```text
GA4 may be configured through GTM.
```

This separation prevents the detector from turning an assumption into a fact.

---

# 14. Adobe Analytics Detection

AIP supports Adobe Analytics detection.

Possible evidence can include:

```text
AppMeasurement
Adobe Analytics specific objects
Known Adobe tracking patterns
```

During V2 QA, AIP successfully detected an Adobe Analytics implementation through **AppMeasurement** with high confidence.

This validates the ability of the engine to detect Analytics ecosystems beyond the Google stack.

---

# 15. Adobe Experience Platform Launch

Adobe Launch belongs to the:

```text
Tag Management
```

category.

It is distinct from Adobe Analytics.

This distinction is important:

```text
Adobe Analytics
      ≠
Adobe Launch
```

A website can use:

- Adobe Analytics without Launch;
- Launch without Adobe Analytics;
- both technologies together.

The Detection Engine therefore treats them as separate tools.

---

# 16. Consent Management Detection

AIP supports several Consent Management Platform detectors.

Examples include:

```text
Didomi
OneTrust
Axeptio
Cookiebot
```

Consent detection can rely on:

```text
Known script URLs
Vendor-specific objects
Known JavaScript identifiers
Consent-specific implementation signals
```

A detected CMP is categorized as:

```text
Consent
```

---

# 17. Generic Consent Signals

AIP can also inspect generic consent-related patterns.

Examples include:

```text
gtag("consent", ...)
consent.default
gdprconsent
Cookiebot
Didomi
OneTrust
Optanon
```

These signals can contribute to technical analysis without necessarily proving a complete and correctly configured consent architecture.

---

# 18. Advertising Technology Detection

AIP supports several advertising and marketing technologies.

Examples include:

```text
Meta Pixel
LinkedIn Insight Tag
TikTok Pixel
Floodlight
```

These technologies belong to:

```text
Advertising
```

The Detection Engine can expose:

```text
Pixel IDs
Advertiser IDs
Script patterns
Technical evidence
```

The Knowledge Engine can later compare these detections with consent signals.

---

# 19. Meta Pixel

Typical Meta Pixel evidence can include:

```text
fbq(...)
connect.facebook.net
Pixel ID
```

Example:

```text
fbq('init', '123456789')
```

The identifier can be returned in:

```text
ids[]
```

---

# 20. LinkedIn Insight Tag

The LinkedIn detector can search for signals related to the LinkedIn Insight Tag.

Typical signals may include:

```text
snap.licdn.com
_linkedin_partner_id
```

The partner identifier can be exposed as technical evidence.

---

# 21. TikTok Pixel

The TikTok detector can inspect known TikTok tracking patterns.

Examples may include:

```text
analytics.tiktok.com
ttq
Pixel initialization
```

As with other detectors, the objective is to identify technical evidence rather than infer marketing strategy.

---

# 22. Floodlight

AIP also supports Floodlight detection.

Floodlight signals can expose identifiers such as:

```text
Advertiser ID
Activity configuration
Known Floodlight endpoints
```

During V2 QA, Floodlight was successfully detected on a real-world website.

---

# 23. DataLayer Detector

The DataLayer detector is one of the richer detectors in AIP V2.

It does not only answer:

```text
Is dataLayer present?
```

It also attempts to characterize its structure.

---

# 24. DataLayer Presence

The detector searches for patterns such as:

```js
window.dataLayer
```

```js
dataLayer = []
```

```js
dataLayer.push(...)
```

Presence can be established when one or more reliable patterns are found.

---

# 25. DataLayer Events

AIP extracts event names from available HTML.

Example:

```js
dataLayer.push({
  event: "purchase"
});
```

The detector can collect:

```text
purchase
```

into the detected event list.

---

# 26. GTM Internal Events

AIP distinguishes common GTM internal events.

Examples:

```text
gtm.js
gtm.dom
gtm.load
gtm.click
gtm.linkClick
gtm.scrollDepth
gtm.historyChange
```

These events are classified separately from business events.

This prevents AIP from interpreting standard GTM lifecycle events as business measurement events.

---

# 27. Business Events

Events not recognized as internal GTM events can be classified as potential business events.

Examples might include:

```text
purchase
add_to_cart
generate_lead
form_submit
login
search
```

The exact event names depend on the website implementation.

A richer set of business events can provide useful information for Data Quality evaluation.

---

# 28. Standard Variables

AIP searches for several common variable families.

## Navigation

```text
page_name
page_type
page_category
page_location
page_referrer
page_title
```

## User

```text
user_id
user_status
login_status
customer_type
```

## Commerce

```text
currency
value
transaction_id
coupon
payment_type
```

## E-commerce

```text
ecommerce
items
item_id
item_name
item_category
quantity
price
```

## Forms

```text
form_name
form_step
form_type
lead_type
```

## Search

```text
search_term
search_results
```

---

# 29. DataLayer Details

The DataLayer detector can expose details such as:

```json
{
  "windowDataLayerDetected": true,
  "pushDetected": true,

  "allEvents": [],
  "internalEvents": [],
  "businessEvents": [],

  "eventCount": 0,
  "internalEventCount": 0,
  "businessEventCount": 0,

  "standardVariables": [],

  "standardVariableCount": 0,

  "variableCategories": {
    "navigation": [],
    "user": [],
    "commerce": [],
    "ecommerce": [],
    "form": [],
    "search": []
  },

  "ecommerceDetected": false,

  "consentSignals": false
}
```

These details provide richer inputs for downstream scoring.

---

# 30. Detection Sources

AIP can record where evidence was found.

Examples include:

```text
HTML statique
Script inline
Script source
```

This improves audit traceability.

For example:

```text
Technology:
GA4

Evidence:
G-XXXXXXXXXX

Source:
HTML statique
```

---

# 31. Technical Evidence

The `evidence` field contains the signals supporting a detection.

Example:

```json
{
  "evidence": [
    "window.dataLayer",
    "dataLayer.push()"
  ]
}
```

Evidence should remain concise and technically meaningful.

Its purpose is to answer:

> Why did AIP mark this technology as detected?

---

# 32. Technology IDs

Where possible, AIP extracts technology identifiers.

Examples:

```text
GTM-XXXXXXX
G-XXXXXXXXXX
Meta Pixel ID
LinkedIn Partner ID
Floodlight Advertiser ID
```

These identifiers can be important during a real audit because they help identify:

- duplicate containers;
- unexpected implementations;
- environment inconsistencies;
- governance issues.

---

# 33. Raw Signals

In addition to structured detections, AIP exposes raw technical signals.

Current raw signals include:

```text
scriptSrcs
headSnippet
inlineScriptSnippet
```

These are primarily useful for:

- debugging;
- detector development;
- technical traceability;
- future runtime correlation.

---

# 34. Raw Signals Are Not Confirmed Detections

This distinction is critical.

During V2 QA, raw HTML contained technologies that did not yet have dedicated detectors.

For example, signals related to CMP technologies such as:

```text
TarteAuCitron
Real Cookie Banner
```

were observable in raw HTML.

However:

```text
Raw signal found
      ≠
Supported detector confirmed
```

This is intentional.

AIP should add a proper detector rather than allowing arbitrary string matches to become confirmed technologies.

---

# 35. False Positives

Avoiding false positives is a major concern.

For example, finding the word:

```text
Matomo
```

inside a text block does not necessarily prove that Matomo tracking is active.

The word could appear in:

- documentation;
- consent descriptions;
- comments;
- configuration text;
- unrelated page content.

A strong detector should therefore combine meaningful implementation patterns whenever possible.

---

# 36. False Negatives

Static analysis can also produce false negatives.

A technology may exist but remain invisible because it is:

```text
Loaded through GTM
Loaded after consent
Loaded dynamically
Executed after page load
Implemented server-side
Proxied
Loaded through a first-party endpoint
```

AIP explicitly acknowledges this limitation.

---

# 37. Detection Philosophy

The Detection Engine prioritizes:

```text
Precision
over
Aggressive guessing
```

In an audit context, a cautious:

```text
Not confirmed
```

is preferable to an incorrect:

```text
Definitely detected
```

This is especially important because detection results influence:

- Knowledge Engine insights;
- scoring;
- AI reports;
- user decisions.

---

# 38. Relationship With the Knowledge Engine

The Detection Engine establishes facts.

The Knowledge Engine interprets them.

Example:

```text
DETECTION ENGINE

GTM:
present = true

GA4:
present = false
```

Then:

```text
KNOWLEDGE ENGINE

GTM is present,
but GA4 is not directly visible.

GA4 may be configured through GTM.
```

This architecture prevents assumptions from contaminating the technical evidence layer.

---

# 39. Relationship With the Scoring Engine

The Scoring Engine consumes structured detections.

For example:

```text
Analytics technology detected
certainty >= Moyen
```

can award Analytics points.

The Detection Engine itself does not know how many points a technology is worth.

This keeps detection and scoring independent.

---

# 40. Relationship With the AI Report Engine

The AI Report Engine receives the detection results as structured input.

However, it should not replace detector logic.

The intended architecture is:

```text
Detector
   ↓
Confirmed Fact
   ↓
AI Explanation
```

not:

```text
Raw HTML
   ↓
AI invents detector
```

This boundary is important for future versions of AIP.

---

# 41. Real-World Validation

The V2 QA campaign validated multiple positive detection scenarios.

Examples included:

```text
Google Tag Manager      ✅
Google Analytics 4      ✅
Adobe Analytics         ✅
Cookiebot               ✅
Didomi                  ✅
DataLayer               ✅
Meta Pixel              ✅
Floodlight              ✅
```

The campaign also identified cases where technologies were visible in raw signals but not yet supported by dedicated detectors.

These cases were added to the future detection backlog rather than patched during the Release Candidate phase.

---

# 42. Known Detection Gaps

Examples identified during V2 QA include:

```text
TarteAuCitron
Real Cookie Banner
Additional Matomo patterns
```

These do not represent failures of the overall architecture.

They represent extensions to the technology coverage of the Detection Engine.

---

# 43. Static Detection Boundary

AIP V2 analyzes the HTML returned by the server.

Conceptually:

```text
HTTP Request
      ↓
HTML Response
      ↓
Detection Engine
```

It does not yet fully observe:

```text
Browser execution
Network requests after load
Consent interactions
Runtime cookies
Runtime DataLayer mutations
Single Page Application navigation
```

This defines the principal boundary of V2 detection.

---

# 44. Runtime Detection — V2.1

A future Runtime Detection layer is planned.

Conceptually:

```text
                 Website
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
Static Detection         Runtime Detection
        │                       │
HTML Evidence            Browser Evidence
                        Network Requests
                        Cookies
                        Runtime DataLayer
                        Consent State
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
            Unified Detection
```

Playwright is one candidate technology for implementing this browser layer.

---

# 45. Adding a New Detector

A new detector should follow the common AIP detection contract.

Conceptually:

```ts
export function detectExample(
  html: string
): AnalyticsToolDetection {
  const present = false;

  return {
    name: "Example Technology",
    key: "example",
    vendor: "Example Vendor",
    category: "Analytics",
    documentationUrl: "https://example.com",
    description: "Example technology.",

    present,

    status: present
      ? "Détecté directement"
      : "Non détecté",

    ids: [],

    evidence: [],

    sources: [],

    certainty: present
      ? "Élevé"
      : "Faible"
  };
}
```

The detector must then be registered in the detector execution layer.

---

# 46. New Detector Checklist

Before adding a detector, verify:

```text
[ ] Technology has a stable key

[ ] Correct ToolCategory selected

[ ] Strong implementation patterns identified

[ ] IDs extracted when possible

[ ] Evidence recorded

[ ] Sources recorded

[ ] Confidence level justified

[ ] False positive risks considered

[ ] Detector registered

[ ] Build passes

[ ] Positive test performed

[ ] Negative test performed
```

---

# 47. Detector Quality Criteria

A high-quality detector should ideally be:

### Specific

It should target signals strongly associated with the technology.

### Explainable

AIP should be able to show why detection occurred.

### Reproducible

The same HTML should produce the same result.

### Maintainable

The detector should remain isolated from unrelated technologies.

### Conservative

Weak signals should not automatically become high-confidence detections.

---

# 48. Future Improvements

Future Detection Engine improvements may include:

- runtime browser detection;
- network request inspection;
- cookie inspection;
- runtime DataLayer analysis;
- consent-state analysis;
- SPA navigation monitoring;
- server-side tracking indicators;
- stronger confidence models;
- expanded CMP coverage;
- expanded Analytics coverage;
- richer Adobe ecosystem detection;
- Matomo detection improvements;
- detector-specific automated tests.

---

# 49. Summary

The Detection Engine is the factual foundation of AIP.

Its role can be summarized as:

```text
HTML
 ↓
Technical Signals
 ↓
Specialized Detectors
 ↓
Evidence
 ↓
Identifiers
 ↓
Confidence
 ↓
Structured Technology Results
```

Those results are then consumed by:

```text
Knowledge Engine
      ↓
Scoring Engine
      ↓
AI Report Engine
```

The core rule remains:

> **Detection establishes what AIP can technically confirm. It should not turn uncertainty into facts.**

---

# Related Documentation

- [`architecture.md`](./architecture.md)
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