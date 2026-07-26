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

/**
 * Convertit le niveau de certitude en valeur numérique
 * afin de pouvoir comparer les niveaux.
 */
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

/**
 * Vérifie si au moins un outil détecté correspond
 * aux critères demandés.
 */
function hasDetectedTool(
  tools: AnalyticsToolDetection[],
  options: {
    keys?: string[];
    categories?: ToolCategory[];
    minimumCertainty?: CertaintyLevel;
  },
): boolean {
  const minimumCertainty =
    options.minimumCertainty ?? "Faible";

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

/**
 * Récupère les informations détaillées du DataLayer.
 *
 * Le Detection Engine stocke notamment :
 * - eventCount
 * - businessEventCount
 * - standardVariableCount
 * - ecommerceDetected
 * - consentSignals
 */
function getDataLayerDetails(
  tools: AnalyticsToolDetection[],
): Record<string, unknown> | undefined {
  return tools.find(
    (tool) =>
      tool.key === "datalayer" &&
      tool.present,
  )?.details;
}

/**
 * Règles de scoring AIP V2.
 *
 * Chaque catégorie possède un maximum de 20 points.
 *
 * Analytics       : 20
 * Tag Management  : 20
 * Consent         : 20
 * Marketing       : 20
 * Data Quality    : 20
 *
 * Total           : 100
 */
export const scoringRules: ScoringRule[] = [
  /**
   * ANALYTICS
   *
   * Pour le moment :
   * un outil Analytics fiable détecté = 20 points.
   *
   * La gestion de l'incertitude
   * "NOT DETECTED ≠ ABSENT"
   * sera traitée séparément.
   */
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

  /**
   * TAG MANAGEMENT
   */
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

  /**
   * CONSENT
   *
   * La distinction CMP / TCF / Consent Mode
   * sera améliorée dans un correctif séparé.
   */
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

  /**
   * MARKETING / ADVERTISING
   */
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

  /**
   * DATA QUALITY
   *
   * Le score Data Quality devient progressif.
   *
   * Avant :
   *
   * DataLayer détecté = 20 / 20
   *
   * Maintenant :
   *
   * DataLayer détecté                +5
   * Événements détectés              +3
   * Événements métier détectés       +5
   * Variables standardisées          +4
   * E-commerce ou consent signals    +3
   *
   * Maximum                          20
   */

  /**
   * 1 — Présence du DataLayer
   *
   * La simple présence technique ne suffit plus
   * à obtenir 20/20.
   */
  {
    id: "data-layer-detected",
    category: "dataQuality",
    points: 5,
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

  /**
   * 2 — Présence d'événements
   *
   * Peut inclure des événements techniques GTM
   * comme gtm.js.
   */
  {
    id: "data-layer-events-detected",
    category: "dataQuality",
    points: 3,
    description:
      "Le DataLayer contient des événements.",

    match: (tools) => {
      const details = getDataLayerDetails(tools);

      return (
        typeof details?.eventCount === "number" &&
        details.eventCount > 0
      );
    },
  },

  /**
   * 3 — Présence d'événements métier
   *
   * Les événements internes GTM sont exclus
   * par le DataLayer Detector.
   */
  {
    id: "data-layer-business-events-detected",
    category: "dataQuality",
    points: 5,
    description:
      "Le DataLayer contient des événements métier.",

    match: (tools) => {
      const details = getDataLayerDetails(tools);

      return (
        typeof details?.businessEventCount === "number" &&
        details.businessEventCount > 0
      );
    },
  },

  /**
   * 4 — Variables standardisées
   *
   * Exemples :
   * page_name
   * page_type
   * user_id
   * currency
   * transaction_id
   * search_term
   * etc.
   */
  {
    id: "data-layer-standard-variables-detected",
    category: "dataQuality",
    points: 4,
    description:
      "Le DataLayer contient des variables standardisées.",

    match: (tools) => {
      const details = getDataLayerDetails(tools);

      return (
        typeof details?.standardVariableCount === "number" &&
        details.standardVariableCount > 0
      );
    },
  },

  /**
   * 5 — Signaux avancés
   *
   * Présence d'informations e-commerce
   * OU de signaux liés au consentement.
   */
  {
    id: "data-layer-advanced-signals-detected",
    category: "dataQuality",
    points: 3,
    description:
      "Le DataLayer contient des signaux e-commerce ou de consentement.",

    match: (tools) => {
      const details = getDataLayerDetails(tools);

      return (
        details?.ecommerceDetected === true ||
        details?.consentSignals === true
      );
    },
  },
];