# AIP V2 — Scoring Engine

## Technical Documentation

> **Detection establishes the evidence. Scoring evaluates the observed implementation.**

---

# 1. Purpose

The **Scoring Engine** is the deterministic evaluation layer of AIP.

Its responsibility is to transform structured technical findings into a standardized Digital Analytics audit score.

The Scoring Engine answers the question:

> **How mature is the observable Analytics implementation according to the evidence available to AIP?**

The Scoring Engine does not detect technologies.

It does not generate new technical findings.

It does not ask the AI model to decide the score.

It evaluates evidence produced by the Detection Engine according to predefined scoring rules.

---

# 2. Position in the AIP Architecture

The Scoring Engine operates after the Detection Engine and Knowledge Engine.

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
Technical Evidence
   │
   ▼
Knowledge Engine
   │
   ▼
Analytics Insights
   │
   ▼
Scoring Engine
   │
   ▼
Category Scores
   │
   ▼
Global Score
   │
   ▼
AI Report Engine
```

The resulting score becomes one of the structured inputs provided to the AI Report Engine.

---

# 3. Core Principle

AIP follows a deterministic scoring model.

```text
TECHNICAL EVIDENCE
        +
SCORING RULES
        =
AUDIT SCORE
```

The same evidence evaluated with the same rules should always produce the same score.

Therefore:

```text
Same Detection
      +
Same Rules
      =
Same Score
```

This is one of the main architectural differences between AIP and an audit system where an LLM decides the score itself.

---

# 4. Why Deterministic Scoring?

A score generated directly by an AI model could vary between executions.

For example:

```text
Audit 1 → 72/100
Audit 2 → 78/100
Audit 3 → 69/100
```

even when the technical evidence is identical.

AIP avoids this behavior.

The Scoring Engine uses application rules.

This provides:

- reproducibility;
- explainability;
- consistency;
- easier debugging;
- easier regression testing;
- independence from the AI provider;
- controlled evolution of the scoring methodology.

---

# 5. Score Structure

AIP V2 evaluates five Digital Analytics dimensions.

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

The complete model is therefore:

```text
Analytics        20
Tag Management   20
Consent          20
Marketing        20
Data Quality     20
                 ──
TOTAL           100
```

The global AIP score is expressed on a scale from:

```text
0 → 100
```

---

# 6. Scoring Categories

The five categories represent different aspects of an Analytics implementation.

```text
┌────────────────────────┬──────────────┐
│ Category               │ Maximum      │
├────────────────────────┼──────────────┤
│ Analytics              │ 20           │
│ Tag Management         │ 20           │
│ Consent                │ 20           │
│ Marketing              │ 20           │
│ Data Quality           │ 20           │
├────────────────────────┼──────────────┤
│ Global                 │ 100          │
└────────────────────────┴──────────────┘
```

This structure intentionally prevents the presence of a single technology from dominating the complete audit score.

---

# 7. Analytics Category

The **Analytics** category evaluates whether AIP can confirm a supported Analytics solution.

Examples may include:

```text
Google Analytics 4
Adobe Analytics
Piano Analytics
Eulerian Analytics
```

The exact technologies depend on the detector coverage available in the current version.

Conceptually:

```text
Reliable Analytics Technology Detected
                  ↓
          Analytics Score
```

AIP evaluates confirmed technical evidence rather than assuming an Analytics platform exists.

---

# 8. Analytics Scoring Principle

A supported Analytics solution must satisfy the scoring rule requirements.

These requirements can include:

```text
Technology detected
Correct category
Minimum certainty reached
```

Example:

```text
GA4
present = true
certainty = Élevé
category = Analytics
```

This represents strong evidence for the Analytics category.

---

# 9. Tag Management Category

The **Tag Management** category evaluates the presence of a supported Tag Management System.

Examples include:

```text
Google Tag Manager
Adobe Experience Platform Launch
TagCommander
```

Conceptually:

```text
Supported Tag Management System
              ↓
       Tag Management Score
