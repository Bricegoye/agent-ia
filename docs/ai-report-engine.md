# AIP V2 — AI Report Engine

## Technical Documentation

> **Deterministic engines establish the evidence. AI transforms that evidence into an actionable audit report.**

---

# 1. Purpose

The **AI Report Engine** is the generative interpretation layer of AIP.

Its responsibility is to transform structured audit results into a professional Digital Analytics report.

The AI Report Engine receives information that has already been:

```text
Detected
Interpreted
Scored
```

by deterministic application engines.

Its role is therefore not to discover the Analytics architecture from scratch.

It answers the question:

> **How can the validated audit findings be explained, summarized and prioritized for a human reader?**

---

# 2. Position in the AIP Architecture

The AI Report Engine is the final processing layer of the audit pipeline.

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
Structured Audit Report
     │
     ▼
Audit Dashboard
```

The AI therefore operates after the deterministic engines.

---

# 3. Core Principle

AIP follows this architectural rule:

```text
DETERMINISTIC ENGINES
        ↓
ESTABLISH FACTS
        ↓
AI
        ↓
EXPLAINS THE FACTS
```

The AI should not replace:

```text
Technology Detection
Knowledge Rules
Scoring Rules
```

This distinction is central to AIP V2.

---

# 4. Why Use AI?

Deterministic engines are excellent at producing structured facts.

For example:

```text
GTM detected

GA4 not directly detected

Didomi detected

DataLayer detected

Data Quality score = 15/20
```

However, a professional audit also needs to explain:

```text
What does this architecture mean?

What are the strengths?

What are the risks?

What should be improved?

What should be done first?
```

This is where the AI Report Engine adds value.

---

# 5. AI as a Communication Layer

The AI Report Engine can be viewed as:

```text
Structured Audit Data
        ↓
Professional Interpretation
        ↓
Human-Readable Report
```

The AI improves:

- readability;
- synthesis;
- prioritization;
- communication;
- technical explanation.

It does not replace the underlying evidence.

---

# 6. Input Model

The AI Report Engine receives an `AIReportInput`.

Conceptually:

```ts
export interface AIReportInput {
  detection: AnalyticsDetectionResult;
  knowledge: AnalyticsInsight[];
  scoring: ScoringResult;
  language: "fr" | "en";
}
```

The three main technical inputs are:

```text
Detection Result
Knowledge Insights
Scoring Result
```

The report language is also provided.

---

# 7. Detection Input

The Detection Engine provides technical evidence.

This can include:

```text
Technologies
Technology IDs
Evidence
Sources
Confidence
Detection Status
Raw Signals
DataLayer Details
```

Example:

```json
{
  "name": "Google Tag Manager",
  "key": "gtm",
  "present": true,
  "ids": [
    "GTM-XXXXXXX"
  ],
  "certainty": "Élevé"
}
```

The AI may explain this information.

It should not replace it with an unsupported detection.

---

# 8. Knowledge Input

The Knowledge Engine provides deterministic Analytics insights.

Example:

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

These insights provide domain context before the AI generates the final report.

---

# 9. Scoring Input

The Scoring Engine provides the authoritative audit score.

Example:

```json
{
  "globalScore": 75,
  "maxScore": 100,
  "grade": "C",
  "categories": []
}
```

The AI may explain the score.

It must not arbitrarily replace or recalculate it.

---

# 10. AI Client Abstraction

The AI Report Engine does not directly depend on a specific AI provider implementation.

It receives an `AIClient`.

Conceptually:

```ts
export interface AIClient {
  generate(messages: AIMessage[]): Promise<string>;
}
```

The Report Engine constructor receives this dependency:

```ts
export class AIReportEngine {
  constructor(
    private readonly aiClient: AIClient
  ) {}
}
```

This creates a separation between:

```text
Report Logic
```

and:

```text
AI Provider
```

---

# 11. Why an AI Client Interface?

Using an abstraction provides several advantages.

The report engine does not need to know:

```text
Which OpenAI model is used

How the API request is sent

How authentication works

