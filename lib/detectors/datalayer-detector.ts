import type { AnalyticsToolDetection } from "../types";

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function detectDataLayer(html: string): AnalyticsToolDetection {
  // Présence du DataLayer
  const windowDataLayerDetected =
    /window\.dataLayer|dataLayer\s*=|dataLayer\s*\|\|\s*\[\]/i.test(html);

  // Utilisation de dataLayer.push()
  const pushDetected = /dataLayer\.push\s*\(/i.test(html);

  // Détection des événements
  const eventMatches = [
    ...html.matchAll(/event\s*:\s*["']([^"']+)["']/gi),
  ];

  const events = unique(eventMatches.map((match) => match[1]));

  // Détection ecommerce
  const ecommerceDetected = /ecommerce/i.test(html);

  // Variables métier (première version)
  const variableCandidates = [
    "page_name",
    "page_category",
    "page_type",
    "user_id",
    "user_status",
    "currency",
    "language",
    "country",
  ];

  const variables = variableCandidates.filter((variable) =>
    new RegExp(variable, "i").test(html)
  );

  const present = windowDataLayerDetected || pushDetected;

  return {
    name: "Google DataLayer",
    key: "datalayer",
    vendor: "Google",
    category: "DataLayer",
    documentationUrl:
      "https://developers.google.com/tag-platform/tag-manager/datalayer",
    description:
      "Le DataLayer est une couche de données utilisée pour transmettre des informations métier à Google Tag Manager et aux solutions Analytics.",

    present,

    status: present ? "Détecté directement" : "Non détecté",

    ids: [],

    evidence: [
      ...(windowDataLayerDetected ? ["window.dataLayer"] : []),
      ...(pushDetected ? ["dataLayer.push()"] : []),
    ],

    sources: present ? ["HTML statique", "Script inline"] : [],

    certainty: present ? "Élevé" : "Faible",

    details: {
      windowDataLayerDetected,
      pushDetected,
      eventCount: events.length,
      events,
      ecommerceDetected,
      variableCount: variables.length,
      variables,
    },
  };
}