import type { AnalyticsToolDetection } from "../types";

export function detectAdobeLaunch(
  html: string
): AnalyticsToolDetection {
  const launchRegex =
    /assets\.adobedtm\.com\/(?:[^"'\\\s/]+\/)*(launch-[A-Za-z0-9_-]+(?:\.min)?\.js)/i;

  const match = html.match(launchRegex);

  const library = match?.[1];

  const present = Boolean(match);

  return {
    name: "Adobe Experience Platform Launch",

    key: "adobe-launch",

    vendor: "Adobe",

    category: "Tag Management",

    documentationUrl:
      "https://experienceleague.adobe.com/en/docs/experience-platform/tags/home",

    description:
      "Adobe Experience Platform Launch est le système de gestion de balises d'Adobe Experience Cloud.",

    present,

    status:
      present
        ? "Détecté directement"
        : "Non détecté",

    ids:
      library
        ? [library]
        : [],

    evidence:
      library
        ? [
            "assets.adobedtm.com",
            library,
          ]
        : [],

    sources:
      present
        ? ["Script externe"]
        : [],

    certainty:
      present
        ? "Élevé"
        : "Faible",

    details: {
      launchDetected: present,

      library,

      experienceCloud: present,
    },
  };
}