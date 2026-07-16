import type { AIReport, AIReportInput } from "./types";

import {
  buildReportUserPrompt,
  REPORT_SYSTEM_PROMPT,
} from "./prompts";

type ReportMessage = {
  role: "system" | "user";
  content: string;
};

export class AIReportEngine {
  buildPrompt(input: AIReportInput): ReportMessage[] {
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