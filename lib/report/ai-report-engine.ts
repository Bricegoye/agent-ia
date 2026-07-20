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

  async generate(input: AIReportInput): Promise<AIReport> {
    const messages = this.buildPrompt(input);

    const response = await this.aiClient.generate(messages);

    return this.parseReport(response);
  }
}