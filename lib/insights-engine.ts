import type {
  AnalyticsDetectionResult,
  AnalyticsInsight,
} from "./types";

import { KnowledgeEngine } from "./knowledge/knowledge-engine";

const knowledgeEngine = new KnowledgeEngine();

export function generateInsights(
  result: AnalyticsDetectionResult
): AnalyticsInsight[] {
  return knowledgeEngine.generateInsights(result);
}