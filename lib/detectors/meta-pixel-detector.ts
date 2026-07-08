import type { AnalyticsToolDetection } from "../types";

export function detectMetaPixel(
  html: string
): AnalyticsToolDetection {

  const pixelIdRegex =
    /fbq\(['"]init['"]\s*,\s*['"](\d+)['"]\)/i;

  const pixelId = html.match(pixelIdRegex)?.[1];

  const connectDetected =
    /connect\.facebook\.net/i.test(html);

  const trackDetected =
    /fbq\(['"]track['"]/i.test(html);

  const trackCustomDetected =
    /fbq\(['"]trackCustom['"]/i.test(html);

  const present =
    connectDetected ||
    Boolean(pixelId);

  return {

    name: "Meta Pixel",

    key: "meta-pixel",

    vendor: "Meta",

    category: "Advertising",

    documentationUrl:
      "https://developers.facebook.com/docs/meta-pixel/",

    description:
      "Meta Pixel permet de mesurer les conversions et d'optimiser les campagnes Facebook et Instagram Ads.",

    present,

    status: present
      ? "Détecté directement"
      : "Non détecté",

    ids: pixelId ? [pixelId] : [],

    evidence: [
      ...(pixelId ? ["fbq('init')"] : []),
      ...(connectDetected
        ? ["connect.facebook.net"]
        : []),
    ],

    sources: present
      ? ["Script externe", "Script inline"]
      : [],

    certainty: present
      ? "Élevé"
      : "Faible",

    details: {

      pixelId,

      trackDetected,

      trackCustomDetected,
    },
  };
}