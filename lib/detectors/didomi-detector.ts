import type { AnalyticsToolDetection } from "../types";

export function detectDidomi(
  html: string
): AnalyticsToolDetection {
  const didomiDomainDetected =
    /didomi\.io|sdk\.privacy-center\.org/i.test(html);

  const didomiScriptDetected =
    /didomi\.js|didomi-loader|didomiConfig/i.test(html);

  const didomiObjectDetected =
    /window\.Didomi|\bDidomi\b/i.test(html);

  const didomiConsentDetected =
    /Didomi\.getCurrentUserStatus|Didomi\.setUserStatus|Didomi\.notice/i.test(html);

  const noticeIdRegex =
    /notice[_-]?id["'\s:=]+["']?([A-Za-z0-9_-]+)/i;

  const noticeId =
    html.match(noticeIdRegex)?.[1];

  const organizationIdRegex =
    /organization[_-]?id["'\s:=]+["']?([A-Za-z0-9_-]+)/i;

  const organizationId =
    html.match(organizationIdRegex)?.[1];

  const apiKeyRegex =
    /api[_-]?key["'\s:=]+["']?([A-Za-z0-9_-]+)/i;

  const apiKey =
    html.match(apiKeyRegex)?.[1];

  const present =
    didomiDomainDetected ||
    didomiScriptDetected ||
    didomiObjectDetected ||
    didomiConsentDetected;

  return {
    name: "Didomi",

    key: "didomi",

    vendor: "Didomi",

     category: "Consent",

    documentationUrl:
      "https://developers.didomi.io/",

    description:
      "Didomi est une Consent Management Platform utilisée pour collecter, gérer et transmettre les choix de consentement des utilisateurs.",

    present,

    status:
      present
        ? "Détecté directement"
        : "Non détecté",

    ids: [
      ...(noticeId ? [noticeId] : []),
      ...(organizationId ? [organizationId] : []),
      ...(apiKey ? [apiKey] : []),
    ],

    evidence: [
      ...(didomiDomainDetected
        ? ["didomi.io / sdk.privacy-center.org"]
        : []),

      ...(didomiScriptDetected
        ? ["Script Didomi"]
        : []),

      ...(didomiObjectDetected
        ? ["Objet global Didomi"]
        : []),

      ...(didomiConsentDetected
        ? ["API de consentement Didomi"]
        : []),

      ...(noticeId
        ? ["Notice ID Didomi"]
        : []),

      ...(organizationId
        ? ["Organization ID Didomi"]
        : []),
    ],

    sources:
      present
        ? ["HTML statique", "Script externe", "Script inline"]
        : [],

    certainty:
      didomiDomainDetected ||
      didomiScriptDetected ||
      didomiObjectDetected
        ? "Élevé"
        : present
          ? "Moyen"
          : "Faible",

    details: {
      noticeId,

      organizationId,

      apiKey,

      didomiDomainDetected,

      didomiScriptDetected,

      didomiObjectDetected,

      didomiConsentDetected,
    },
  };
}