```

The scoring engine evaluates confirmed presence.

Governance concerns such as multiple Tag Management Systems are primarily handled by the Knowledge Engine.

---

# 10. Consent Category

The **Consent** category evaluates observable consent-management signals.

Examples may include:

```text
Didomi
OneTrust
Axeptio
Cookiebot
Generic supported consent implementation
```

The scoring system must remain cautious.

A CMP being detected proves:

```text
Consent technology observed
```

It does not automatically prove:

```text
Full legal compliance
```

or:

```text
Consent Mode correctly configured
```

Those require deeper analysis.

---

# 11. Marketing Category

The **Marketing** category evaluates supported advertising and marketing technologies.

Examples include:

```text
Meta Pixel
LinkedIn Insight Tag
TikTok Pixel
Floodlight
```

This category measures observable marketing measurement capabilities.

It should not be interpreted as:

```text
More advertising pixels = better implementation
```

The purpose is to evaluate the existence of an observable marketing measurement layer according to the current scoring methodology.

Governance and consent risks remain separate considerations.

---

# 12. Data Quality Category

The **Data Quality** category evaluates the richness of the observable measurement architecture.

This category is particularly important because AIP V2 evolved beyond the simplistic rule:

```text
DataLayer detected
      =
20 points
```

A DataLayer can exist while containing very little useful business information.

Therefore AIP evaluates richer DataLayer characteristics.

---

# 13. Data Quality Philosophy

The Data Quality score attempts to answer:

> **Does the observable data architecture provide meaningful structure for Analytics measurement?**

The scoring can consider signals such as:

```text
DataLayer presence
Business events
Standard variables
E-commerce structure
Consent-related signals
```

This provides a more nuanced assessment.

---

# 14. DataLayer Presence

The first Data Quality signal is whether a DataLayer can be confirmed.

Examples:

```text
window.dataLayer
dataLayer.push()
```

Presence represents the foundation of the Data Quality evaluation.

However, presence alone does not necessarily justify the maximum Data Quality score.

---

# 15. Business Events

The DataLayer detector distinguishes between:

```text
GTM internal events
```

and:

```text
Business events
```

Examples of GTM internal events include:

```text
gtm.js
gtm.dom
gtm.load
gtm.click
gtm.linkClick
gtm.scrollDepth
gtm.historyChange
```

These events are useful technically but do not necessarily represent business measurement.

Business events may include events such as:

```text
purchase
add_to_cart
generate_lead
form_submit
login
search
```

depending on the audited implementation.

The presence of business events provides stronger evidence of a structured measurement architecture.

---

# 16. Why Internal GTM Events Are Separated

Without this distinction, a DataLayer containing only:

```text
gtm.js
gtm.dom
gtm.load
```

could incorrectly appear mature.

AIP therefore separates:

```text
Technical Lifecycle Events
          ≠
Business Measurement Events
```

This improves the quality of the Data Quality score.

---

# 17. Standard Variables

AIP also evaluates common structured variables.

These variables are grouped into several families.

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

The presence of structured variables can increase confidence that the DataLayer supports meaningful Analytics use cases.

---

# 18. E-commerce Signals

AIP can identify observable e-commerce structures such as:

```text
ecommerce
items
item_id
item_name
quantity
price
```

E-commerce signals can contribute to Data Quality evaluation because they indicate structured commerce measurement.

However, static detection does not prove that every e-commerce event is correctly implemented.

---

# 19. Consent Signals in Data Architecture

The DataLayer detector can also identify consent-related signals.

Examples include patterns related to:

```text
gtag consent
consent.default
Didomi
OneTrust
Cookiebot
Optanon
```

These signals provide additional context about the relationship between measurement and consent architecture.

They should not independently prove legal compliance.

---

# 20. Data Quality Progression

Conceptually, Data Quality maturity can progress like this:

```text
No DataLayer
      ↓
Very limited observable data architecture

DataLayer detected
      ↓
Technical data layer exists

DataLayer + Business Events
      ↓
