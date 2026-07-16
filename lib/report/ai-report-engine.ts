import type { AIMessage } from "../ai";
import type { AIReport, AIReportInput } from "./types";

import {
  buildReportUserPrompt,
  REPORT_SYSTEM_PROMPT,
} from "./prompts";

export class AIReportEngine {
  buildPrompt(input: AIReportInput): AIMessage[] {
    return [
      {
        role: "system",
        content: REPORT_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: buildReportUserPrompt(input),
      },
    ];
  }

  async generate(_input: AIReportInput): Promise<AIReport> {
    return {
      executiveSummary: "",
      strengths: [],
      weaknesses: [],
      recommendations: [],
      priorityActions: [],
      technicalAnalysis: "",
    };
  }
}