How provider-specific configuration works
```

It only needs:

```text
AIClient.generate(...)
```

This makes the architecture easier to:

- test;
- maintain;
- replace;
- extend.

---

# 12. Prompt Construction

The AI Report Engine builds a structured conversation.

Conceptually:

```ts
buildPrompt(input)
```

returns:

```ts
AIMessage[]
```

containing:

```text
System Message
User Message
```

The system message defines the AI role and constraints.

The user message provides the actual audit data.

---

# 13. System Prompt

The system prompt defines the AI as a senior Digital Analytics consultant.

Its expertise includes:

```text
Digital Analytics
Tag Management
Consent Management
Data Quality
Marketing Governance
```

However, expertise does not give the AI permission to invent findings.

---

# 14. Fundamental Prompt Rules

The Report System Prompt contains several mandatory rules.

The AI must:

```text
Remain strictly factual

Never invent technologies

Never invent identifiers

Never invent issues

Never invent findings

Use only the provided audit data

Distinguish facts, risks and recommendations

Respect detection uncertainty

Follow the requested language

Return valid JSON only
```

These rules form the grounding contract of the AI layer.

---

# 15. Grounding

Grounding means that the AI report is based on structured application evidence.

The intended architecture is:

```text
Detection
    ↓
Knowledge
    ↓
Scoring
    ↓
Structured Evidence
    ↓
AI
```

not:

```text
Website URL
    ↓
AI guesses implementation
```

This significantly reduces hallucination risk.

---

# 16. Anti-Hallucination Strategy

AIP does not rely on prompt wording alone to reduce hallucinations.

Several architectural mechanisms work together.

```text
Specialized Detectors
        ↓
Structured Detection
        ↓
Deterministic Knowledge
        ↓
Deterministic Scoring
        ↓
Restricted AI Prompt
        ↓
Structured JSON Validation
```

This is stronger than simply asking:

```text
"Please do not hallucinate."
```

---

# 17. Static Analysis Uncertainty

The system prompt explicitly tells the AI not to consider an undetected technology as definitively absent.

This is necessary because detection can be limited by:

```text
Dynamic loading
Tag Managers
Consent mechanisms
Browser rendering
Reverse proxies
Server-side tracking
Captchas
Anti-bot systems
```

Therefore:

```text
Not detected
      ≠
Absent
```

The AI must preserve this distinction.

---

# 18. Correct AI Wording

When GA4 is not directly detected, appropriate wording is:

```text
Aucun Measurement ID GA4 n'a été identifié
dans le HTML statique analysé.
```

or:

```text
GA4 peut être configuré via GTM et nécessiter
une vérification runtime.
```

---

# 19. Incorrect AI Wording

The AI should avoid unsupported conclusions such as:

```text
GA4 is not installed.
```

or:

```text
The website does not use Google Analytics.
```

unless the technical evidence genuinely proves such a statement.

Static HTML analysis generally cannot prove complete absence.

---

# 20. User Prompt

The user prompt contains the complete structured audit data.

Conceptually:

```text
AUDITED URL

DETECTION ENGINE RESULT

KNOWLEDGE ENGINE INSIGHTS

SCORING ENGINE RESULT
```

Each section is serialized into JSON.

This gives the model explicit access to the facts it is allowed to use.

---

# 21. Detection Data Serialization

Detection results are inserted using:

```ts
JSON.stringify(
  input.detection,
  null,
  2
)
```

This provides a predictable structured representation.

The AI can therefore inspect:

```text
present
status
ids
evidence
sources
certainty
details
```

instead of interpreting an arbitrary textual description.

---

# 22. Knowledge Data Serialization

Knowledge insights are also serialized.

```ts
JSON.stringify(
  input.knowledge,
  null,
  2
)
```

This allows the AI to use deterministic interpretations already established by AIP.

---

# 23. Scoring Data Serialization

The scoring result is serialized in the same way.

```ts
JSON.stringify(
  input.scoring,
  null,
  2
)
```

The AI therefore receives the actual score calculated by the Scoring Engine.

It does not need to estimate maturity independently.

---

# 24. Report Output Structure

The AI must return exactly the following JSON structure:

```json
{
  "executiveSummary": "string",
  "strengths": [
    "string"
  ],
  "weaknesses": [
    "string"
  ],
  "recommendations": [
    "string"
  ],
  "priorityActions": [
    "string"
  ],
  "technicalAnalysis": "string"
}
```

The property names are part of the application contract.

---

# 25. AIReport Model

Conceptually:

```ts
export interface AIReport {
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  priorityActions: string[];
  technicalAnalysis: string;
}
```

This structured model makes the report directly consumable by the UI.

---

# 26. Executive Summary

`executiveSummary` provides a concise overview intended for a decision-maker.

It should summarize:

```text
Overall maturity

