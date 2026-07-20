import type { AIClient, AIMessage } from "../ai";
import type { AIReport, AIReportInput } from "./types";

import {
  buildReportUserPrompt,
  REPORT_SYSTEM_PROMPT,
} from "./prompts";

export class AIReportEngine {
  constructor(private readonly aiClient: AIClient) {}

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

  private parseReport(response: string): AIReport {
    try {
      return JSON.parse(response) as AIReport;
    } catch {
      throw new Error(
        "La réponse retournée par l'IA n'est pas un JSON valide."
      );
    }
  }

  private validateReport(report: AIReport): AIReport {
    const requiredFields: (keyof AIReport)[] = [
      "executiveSummary",
      "strengths",
      "weaknesses",
      "recommendations",
      "priorityActions",
      "technicalAnalysis",
    ];

    for (const field of requiredFields) {
      const value = report[field];

      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        throw new Error(
          `Le rapport IA est incomplet : le champ "${field}" est manquant ou vide.`
        );
      }
    }

    return report;
  }

  async generate(input: AIReportInput): Promise<AIReport> {
    const messages = this.buildPrompt(input);

    const response = await this.aiClient.generate(messages);

    const report = this.parseReport(response);

    return this.validateReport(report);
  }
}