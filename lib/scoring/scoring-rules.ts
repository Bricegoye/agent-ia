import type {
  AnalyticsToolDetection,
  CertaintyLevel,
  ToolCategory,
} from "../types";

import type { ScoreCategory } from "./scoring-types";

export interface ScoringRule {
  id: string;
  category: ScoreCategory;
  points: number;
  description: string;

  toolKeys?: string[];
  toolCategories?: ToolCategory[];
  minimumCertainty?: CertaintyLevel;

  match: (
    tools: AnalyticsToolDetection[],
  ) => boolean;
}

function certaintyValue(certainty: CertaintyLevel): number {
  switch (certainty) {
    case "Élevé":
      return 3;
    case "Moyen":
      return 2;
    case "Faible":
      return 1;
  }
}

function hasDetectedTool(
  tools: AnalyticsToolDetection[],
  options: {
    keys?: string[];
    categories?: ToolCategory[];
    minimumCertainty?: CertaintyLevel;
  },
): boolean {
  const minimumCertainty = options.minimumCertainty ?? "Faible";

  return tools.some((tool) => {
    const matchesKey =
      !options.keys ||
      options.keys.length === 0 ||
      options.keys.includes(tool.key);

    const matchesCategory =
      !options.categories ||
      options.categories.length === 0 ||
      options.categories.includes(tool.category);

    const matchesCertainty =
      certaintyValue(tool.certainty) >=
      certaintyValue(minimumCertainty);

    return (
      tool.present &&
      matchesKey &&
      matchesCategory &&
      matchesCertainty
    );
  });
}

export const scoringRules: ScoringRule[] = [
  {
    id: "analytics-tool-detected",
    category: "analytics",
    points: 20,
    description:
      "Au moins un outil Analytics fiable est détecté.",
    toolCategories: ["Analytics"],
    minimumCertainty: "Moyen",
    match: (tools) =>
      hasDetectedTool(tools, {
        categories: ["Analytics"],
        minimumCertainty: "Moyen",
      }),
  },
  {
    id: "tag-management-detected",
    category: "tagManagement",
    points: 20,
    description:
      "Au moins un outil de Tag Management fiable est détecté.",
    toolCategories: ["Tag Management"],
    minimumCertainty: "Moyen",
    match: (tools) =>
      hasDetectedTool(tools, {
        categories: ["Tag Management"],
        minimumCertainty: "Moyen",
      }),
  },
  {
    id: "consent-platform-detected",
    category: "consent",
    points: 20,
    description:
      "Au moins une plateforme de consentement fiable est détectée.",
    toolCategories: ["Consent"],
    minimumCertainty: "Moyen",
    match: (tools) =>
      hasDetectedTool(tools, {
        categories: ["Consent"],
        minimumCertainty: "Moyen",
      }),
  },
  {
    id: "advertising-tool-detected",
    category: "marketing",
    points: 20,
    description:
      "Au moins un outil publicitaire fiable est détecté.",
    toolCategories: ["Advertising"],
    minimumCertainty: "Moyen",
    match: (tools) =>
      hasDetectedTool(tools, {
        categories: ["Advertising"],
        minimumCertainty: "Moyen",
      }),
  },
  {
    id: "data-layer-detected",
    category: "dataQuality",
    points: 20,
    description:
      "Un DataLayer fiable est détecté.",
    toolCategories: ["DataLayer"],
    minimumCertainty: "Moyen",
    match: (tools) =>
      hasDetectedTool(tools, {
        categories: ["DataLayer"],
        minimumCertainty: "Moyen",
      }),
  },
];