Main strengths

Main risks

Most important improvement direction
```

It should avoid unnecessary technical detail.

---

# 27. Strengths

`strengths` contains positive findings supported by the audit evidence.

Examples:

```text
Google Tag Manager detected

Structured DataLayer identified

Consent Management Platform detected
```

The AI must not invent strengths simply to make the report appear balanced.

If the evidence supports only a limited number of strengths, the report should remain factual.

---

# 28. Weaknesses

`weaknesses` contains weaknesses or risks supported by the audit.

Examples may include:

```text
No directly visible GA4 Measurement ID

Limited DataLayer business structure

No supported CMP confirmed

Multiple Tag Management Systems detected
```

Again, missing detection must be described cautiously.

---

# 29. Recommendations

`recommendations` contains actionable improvements based on the findings.

A recommendation should connect to observed evidence.

Example:

```text
Finding:

GTM detected
GA4 not directly visible
```

Possible recommendation:

```text
Verify the GTM container and runtime network requests
to confirm whether GA4 is deployed through GTM.
```

This recommendation is justified by the evidence.

---

# 30. Priority Actions

`priorityActions` contains the most important actions.

AIP limits this list to:

```text
Maximum 5 actions
```

The actions should be ordered from:

```text
Highest priority
        ↓
Lowest priority
```

Priority should consider impact on:

```text
Measurement
Consent
Data Quality
Governance
```

---

# 31. Technical Analysis

`technicalAnalysis` provides a deeper explanation intended for:

```text
Digital Analytics teams

Tagging specialists

Technical consultants

Developers

Data teams
```

It can contain more technical terminology than the Executive Summary.

---

# 32. Report Language

AIP currently supports:

```text
fr
en
```

The report language is selected from the audit input.

---

# 33. French Report

When:

```ts
language === "fr"
```

all human-readable report content must be generated in French.

This applies to:

```text
executiveSummary
strengths
weaknesses
recommendations
priorityActions
technicalAnalysis
```

---

# 34. English Report

When:

```ts
language === "en"
```

all human-readable report content must be generated in English.

The JSON property names remain unchanged.

---

# 35. Technical Terms

Technical identifiers should not be translated when translation would reduce accuracy.

Examples:

```text
Google Tag Manager
GA4
Adobe Analytics
DataLayer
Measurement ID
GTM-XXXXXXX
G-XXXXXXXXXX
Consent Mode
```

This preserves technical precision.

---

# 36. JSON-Only Contract

The AI is explicitly instructed to return:

```text
Valid JSON only
```

It must not return:

```text
Markdown
```

or:

```text
Here is your report:
```

or:

```text
```json
...
```
```

The expected output begins directly with:

```text
{
```

and ends with:

```text
}
```

---

# 37. Why JSON Only?

The application consumes the AI response programmatically.

Returning structured JSON allows AIP to map report sections directly to UI components.

Conceptually:

```text
AI Response
     ↓
JSON.parse()
     ↓
AIReport
     ↓
Dashboard Components
```

Free-form Markdown would make this pipeline less reliable.

---

# 38. Report Generation

The public generation method follows this sequence:

```ts
async generate(
  input: AIReportInput
): Promise<AIReport>
```

Conceptually:

```text
Input
  ↓
Build Prompt
  ↓
AI Client
  ↓
Raw String Response
  ↓