Measurement structure exists

DataLayer + Events + Standard Variables
      ↓
Richer measurement architecture

DataLayer + Events + Variables + E-commerce
      ↓
Advanced observable structure
```

The scoring model can reflect this progression.

---

# 21. Scoring Rule Model

Scoring rules define how evidence contributes to category scores.

Conceptually, a scoring rule can contain information such as:

```ts
{
  key: "analytics-detected",
  category: "analytics",
  points: 20,
  minimumCertainty: "Moyen"
}
```

The exact implementation can evolve, but the principle remains:

```text
RULE
  +
EVIDENCE
  =
POINTS
```

---

# 22. Scoring Rule Responsibilities

A scoring rule should define:

```text
What evidence is required?

Which category receives points?

How many points are awarded?

What confidence level is required?

Can the rule be applied more than once?
```

These decisions belong to the deterministic scoring layer.

---

# 23. Certainty and Scoring

AIP detectors expose certainty levels:

```text
Élevé
Moyen
Faible
```

The Scoring Engine can require a minimum certainty level.

Conceptually:

```text
Rule requires:
Moyen

Detection:
Élevé
        ↓
Rule accepted
```

```text
Rule requires:
Moyen

Detection:
Faible
        ↓
Rule rejected
```

This prevents weak evidence from automatically receiving full scoring credit.

---

# 24. Certainty Hierarchy

Conceptually:

```text
Faible
   ↓
Moyen
   ↓
Élevé
```

A rule requiring:

```text
Faible
```

can accept all levels.

A rule requiring:

```text
Moyen
```

can accept:

```text
Moyen
Élevé
```

A rule requiring:

```text
Élevé
```

should only accept:

```text
Élevé
```

This makes confidence part of the scoring methodology.

---

# 25. Category Maximums

Each category must respect its maximum score.

Example:

```text
Analytics

Rule A = 20 points
Rule B = 10 points

Both trigger
```

The category must still not exceed:

```text
20 / 20
```

Therefore:

```text
categoryScore =
min(
  awardedPoints,
  categoryMaximum
)
```

This prevents rule accumulation from producing invalid category scores.

---

# 26. Global Score

The global score aggregates category results.

Because the current maximum is:

```text
100
```

the conceptual calculation is straightforward.

```text
Analytics
+
Tag Management
+
Consent
+
Marketing
+
Data Quality
=
Global Score
```

Example:

```text
Analytics        20
Tag Management   20
Consent          15
Marketing        10
Data Quality     15
                 ──
Global           80 / 100
```

---

# 27. Score Normalization

AIP can normalize the global score against the total available points.

Conceptually:

```text
earnedPoints
──────────── × 100
maximumPoints
```

Example:

```text
75
─── × 100 = 75
100
```

The normalized score remains between:

```text
0
and
100
```

---

# 28. Grade

The Scoring Engine can associate the global score with a grade.

Conceptually:

```text
globalScore
    ↓
grade
```

Example output:

```json
{
  "globalScore": 75,
  "maxScore": 100,
  "grade": "C"
}
```

The exact thresholds should remain centralized in the scoring implementation so that grading remains consistent.

---

# 29. Score Output

A complete scoring result can conceptually contain:

```json
{
  "globalScore": 75,
  "maxScore": 100,
  "grade": "C",
  "categories": [
    {
      "category": "analytics",
      "score": 20,
      "maxScore": 20
    },
    {
      "category": "tagManagement",
      "score": 20,
      "maxScore": 20
    },
    {
      "category": "consent",
      "score": 15,
      "maxScore": 20
    },
    {
      "category": "marketing",
      "score": 5,
      "maxScore": 20
    },
    {
      "category": "dataQuality",
      "score": 15,
      "maxScore": 20
    }
  ]
}
```

The exact TypeScript representation is defined by the Scoring Engine types.

---

# 30. Score Explainability

A score should be explainable.

AIP should eventually be able to answer:

```text
Why did this website receive 15/20
for Data Quality?
```

rather than returning only:

```text
Data Quality = 15
```

This means scoring rules should remain identifiable and traceable.

Future UI versions can expose:

```text
Points earned
Rules triggered
Evidence used
Points missing
```

---

# 31. Scoring Is Not Detection

The Scoring Engine must not create new technical facts.

Incorrect architecture:

```text
Scoring Engine sees "gtag"
        ↓
