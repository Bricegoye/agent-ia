import type { AnalyticsToolDetection } from "../types";

export function detectAxeptio(
  html: string
): AnalyticsToolDetection {
  const axeptioDomainDetected =
    /axept\.io|static\.axept\.io|client\.axept\.io/i.test(html);

  const axeptioScriptDetected =
    /axeptio\.js|axeptioSettings|axeptioSDK/i.test(html);

  const axeptioObjectDetected =
    /window\._axcb|window\.axeptio|\bAxeptio\b/i.test(html);

  const axeptioQueueDetected =
    /\b_axcb\b|_axcb\.push/i.test(html);

  const clientIdRegex =
    /clientId["'\s:=]+["']?([A-Za-z0-9_-]+)/i;

  const clientId =
    html.match(clientIdRegex)?.[1];

  const cookiesVersionRegex =
    /cookiesVersion["'\s:=]+["']?([A-Za-z0-9._-]+)/i;

  const cookiesVersion =
    html.match(cookiesVersionRegex)?.[1];

  const present =
    axeptioDomainDetected ||
    axeptioScriptDetected ||
    axeptioObjectDetected ||
    axeptioQueueDetected;

  return {
    name: "Axeptio",

    key: "axeptio",

    vendor: "Axeptio",

    category: "Consent",

    documentationUrl:
      "https://developers.axeptio.eu/",

    description:
      "Axeptio est une Consent Management Platform utilisée pour collecter et gérer les préférences de consentement des utilisateurs.",

    present,

    status:
      present
        ? "Détecté directement"
        : "Non détecté",

    ids: [
      ...(clientId ? [clientId] : []),
      ...(cookiesVersion ? [cookiesVersion] : []),
    ],

    evidence: [
      ...(axeptioDomainDetected
        ? ["axept.io"]
        : []),

      ...(axeptioScriptDetected
        ? ["Script Axeptio"]
        : []),

      ...(axeptioObjectDetected
        ? ["Objet global Axeptio"]
        : []),

      ...(axeptioQueueDetected
        ? ["Queue _axcb"]
        : []),

      ...(clientId
        ? ["Client ID Axeptio"]
        : []),

      ...(cookiesVersion
        ? ["Cookies version Axeptio"]
        : []),
    ],

    sources:
      present
        ? ["HTML statique", "Script externe", "Script inline"]
        : [],

    certainty:
      axeptioDomainDetected ||
      axeptioScriptDetected ||
      axeptioObjectDetected
        ? "Élevé"
        : present
          ? "Moyen"
          : "Faible",

    details: {
      clientId,

      cookiesVersion,

      axeptioDomainDetected,

      axeptioScriptDetected,

      axeptioObjectDetected,

      axeptioQueueDetected,
    },
  };
}