Parse JSON
  ↓
Validate Report
  ↓
Return AIReport
```

---

# 39. Prompt Generation

The first step is:

```ts
const messages =
  this.buildPrompt(input);
```

This creates the complete prompt using:

```text
REPORT_SYSTEM_PROMPT
```

and:

```text
buildReportUserPrompt(input)
```

---

# 40. AI Generation

The prompt is sent to the configured AI client.

```ts
const response =
  await this.aiClient.generate(messages);
```

The response is expected to be a string containing valid JSON.

---

# 41. JSON Parsing

The response is passed to:

```ts
parseReport(response)
```

The implementation uses:

```ts
JSON.parse(response)
```

If parsing fails, AIP throws:

```text
The AI response is not valid JSON.
```

This prevents malformed AI responses from silently propagating through the application.

---

# 42. Why Parsing Validation Matters

An AI provider could theoretically return:

```text
Here is the JSON:
{
  ...
}
```

This is readable by a human but invalid for direct `JSON.parse()`.

By failing explicitly, AIP preserves a strict application contract.

---

# 43. Report Validation

Successful JSON parsing is not sufficient.

The object could still be incomplete.

For example:

```json
{
  "executiveSummary": "..."
}
```

is valid JSON but not a valid AIP report.

Therefore AIP performs a second validation step.

---

# 44. Required Fields

The Report Engine requires:

```text
executiveSummary

strengths

weaknesses

recommendations

priorityActions

technicalAnalysis
```

Every field must be present.

---

# 45. Empty Field Validation

The Report Engine rejects:

```text
undefined
null
empty string
empty array
```

for required fields.

Conceptually:

```ts
if (
  value === undefined ||
  value === null ||
  emptyString ||
  emptyArray
) {
  throw new Error(...)
}
```

---

# 46. Validation Error

When a required field is missing or empty, AIP throws an explicit error.

Example:

```text
The AI report is incomplete:
field "recommendations"
is missing or empty.
```

This makes AI failures easier to diagnose.

---

# 47. Two-Level Validation

The complete validation strategy is therefore:

```text
AI RESPONSE
     │
     ▼
Is it valid JSON?
     │
     ├── NO → Error
     │
     ▼
    YES
     │
     ▼
Are required fields complete?
     │
     ├── NO → Error
     │
     ▼
    YES
     │
     ▼
Valid AIReport
```

---

# 48. Current Validation Boundary

The V2 validator verifies:

```text
Required fields exist
Strings are not empty
Arrays are not empty
```

It does not yet perform complete schema validation.

For example, a future validator could verify:

```text
strengths is really string[]

priorityActions contains maximum 5 items

No unexpected properties

Correct nested types
```

---

# 49. Future Schema Validation

A future version could use a schema validation library.

Conceptually:

```text
AI Response
    ↓
JSON Parse
    ↓
Schema Validation
    ↓
Typed AIReport
```

Possible technologies include schema validators compatible with TypeScript.

This would strengthen the output contract.

---

# 50. Priority Action Limit

The prompt explicitly requests:

```text
Maximum 5 priority actions
```

This keeps the report focused.

Future validation could also enforce this rule programmatically.

For example:

```ts
if (
  report.priorityActions.length > 5
) {
  throw new Error(...)
}
```

In V2, the prompt is the primary enforcement mechanism for this limit.

---

# 51. Facts, Risks and Recommendations

The AI must distinguish three concepts.

## Facts

Directly supported by audit data.

Example:

```text
Google Tag Manager was detected.
```

## Risks

Potential implications of those facts.

Example:

```text
Multiple Tag Management Systems may create
governance complexity.
```

## Recommendations

Actions suggested in response.

Example:

```text
Review tag ownership and remove unnecessary duplication.
```

This distinction improves report quality.

---

# 52. AI Should Not Re-Detect Technologies

The AI receives raw signals, but it should not use them to independently confirm unsupported technologies.

Example:

```text
Raw HTML contains:
"Real Cookie Banner"
```

If no dedicated detector confirmed the technology, the AI should not automatically write:

```text
Real Cookie Banner is installed.
```

Technology confirmation belongs to the Detection Engine.

---

# 53. Why Raw Signals Are Still Provided

Raw signals remain useful because they provide:

```text
Context
Technical evidence
Debug information
Potential implementation clues
```

However, the system prompt establishes that the AI must use the provided structured findings cautiously.

Future versions may further restrict which raw signals are sent to the AI.

---

# 54. AI and Knowledge Insights

The Knowledge Engine reduces the amount of inference required from the AI.

Example input:

```text
GTM detected
GA4 not detected
```

Without Knowledge Engine:

```text
AI must infer the relationship.
```

With Knowledge Engine:

```text
GA4 may be configured through GTM.
```

The AI can focus on explaining and prioritizing the finding.

---

# 55. AI and Scoring

The Scoring Engine similarly reduces ambiguity.

Instead of asking the AI:

```text
How mature is this website?
```

AIP provides:

```text
Global Score: 65/100