Scoring Engine decides GA4 exists
```

Correct architecture:

```text
GA4 Detector
      ↓
GA4 Detection Result
      ↓
Scoring Engine
      ↓
Analytics Points
```

Technology recognition belongs to the Detection Engine.

---

# 32. Scoring Is Not Knowledge

The Scoring Engine should also remain separate from the Knowledge Engine.

Example:

```text
GTM + Adobe Launch
```

Knowledge Engine:

```text
Multiple Tag Management Systems detected.
Governance should be reviewed.
```

Scoring Engine:

```text
Evaluate Tag Management evidence
according to scoring rules.
```

The two engines answer different questions.

---

# 33. Scoring Is Not AI

The AI Report Engine does not decide the score.

The intended pipeline is:

```text
Detection
    ↓
Knowledge
    ↓
Scoring
    ↓
Final Score
    ↓
AI Report
```

The AI receives the score as a fact.

It can explain the score.

It cannot arbitrarily replace it.

---

# 34. Why This Matters

Suppose the deterministic score is:

```text
65 / 100
```

The AI should not generate:

```text
Overall maturity score: 80 / 100
```

because it considers the implementation better.

The authoritative score is produced by the Scoring Engine.

This protects the consistency of AIP audits.

---

# 35. Missing Evidence

AIP scoring is based on observable evidence.

Therefore missing evidence must be handled cautiously.

For example:

```text
GA4 not detected
```

does not prove:

```text
GA4 absent
```

However, if GA4 cannot be confirmed, the Scoring Engine cannot award points that require confirmed GA4 evidence.

This creates an important distinction:

```text
NO POINTS AWARDED
        ≠
CONFIRMED ABSENCE
```

---

# 36. Static Analysis Impact on Scoring

Because AIP V2 primarily uses static HTML analysis, some scores can be conservative.

A website may use:

```text
GA4 through GTM
Consent-based tags
Runtime DataLayer
Server-side tracking
Dynamic marketing pixels
```

without exposing all of those technologies in the initial HTML.

Therefore the V2 score should be understood as:

> **A score based on the technical evidence observable by the current AIP analysis capabilities.**

It is not an absolute certification of the entire tracking architecture.

---

# 37. Anti-Bot and Fetch Failures

If AIP cannot retrieve the website HTML because of:

```text
HTTP 403
Cloudflare
Timeout
DNS failure
Network failure
```

the platform should not interpret the failure as:

```text
0 / 100 Analytics maturity
```

The correct interpretation is:

```text
Audit could not be completed
```

A fetch failure is not a scoring result.

---

# 38. Unsupported Technologies

A website may use technologies that AIP V2 does not yet detect.

For example, QA may expose signals related to technologies that are not yet covered by a dedicated detector.

In that case:

```text
Unsupported technology
        ↓
No confirmed detector result
        ↓
No corresponding scoring credit
```

This is a coverage limitation, not necessarily a weakness of the audited website.

Such limitations should be communicated in the audit.

---

# 39. Scoring and False Positives

False positives can artificially increase the score.

For example:

```text
Weak generic signal
      ↓
Incorrect technology detection
      ↓
Points awarded
      ↓
Artificially inflated score
```

This is why detector confidence and conservative detection rules are important to scoring reliability.

---

# 40. Scoring and False Negatives

False negatives can have the opposite effect.

```text
Technology exists
      ↓
Static detector cannot observe it
      ↓
No points awarded
      ↓
