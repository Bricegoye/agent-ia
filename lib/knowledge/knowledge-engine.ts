import type {
  AnalyticsDetectionResult,
  AnalyticsInsight,
} from "../types";

import { evaluateKnowledgeRules } from "./rules";

export function generateKnowledgeInsights(
  result: AnalyticsDetectionResult
): AnalyticsInsight[] {
  return evaluateKnowledgeRules(result);
}

export function enrichDetectionResult(
  result: AnalyticsDetectionResult
): AnalyticsDetectionResult {
  const knowledgeInsights = generateKnowledgeInsights(result);

  return {
    ...result,
    insights: [
      ...(result.insights ?? []),
      ...knowledgeInsights,
    ],
  };
}