Analytics: 20/20

Tag Management: 20/20

Consent: 10/20

Marketing: 5/20

Data Quality: 10/20
```

The AI can explain the maturity profile without inventing a score.

---

# 56. Report Consistency

The report should remain consistent with all upstream engines.

For example:

```text
Detection:
Didomi = true
```

The AI should not write:

```text
No CMP was detected.
```

Similarly:

```text
Scoring:
Data Quality = 15/20
```

The AI should not describe Data Quality as completely absent.

This consistency is part of the report quality requirement.

---

# 57. AI Report QA

AI report quality should be reviewed against several questions.

```text
Does the report match the detection result?

Does it respect Knowledge Engine insights?

Does it use the actual scoring result?

Does it avoid claiming absence without proof?

Does it invent technologies?

Does it invent IDs?

Does it invent compliance conclusions?

Are recommendations linked to findings?

Are priority actions actionable?
```

---

# 58. V2 QA Findings

During V2 validation, report wording was reviewed carefully.

Several forms of overstatement were identified as undesirable.

Examples include phrases equivalent to:

```text
"guarantees active tracking"

"implementation is definitely incomplete"

"technology is absent"
```

when the deterministic evidence did not fully justify those conclusions.

The report prompts were strengthened accordingly.

---

# 59. Overstatement Prevention

The prompt now explicitly requires the model to:

```text
Remain strictly factual

Use only provided information

Distinguish facts from risks

Respect static detection limitations
```

This is particularly important when dealing with:

```text
GA4 through GTM
CMP detection
Consent Mode
Server-side tracking
Dynamic tags
```

---

# 60. Compliance Language

The AI should be careful with legal conclusions.

For example:

```text
No supported CMP confirmed
```

does not automatically prove:

```text
GDPR violation
```

The report can recommend:

```text
Consent configuration should be reviewed.
```

It should avoid presenting AIP as a legal compliance certification tool.

---

# 61. Scoring Language

The AI should also explain that scoring reflects observable evidence.

Appropriate concept:

```text
The score reflects the implementation signals
observable by the current AIP analysis.
```

This is more accurate than treating the score as an absolute measurement of the entire Analytics architecture.

---

# 62. Fetch Failure

If the HTML Fetcher fails, the normal report pipeline should not generate a standard audit report from nonexistent evidence.

Examples:

```text
HTTP 403
Timeout
DNS error
Anti-bot protection
```

The application should return an audit error rather than asking the AI to speculate.

---

# 63. AI Failure

The AI provider can also fail independently.

Possible cases include:

```text
API unavailable

Timeout

Invalid credentials

Rate limit

Invalid JSON response

Incomplete report
```

These failures should remain distinguishable from Detection Engine failures.

---

# 64. Separation of Failure Domains

AIP has several possible failure domains.

```text
FETCH FAILURE
     │
     └── Website could not be retrieved

DETECTION FAILURE
     │
     └── Technical analysis failed

SCORING FAILURE
     │
     └── Deterministic evaluation failed

AI FAILURE
     │
     └── Report generation failed
