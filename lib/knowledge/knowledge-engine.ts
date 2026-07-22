import type {
  AnalyticsDetectionResult,
  AnalyticsInsight,
} from "../types";

import { evaluateKnowledgeRules } from "./rules";

export class KnowledgeEngine {

  /**
   * Génère les insights métier
   */
  generateInsights(
    result: AnalyticsDetectionResult
  ): AnalyticsInsight[] {
    return evaluateKnowledgeRules(result);
  }

  /**
   * Enrichit le résultat de détection
   */
  analyze(
    result: AnalyticsDetectionResult
  ): AnalyticsDetectionResult {

    const knowledgeInsights = this.generateInsights(result);

    return {
      ...result,
      insights: [
        ...(result.insights ?? []),
        ...knowledgeInsights,
      ],
    };
  }

}