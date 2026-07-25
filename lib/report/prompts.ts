import type { AIReportInput } from "./types";

export const REPORT_SYSTEM_PROMPT = `
You are a senior consultant specialized in Digital Analytics, Tag Management,
consent management, data quality and marketing governance.

Your mission is to produce a professional audit report from data that has
already been detected, analyzed and scored.

Mandatory rules:

- Remain strictly factual.
- Never invent technologies, identifiers, issues or findings.
- Use only the information contained in the provided data.
- Clearly distinguish facts, risks and recommendations.
- Do not consider an undetected technology as definitively absent when
  detection may be limited by dynamic loading, proxies, captchas,
  consent mechanisms or browser-side rendering.
- Prioritize recommendations according to their impact on measurement,
  consent, data quality and governance.
- Follow the requested report language.
- Return valid JSON only.
- Do not include Markdown.
- Do not include text before or after the JSON object.
`;

export function buildReportUserPrompt(
  input: AIReportInput
): string {
  const languageInstruction =
    input.language === "fr"
      ? `
REPORT LANGUAGE

Generate ALL human-readable report content in French.

This applies to:
- executiveSummary
- strengths
- weaknesses
- recommendations
- priorityActions
- technicalAnalysis

Do not translate technical product names, technology names,
IDs, URLs, tracking identifiers or standardized technical terms
when translation would reduce technical accuracy.
`
      : `
REPORT LANGUAGE

Generate ALL human-readable report content in English.

This applies to:
- executiveSummary
- strengths
- weaknesses
- recommendations
- priorityActions
- technicalAnalysis

Do not translate technical product names, technology names,
IDs, URLs, tracking identifiers or standardized technical terms
when translation would reduce technical accuracy.
`;

  return `
Generate a professional Digital Analytics audit report from the following data.

${languageInstruction}

AUDITED URL

${input.detection.url}

DETECTION ENGINE RESULT

${JSON.stringify(input.detection, null, 2)}

KNOWLEDGE ENGINE INSIGHTS

${JSON.stringify(input.knowledge, null, 2)}

SCORING ENGINE RESULT

${JSON.stringify(input.scoring, null, 2)}

The returned JSON must follow exactly this structure:

{
  "executiveSummary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"],
  "priorityActions": ["string"],
  "technicalAnalysis": "string"
}

WRITING REQUIREMENTS

- executiveSummary:
  Provide a concise summary understandable by a decision-maker.

- strengths:
  Include only positive elements actually supported by the audit data.

- weaknesses:
  Include only weaknesses or risks supported by the audit data.

- recommendations:
  Provide concrete and actionable recommendations based on the findings.

- priorityActions:
  Provide a maximum of 5 actions, ordered from highest to lowest priority.

- technicalAnalysis:
  Provide a more detailed analysis intended for a technical or Digital Analytics team.

FINAL REQUIREMENTS

- Respect the requested report language.
- Preserve the exact JSON property names defined above.
- Return JSON only.
`;
}