import type {
  AnalyticsDetectionResult,
  AnalyticsInsight,
} from "../types";

import type { AuditScore } from "../scoring/scoring-types";

export type ReportLanguage = "fr" | "en";

export interface AIReportInput {
  detection: AnalyticsDetectionResult;
  knowledge: AnalyticsInsight[];
  scoring: AuditScore;
  language: ReportLanguage;
}

export interface AIReport {
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  priorityActions: string[];
  technicalAnalysis: string;
}