Score becomes conservative
```

Runtime analysis planned for future versions should reduce this limitation.

---

# 41. Example — Basic Analytics Architecture

Detection:

```text
GA4 detected
GTM detected
DataLayer detected
CMP not confirmed
Marketing technology not confirmed
```

Possible category interpretation:

```text
Analytics        Strong
Tag Management   Strong
Consent          Limited observable evidence
Marketing        Limited observable evidence
Data Quality     Depends on DataLayer richness
```

The exact points are determined by the implemented scoring rules.

---

# 42. Example — Rich DataLayer

Suppose AIP observes:

```text
DataLayer present
Business events present
Navigation variables present
Commerce variables present
E-commerce structure present
```

This represents stronger Data Quality evidence than:

```text
window.dataLayer = []
```

alone.

The Data Quality score should therefore reflect the difference.

---

# 43. Example — Internal Events Only

Suppose the DataLayer contains:

```text
gtm.js
gtm.dom
gtm.load
```

but no identifiable business events or standard variables.

AIP should not interpret this as a fully mature business DataLayer.

Conceptually:

```text
DataLayer Presence      ✅

Technical Events        ✅

Business Events         ❌

Business Variables      ❌
```

The Data Quality score should remain below the maximum.

---

# 44. Example — Consent Architecture

Suppose AIP confirms:

```text
Didomi detected
```

The Consent category can receive scoring credit according to the current rule.

However, AIP should still distinguish:

```text
CMP detected
```

from:

```text
Consent Mode v2 fully validated
```

The second requires additional evidence.

---

# 45. Example — Advertising Architecture

Suppose:

```text
Meta Pixel detected
Floodlight detected
CMP not confirmed
```

The Marketing category can evaluate the confirmed marketing technologies.

Separately, the Knowledge Engine can generate a consent/governance warning.

This demonstrates why:

```text
SCORING
```

and:

```text
RISK INTERPRETATION
```

must remain separate.

---

# 46. Score Does Not Equal Compliance

A high AIP score does not automatically mean:

```text
GDPR compliant
```

A low AIP score does not automatically mean:

```text
non-compliant
```

The score evaluates observable Analytics maturity according to the AIP scoring methodology.

Compliance requires broader legal and technical analysis.

---

# 47. Score Does Not Equal Business Performance

The AIP score also does not measure:

```text
Revenue
Conversion Rate
Marketing ROI
Website Performance
SEO Performance
Business Success
```

It evaluates the observable Digital Analytics implementation.

---

# 48. Score Interpretation

The score should therefore be understood as:

```text
Technical Analytics Maturity Indicator
```

based on the evidence accessible to AIP.

It provides a standardized way to:

- compare audit dimensions;
- identify weak areas;
- prioritize improvements;
- communicate implementation maturity.

---

# 49. Category Balance

Using five equal categories provides a simple and readable V2 model.

```text
20%
Analytics

20%
Tag Management

20%
Consent

20%
Marketing

20%
Data Quality
```

This equal weighting is a product choice for V2.

Future versions may introduce configurable or industry-specific weighting.

---

# 50. Why Equal Weighting in V2?

Equal weighting provides:

- simple interpretation;
- predictable scoring;
- easier debugging;
- easier UI presentation;
- easier comparison between audits.

It also avoids introducing premature complexity into the Release Candidate.

More advanced weighting can be considered after collecting real audit feedback.

---

# 51. Future Weighted Scoring

A future version could introduce different weighting models.

Example:

```text
Analytics        25%
Tag Management   15%
Consent          25%
Marketing        10%
Data Quality     25%
```

Another possibility is industry-specific scoring.

Example:

```text
E-commerce
Lead Generation
Media
Corporate Website
SaaS
```

These models are not part of the V2 scoring contract.

---

# 52. Future Negative Scoring

A future version could also introduce penalties.

For example:

```text
Multiple uncontrolled GTM containers
        ↓
Governance penalty
```

or:

```text
Advertising tags without validated consent controls
        ↓
Risk penalty
```

However, penalties require careful design because they combine maturity evaluation with risk evaluation.

V2 keeps the model intentionally understandable.

---

# 53. Future Confidence Weighting

Detector certainty could eventually influence points more granularly.

Example:

```text
Élevé → 100% of rule points

