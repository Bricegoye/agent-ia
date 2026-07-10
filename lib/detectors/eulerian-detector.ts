import type { AnalyticsToolDetection } from "../types";

export function detectEulerian(
  html: string
): AnalyticsToolDetection {
  const eulerianDomainDetected =
    /eulerian\.(net|com)/i.test(html);

  const collectorDetected =
    /collector\.eulerian\.(net|com)/i.test(html);

  const analyticsDetected =
    /analytics\.eulerian\.(net|com)/i.test(html);

  const pixelDetected =
    /pixel\.eulerian\.(net|com)/i.test(html);

  const eaPushDetected =
    /\bEA_push\b/i.test(html);

  const eaDataLayerDetected =
    /\bEA_datalayer\b/i.test(html);

  const eaEventDetected =
    /\bEA_event\b/i.test(html);

  const etuixDetected =
    /\betuix\b/i.test(html);

  const euidllsDetected =
    /\beuidlls\b/i.test(html);

  const trackerRegex =
    /https?:\/\/[^"'\s\\]*eulerian\.(?:net|com)[^"'\s\\]*/i;

  const trackerUrl =
    html.match(trackerRegex)?.[0];

  const present =
    eulerianDomainDetected ||
    collectorDetected ||
    analyticsDetected ||
    pixelDetected ||
    eaPushDetected ||
    eaDataLayerDetected ||
    eaEventDetected;

  return {
    name: "Eulerian",

    key: "eulerian",

    vendor: "Eulerian Technologies",
    
    category: "Analytics",

    documentationUrl:
      "https://eulerian.com",

    description:
      "Eulerian est une plateforme française de Digital Analytics et d’attribution marketing permettant le suivi des parcours utilisateurs et des performances marketing.",

    present,

    status:
      present
        ? "Détecté directement"
        : "Non détecté",

    ids:
      trackerUrl
        ? [trackerUrl]
        : [],

    evidence: [
      ...(eulerianDomainDetected
        ? ["eulerian.net / eulerian.com"]
        : []),

      ...(collectorDetected
        ? ["collector.eulerian"]
        : []),

      ...(analyticsDetected
        ? ["analytics.eulerian"]
        : []),

      ...(pixelDetected
        ? ["pixel.eulerian"]
        : []),

      ...(eaPushDetected
        ? ["EA_push"]
        : []),

      ...(eaDataLayerDetected
        ? ["EA_datalayer"]
        : []),

      ...(eaEventDetected
        ? ["EA_event"]
        : []),

      ...(etuixDetected
        ? ["Cookie etuix"]
        : []),

      ...(euidllsDetected
        ? ["Cookie euidlls"]
        : []),
    ],

    sources:
      present
        ? ["HTML statique", "Script externe", "Script inline"]
        : [],

    certainty:
      present
        ? "Élevé"
        : "Faible",

    details: {
      trackerUrl,

      eulerianDomainDetected,

      collectorDetected,

      analyticsDetected,

      pixelDetected,

      eaPushDetected,

      eaDataLayerDetected,

      eaEventDetected,

      etuixDetected,

      euidllsDetected,
    },
  };
}