```

Keeping these domains separate improves debugging and future observability.

---

# 65. AI Provider Independence

Because the Report Engine depends on an `AIClient`, future versions can potentially support different providers or models.

Conceptually:

```text
AIReportEngine
      │
      ▼
AIClient Interface
      │
      ├── OpenAI Client
      ├── Future Provider
      └── Test / Mock Client
```

The report engine itself does not need to change.

---

# 66. Testing With a Mock AI Client

The AI client abstraction also makes unit testing easier.

A test can provide a fake client:

```ts
class MockAIClient implements AIClient {
  async generate(): Promise<string> {
    return JSON.stringify({
      executiveSummary: "Test",
      strengths: ["Test"],
      weaknesses: ["Test"],
      recommendations: ["Test"],
      priorityActions: ["Test"],
      technicalAnalysis: "Test"
    });
  }
}
```

The Report Engine can then be tested without calling an external AI API.

---

# 67. Invalid JSON Test

A useful unit test is:

```text
Mock AI response:

"This is not JSON"
```

Expected result:

```text
The AI response is not valid JSON.
```

This validates `parseReport()`.

---

# 68. Missing Field Test

Another useful test:

```json
{
  "executiveSummary": "Test",
  "strengths": [
    "Test"
  ]
}
```

Expected result:

```text
Report validation error
```

because required fields are missing.

---

# 69. Empty Array Test

Example:

```json
{
  "executiveSummary": "Test",
  "strengths": [],
  "weaknesses": ["Test"],
  "recommendations": ["Test"],
  "priorityActions": ["Test"],
  "technicalAnalysis": "Test"
}
```

Expected:

```text
Validation failure
```

because `strengths` is empty.

---

# 70. Empty String Test

Example:

```json
{
  "executiveSummary": "",
  "strengths": ["Test"],
  "weaknesses": ["Test"],
  "recommendations": ["Test"],
  "priorityActions": ["Test"],
  "technicalAnalysis": "Test"
}
```

Expected:

```text
Validation failure
```

because `executiveSummary` is empty.

---

# 71. Language Test

The Report Engine should also be tested with:

```text
language = fr
```

and:

```text
language = en
```

Expected:

```text
French human-readable content
```

or:

```text
English human-readable content
```

while technical identifiers remain unchanged.

---

# 72. Prompt Regression Testing

Prompt changes can affect report behavior even when TypeScript compilation succeeds.

Therefore prompt modifications should be tested against representative audit cases.

Examples:

```text
GTM / GA4 architecture

Adobe architecture

CMP architecture

Rich DataLayer

Low-signal site
```

The objective is to detect report regressions such as:

```text
Hallucinated technologies

Overstatement

Wrong language

Missing recommendations

Inconsistent scoring explanation
```

---

# 73. Why Prompt Changes Are Product Changes

A prompt is not merely text.

In AIP, prompts influence:

```text
Audit interpretation

Recommendation quality

Tone

Risk communication

Technical accuracy
```

Therefore prompt modifications should be treated similarly to application logic changes.

They require testing.

---

# 74. Prompt Versioning

A future version could introduce:

```text
reportPromptVersion
```

Example:

```json
{
  "reportPromptVersion": "2.0"
}
```

This would help understand why historical reports differ after prompt evolution.

---

# 75. Model Versioning

Similarly, future audit metadata could record:

```text
AI provider
Model
Prompt version
Generated timestamp
```

Example:

```json
{
  "provider": "OpenAI",
  "model": "...",
  "promptVersion": "2.0",
  "generatedAt": "..."
}
```

This would improve audit reproducibility.

---

# 76. Observability

Future versions could record AI execution metadata such as:

```text
Generation duration

Provider

Model

Retry count

Validation status

Failure reason
```

Sensitive information and unnecessary prompt content should not be exposed to users.

---

# 77. Retry Strategy

A future implementation could retry when:

```text
JSON is invalid
```

or:

```text
Required fields are missing
```

Conceptually:

```text
AI Generation
     ↓
Validation
     │
     ├── Valid → Return Report
     │
     └── Invalid
            ↓
        Controlled Retry
