export type CertaintyLevel = "Élevé" | "Moyen" | "Faible";

export type DetectionStatus =
  | "Détecté directement"
  | "Possiblement chargé via GTM"
  | "Non détecté";

export type ToolCategory =
  | "Analytics"
  | "Tag Management"
  | "Consent"
  | "Advertising"
  | "UX Analytics"
  | "A/B Testing"
  | "DataLayer"
  | "Other";

export type AnalyticsToolDetection = {
  name: string;
  key: string;
  vendor: string;
  category: ToolCategory;
  documentationUrl: string;
  description: string;
  present: boolean;
  status: DetectionStatus;
  ids: string[];
  evidence: string[];
  sources: string[];
  certainty: CertaintyLevel;
};

export type AnalyticsDetectionResult = {
  url: string;
  fetchedAt: string;
  htmlSize: number;
  tools: AnalyticsToolDetection[];
  rawSignals: {
    scriptSrcs: string[];
    headSnippet: string;
    inlineScriptSnippet: string;
  };
};