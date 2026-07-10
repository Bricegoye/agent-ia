import type { AnalyticsToolDetection } from "../types";

export function detectTikTokPixel(
  html: string
): AnalyticsToolDetection {

  const pixelIdRegex =
    /ttq\.load\(['"]([A-Z0-9]+)['"]\)/i;

  const pixelId = html.match(pixelIdRegex)?.[1];

  const sdkDetected =
    /analytics\.tiktok\.com\/i18n\/pixel/i.test(html);

  const ttqDetected =
    /ttq\.(page|track|identify|load)/i.test(html);

  const present =
    Boolean(pixelId) ||
    sdkDetected ||
    ttqDetected;

  return {

    name: "TikTok Pixel",

    key: "tiktok-pixel",

    vendor: "TikTok",

    category: "Advertising",

    documentationUrl:
      "https://ads.tiktok.com/help/article/tiktok-pixel",

    description:
      "TikTok Pixel permet de mesurer les conversions et d'optimiser les campagnes publicitaires TikTok Ads.",

    present,

    status: present
      ? "Détecté directement"
      : "Non détecté",

    ids: pixelId ? [pixelId] : [],

    evidence: [
      ...(pixelId ? ["ttq.load()"] : []),
      ...(sdkDetected
        ? ["analytics.tiktok.com"]
        : []),
      ...(ttqDetected
        ? ["ttq.track()"]
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

      sdkDetected,

      ttqDetected,
    },
  };
}