Moyen → partial points

Faible → no points or reduced points
```

The current architecture already provides the certainty information needed to evolve toward such a model.

---

# 54. Future Runtime Scoring

Runtime analysis will significantly improve scoring accuracy.

Future evidence could include:

```text
Actual GA4 network requests
Actual Adobe Analytics requests
Tags fired after consent
Cookies created
Consent Mode state
Runtime DataLayer events
SPA route tracking
E-commerce events
```

This would allow AIP to move from:

```text
Implementation Presence Score
```

toward:

```text
Implementation Behavior Score
```

---

# 55. Static + Runtime Scoring

The future architecture could combine:

```text
STATIC EVIDENCE
      +
RUNTIME EVIDENCE
      ↓
UNIFIED SCORING
```

Example:

```text
Static HTML:
GTM detected

Runtime:
GA4 request confirmed

Consent:
analytics_storage granted after consent

DataLayer:
business events observed

        ↓

Higher confidence audit
```

This is a major direction for AIP V2.1 and later versions.

---

# 56. Scoring Rule Traceability

Every scoring rule should ideally have a stable identifier.

Example:

```text
analytics-tool-detected

tag-manager-detected

cmp-detected

marketing-tool-detected

datalayer-present

datalayer-business-events

datalayer-standard-variables

datalayer-ecommerce
```

Stable identifiers make future features easier.

Examples:

- regression testing;
- score explanations;
- UI drill-down;
- audit comparison;
- rule versioning.

---

# 57. Scoring Versioning

As AIP evolves, the scoring methodology may change.

A future audit could therefore include:

```text
scoringVersion
```

Example:

```json
{
  "scoringVersion": "2.0",
  "globalScore": 75
}
```

This would allow historical audits to remain interpretable even after scoring rules evolve.

---

# 58. Why Scoring Versioning Matters

Suppose:

```text
AIP V2 score = 70
```

and six months later the scoring model changes.

The same website could receive:

```text
AIP V2.1 score = 78
```

without any implementation change.

Without scoring version information, comparing those audits could be misleading.

Versioned scoring would solve this problem.

---

# 59. Testing Strategy

The Scoring Engine is particularly suitable for automated unit testing because it is deterministic.

Example:

```text
INPUT

GA4 detected
certainty = Élevé

EXPECTED

Analytics score = expected value
```

Another example:

```text
INPUT

DataLayer detected
Business events = 0
Standard variables = 0

EXPECTED

Data Quality score < maximum
```

---

# 60. Boundary Testing

Tests should also verify category maximums.

Example:

```text
Several Analytics rules trigger

Total theoretical points = 35

Category maximum = 20

EXPECTED:

Analytics score = 20
```

This protects the score from accidental overflow.

---

# 61. Certainty Testing

Tests should verify minimum certainty requirements.

Example:

```text
RULE

minimumCertainty = Moyen
```

Case 1:

```text
Detection certainty = Élevé

EXPECTED:
Rule triggers
```

Case 2:

```text
Detection certainty = Moyen

EXPECTED:
Rule triggers
```

Case 3:

```text
Detection certainty = Faible

EXPECTED:
Rule does not trigger
```

---

# 62. Data Quality Testing

Data Quality deserves dedicated regression tests.

Suggested cases:

```text
No DataLayer

DataLayer only

DataLayer + internal GTM events

DataLayer + business events

DataLayer + standard variables

DataLayer + e-commerce

Rich DataLayer
```

The expected score should increase as meaningful evidence becomes richer.

---

# 63. Regression Protection

Because the global score is user-visible, scoring changes should be treated carefully.

A change in:

```text
Detector
Scoring Rule
Confidence Threshold
Category Maximum
Data Quality Logic
```

can change the final score.

Therefore scoring modifications should be followed by a non-regression campaign.

---

# 64. V2 QA Strategy

The V2 Release Candidate validation uses representative real-world sites.

The objective is not to prove that every website on the Internet can be audited.

The objective is to validate several architecture patterns.

Examples:

```text
GTM / GA4 site

