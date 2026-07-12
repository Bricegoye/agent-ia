import type {
  AnalyticsDetectionResult,
  AnalyticsInsight,
} from "./types";

import { generateKnowledgeInsights } from "./knowledge/knowledge-engine";

export function generateInsights(
  result: AnalyticsDetectionResult
): AnalyticsInsight[] {
  return generateKnowledgeInsights(result);
}