```

Retries should remain limited to avoid unnecessary cost and latency.

---

# 78. Structured Output APIs

Future AI provider capabilities may allow schema-constrained structured outputs.

This could replace part of the current:

```text
Prompt JSON instructions
        +
JSON.parse()
        +
Manual validation
```

with:

```text
Provider-enforced schema
```

The current V2 implementation remains provider-independent and straightforward.

---

# 79. Cost Control

The AI Report Engine receives potentially large detection structures.

Future optimization may reduce token usage by sending only:

```text
Relevant detections

Relevant evidence

Knowledge insights

Scoring results
```

instead of large raw HTML snippets.

This could improve:

```text
Latency

Cost

Prompt clarity

Report consistency
```

---

# 80. Security Considerations

Website HTML is external and untrusted input.

Even though the AI receives structured data, future versions should consider prompt injection attempts embedded in audited website content.

For example, a website could contain text such as:

```text
Ignore previous instructions...
```

AIP should never treat website content as authoritative AI instructions.

---

# 81. Prompt Injection Boundary

The architecture should preserve:

```text
SYSTEM INSTRUCTIONS
        ↓
AIP AUDIT DATA
        ↓
UNTRUSTED WEBSITE SIGNALS
```

Website content must remain data.

It must never become instructions controlling the AI.

This will become increasingly important as AIP analyzes richer runtime content.

---

# 82. Future Evidence Filtering

A future preprocessing layer could sanitize or summarize raw evidence before sending it to the AI.

Conceptually:

```text
Raw Signals
     ↓
Evidence Filter
     ↓
Relevant Structured Evidence
     ↓
AI Report Engine
```

This could improve both security and efficiency.

---

# 83. Future Recommendation Library

AIP may eventually combine deterministic recommendation templates with AI wording.

Example:

```text
Knowledge Rule:
gtm-without-visible-ga4

        ↓

Recommendation Template:
Verify GA4 deployment through GTM
and inspect runtime requests.

        ↓

AI:
Contextualizes and prioritizes wording
```

This would further reduce generative uncertainty.

---

# 84. Future Report Formats

The structured `AIReport` can later power several output formats.

Examples:

```text
Web Dashboard

PDF Report

PowerPoint Presentation

Executive Summary

Technical Audit

Client Deliverable
```

The AI Report Engine therefore produces structured content rather than presentation-specific markup.

---

# 85. PDF Export

A future PDF generator could consume:

```text
Detection
Knowledge
Scoring
AIReport
```

without asking the AI to regenerate the report.

Conceptually:

```text
Audit Result
     ↓
PDF Renderer
     ↓
Professional Client Report
```

This keeps generation and presentation separate.

---

# 86. PowerPoint Export

The same principle can support PowerPoint.

```text
Executive Summary
      ↓
Slide 1

Global Score
      ↓
Slide 2

Category Scores
      ↓
Slide 3

Strengths / Weaknesses
      ↓
Slide 4

Priority Actions
      ↓
Slide 5
```

The structured AIReport makes this possible.

---

# 87. Different Audiences

Future versions may generate report variants for different audiences.

Examples:

```text
Executive

Digital Analytics Consultant

Developer

Marketing Team

Data Team
```

The underlying facts and score should remain identical.

Only the explanation depth and presentation should change.

---

# 88. Report Engine Boundary

The AI Report Engine should remain:

```text
STRUCTURED AUDIT DATA
        ↓
CONTROLLED GENERATION
        ↓
VALIDATION
        ↓
STRUCTURED REPORT
```

It should not become:

```text
a detector

a scoring engine

a compliance certification engine
```

This boundary protects the architecture.

---

# 89. Current V2 Guarantees

The AI Report Engine aims to preserve the following guarantees:

```text
The AI receives structured audit data.

The AI does not own technology detection.

The AI does not own scoring.

The AI must respect uncertainty.

The response must be JSON.

Required fields must be present.

Empty required fields are rejected.

Report language is controlled.