Adobe site

CMP / Didomi site

Rich DataLayer site

Low-signal site

Fetch failure site
```

This campaign helps verify that scoring remains coherent across different implementation profiles.

---

# 65. Fetch Failure Test

A fetch failure is an important regression case.

Example:

```text
HTTP 403 Forbidden
```

Expected behavior:

```text
Audit failure reported
```

Not:

```text
Global Score = 0
```

This distinction must remain protected by testing.

---

# 66. Low-Signal Test

A low-signal site helps validate cautious scoring.

Expected behavior:

```text
Few confirmed technologies
      ↓
Limited scoring evidence
      ↓
Conservative score
```

The AI report should also explain the detection limitations rather than presenting the score as proof of absence.

---

# 67. Rich Architecture Test

A site with:

```text
Analytics
Tag Management
CMP
Marketing
Rich DataLayer
```

provides a useful positive regression case.

It validates that the scoring engine can award points across all five categories.

---

# 68. Adding a Scoring Rule

When adding a scoring rule:

```text
1. Identify the evidence required.

2. Confirm that the Detection Engine
   exposes that evidence.

3. Select the scoring category.

4. Define the number of points.

5. Define minimum certainty if required.

6. Verify the category maximum.

7. Add a stable rule identifier.

8. Add positive tests.

9. Add negative tests.

10. Run non-regression tests.
```

---

# 69. Scoring Rule Checklist

```text
[ ] Based on structured evidence

[ ] Does not perform technology detection

[ ] Category is correct

[ ] Points are justified

[ ] Minimum certainty is explicit

[ ] Category maximum cannot be exceeded

[ ] Rule is deterministic

[ ] Rule is explainable

[ ] Positive test exists

[ ] Negative test exists

[ ] Global score remains between 0 and 100
```

---

# 70. Changing Existing Rules

Existing scoring rules should not be changed casually.

Before modifying a rule, consider:

```text
Will historical scores change?

Will category balance change?

Will existing regression sites change score?

Does documentation need updating?

Does the UI assume a particular maximum?

Will the AI report interpret the new score correctly?
```

Scoring is part of the product contract.

---

# 71. Relationship With the Dashboard

The audit dashboard consumes scoring results to present:

```text
Global Score
Category Scores
Maturity Indicators
```

The UI should display the score.

It should not recalculate it independently.

Correct architecture:

```text
Scoring Engine
      ↓
API Response
      ↓
Dashboard
```

Not:

```text
API Detection
      ↓
Frontend calculates score
```

This keeps one authoritative scoring implementation.

---

# 72. Relationship With AI Recommendations

The AI Report Engine receives:

```text
Detection Result
Knowledge Insights
Scoring Result
```

This allows recommendations to consider both:

```text
What was observed?
```

and:

```text
How did it affect the score?
```

Example:

```text
Data Quality = low
```

combined with:

```text
DataLayer present
Business events absent
```

can support a recommendation to enrich the DataLayer with meaningful business events.

---

# 73. AI Must Not Override Scoring

The prompt architecture should preserve this rule:

> The scoring result is authoritative.

The AI can explain:

```text
Why Data Quality is limited
```

but should not independently assign a different score.

This keeps the deterministic and generative layers clearly separated.

---

# 74. Scoring Engine as Product Logic

The Scoring Engine is more than a utility.

It represents part of AIP's product methodology.

The scoring model encodes a view of Digital Analytics maturity across:

```text
Measurement
Tag Management
Consent
Marketing
Data Architecture
```

As the platform evolves, this methodology can become increasingly sophisticated.

---

# 75. Current V2 Philosophy

The V2 scoring philosophy favors:

```text
Simple
Deterministic
Explainable
Conservative
Extensible
```

over:

```text
Complex
Opaque
AI-generated
Difficult to reproduce
```

This provides a stable foundation for future maturity scoring.

---

# 76. Future Analytics Maturity Model

Long-term, AIP scoring could evolve beyond technology presence.

Possible dimensions include:

```text
Implementation Coverage
Data Quality
Consent Governance
Tag Governance
Event Quality
E-commerce Quality
Runtime Reliability
Cross-domain Tracking
Server-Side Tracking
Data Governance
Measurement Strategy
```

This could eventually produce a richer:

```text
Analytics Maturity Score
```

rather than only a technology implementation score.

---

# 77. Future Recommendations From Score Gaps

A future version could directly connect missing scoring points to recommendations.

Example:

```text
Data Quality
10 / 20

