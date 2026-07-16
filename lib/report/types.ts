import type {
  AnalyticsDetectionResult,
  AnalyticsInsight,
} from "../types";

import type { AuditScore } from "../scoring/scoring-types";

export interface AIReportInput {
  detection: AnalyticsDetectionResult;
  knowledge: AnalyticsInsight[];
  scoring: AuditScore;
}

export interface AIReport {
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  priorityActions: string[];
  technicalAnalysis: string;
}