Technical identifiers are preserved.
```

---

# 90. Current V2 Limitations

The current Report Engine still has limitations.

Examples:

```text
Prompt compliance depends partly on the AI model.

Schema validation is currently limited.

Priority action maximum is prompt-driven.

AI output can still require regression testing.

Raw signals can increase prompt size.

Report generation depends on an external AI service.
```

These limitations are known and can be improved incrementally.

---

# 91. Long-Term Direction

The long-term AI architecture can evolve toward:

```text
Deterministic Evidence
        ↓
Deterministic Knowledge
        ↓
Deterministic Scoring
        ↓
Deterministic Recommendation Candidates
        ↓
AI Synthesis
        ↓
Schema Validation
        ↓
Professional Multi-Format Report
```

This would further reduce the amount of uncontrolled reasoning delegated to the model.

---

# 92. Why the AI Layer Matters

Without the AI Report Engine, AIP could already produce:

```text
Technologies

Evidence

Insights

Scores
```

But a professional audit also requires communication.

The AI layer transforms:

```text
Technical Audit Data
```

into:

```text
Decision-Making Information
```

This is where Generative AI provides its strongest value in the AIP architecture.

---

# 93. AIP AI Philosophy

AIP does not use AI to replace deterministic Analytics engineering.

Instead:

```text
DETERMINISTIC CODE
      ↓
Reliability

DOMAIN RULES
      ↓
Consistency

AI
      ↓
Communication
Prioritization
Synthesis
```

The layers complement each other.

---

# 94. End-to-End Example

Suppose the Detection Engine returns:

```text
GTM detected

GA4 not directly detected

DataLayer detected

Didomi detected
```

The Knowledge Engine adds:

```text
GA4 may be configured through GTM.

CMP detected:
Consent Mode should be verified.
```

The Scoring Engine calculates:

```text
Global Score: 75 / 100
```

The AI Report Engine can then produce:

```text
Executive Summary

The audited implementation presents a structured
Tag Management and consent architecture.

Google Tag Manager and a DataLayer were identified,
while GA4 could not be confirmed directly from the
static HTML and may require runtime verification.

The main priority is to validate the effective Analytics
collection and Consent Mode behavior in a browser environment.
```

The AI adds communication value without changing the technical facts.

---

# 95. Complete AI Report Pipeline

```text
AIReportInput
     │
     ▼
buildPrompt()
     │
     ├── REPORT_SYSTEM_PROMPT
     │
     └── buildReportUserPrompt()
     │
     ▼
AIClient.generate()
     │
     ▼
Raw String
     │
     ▼
parseReport()
     │
     ├── Invalid JSON
     │       ↓
     │      Error
     │
     ▼
AIReport Object
     │
     ▼
validateReport()
     │
     ├── Missing / Empty Field
     │       ↓
     │      Error
     │
     ▼
Validated AIReport
     │
     ▼
API Response
     │
     ▼
Audit Dashboard
```

---

# 96. Summary

The AI Report Engine is the final intelligence and communication layer of AIP V2.

It receives:

```text
Detection
Knowledge
Scoring
```

and produces:

```text
Executive Summary
Strengths
Weaknesses
Recommendations
Priority Actions
Technical Analysis
```

Its central architectural rule is:

> **The AI explains and prioritizes evidence established by deterministic engines; it does not replace that evidence.**

The complete AIP reasoning chain is therefore:

```text
DETECTION
"What can be confirmed?"

        ↓

KNOWLEDGE
"What does it mean?"

        ↓

SCORING
"How does it perform?"

        ↓

AI REPORT
"How should it be explained and improved?"
```

---

# Related Documentation

- [`architecture.md`](./architecture.md)
- [`detection-engine.md`](./detection-engine.md)
- [`knowledge-engine.md`](./knowledge-engine.md)
- [`scoring-engine.md`](./scoring-engine.md)
- [`api.md`](./api.md)
- [`testing.md`](./testing.md)
- [`limitations.md`](./limitations.md)
- [`roadmap.md`](./roadmap.md)

---

**AIP — Analytics Intelligence Platform**

**Analyze. Score. Improve.**