Missing:
Business Events
E-commerce Variables
```

Automatically mapped to:

```text
Priority Action:

Implement a structured business DataLayer
covering key conversion and e-commerce events.
```

The AI could then improve the wording without inventing the underlying recommendation.

---

# 78. Future Score Comparison

With audit history, AIP could compare scores over time.

Example:

```text
January

Analytics        20
Tag Management   20
Consent          10
Marketing        10
Data Quality      5

Global           65
```

After improvements:

```text
March

Analytics        20
Tag Management   20
Consent          20
Marketing        15
Data Quality     15

Global           90
```

This would transform the score into a progress indicator.

---

# 79. Future Benchmarking

A later version could potentially compare maturity against:

```text
Industry
Website Type
Company Size
Implementation Pattern
```

For example:

```text
E-commerce Analytics maturity
```

or:

```text
Corporate website maturity
```

Such benchmarking would require a reliable dataset and is outside the V2 scope.

---

# 80. Scoring Boundaries

The Scoring Engine evaluates only what the AIP methodology defines.

It does not evaluate:

```text
Legal compliance certification

Business profitability

Marketing campaign performance

SEO quality

Website accessibility

Application security

Overall website quality
```

Its domain is Digital Analytics implementation maturity.

---

# 81. Architectural Boundary

The Scoring Engine should remain:

```text
STRUCTURED EVIDENCE
        ↓
SCORING RULES
        ↓
CATEGORY SCORES
        ↓
GLOBAL SCORE
```

It should not become:

```text
a detector
```

or:

```text
a recommendation engine
```

or:

```text
an AI reasoning layer
```

This separation keeps the AIP architecture maintainable.

---

# 82. Core Guarantees

The Scoring Engine should preserve several guarantees.

```text
Global score is between 0 and 100.

Category scores do not exceed their maximum.

Identical evidence produces identical scoring.

Weak evidence can be filtered by certainty.

Fetch failure does not become a zero score.

Undetected does not automatically mean absent.

AI cannot override deterministic scoring.
```

These guarantees form the foundation of scoring reliability.

---

# 83. Summary

The AIP Scoring Engine transforms technical evidence into a standardized Digital Analytics maturity score.

```text
Detection Engine
       │
       ▼
Technical Evidence
       │
       ▼
Scoring Rules
       │
       ├── Analytics
       ├── Tag Management
       ├── Consent
       ├── Marketing
       └── Data Quality
       │
       ▼
Category Scores
       │
       ▼
Global Score / 100
       │
       ▼
AI Report Engine
```

The five V2 categories are:

```text
Analytics        /20
Tag Management   /20
Consent          /20
Marketing        /20
Data Quality     /20
                 ───
Global           /100
```

The central principle remains:

> **The score is determined by observable evidence and deterministic rules, not by the AI model.**

---

# Related Documentation

- [`architecture.md`](./architecture.md)
- [`detection-engine.md`](./detection-engine.md)
- [`knowledge-engine.md`](./knowledge-engine.md)
- [`ai-report-engine.md`](./ai-report-engine.md)
- [`api.md`](./api.md)
- [`testing.md`](./testing.md)
- [`limitations.md`](./limitations.md)
- [`roadmap.md`](./roadmap.md)

---

**AIP — Analytics Intelligence Platform**

**Analyze. Score. Improve.**