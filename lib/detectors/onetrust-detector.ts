import type { AnalyticsToolDetection } from "../types";

export function detectOneTrust(
  html: string
): AnalyticsToolDetection {
  const oneTrustDomainDetected =
    /onetrust\.com|cookielaw\.org|cdn\.cookielaw\.org/i.test(html);

  const oneTrustScriptDetected =
    /otSDKStub\.js|OneTrust\.js|OptanonWrapper/i.test(html);

  const oneTrustObjectDetected =
    /window\.OneTrust|\bOneTrust\b|\bOptanon\b/i.test(html);

  const optanonConsentDetected =
    /OptanonConsent/i.test(html);

  const optanonAlertBoxDetected =
    /OptanonAlertBoxClosed/i.test(html);

  const domainScriptRegex =
    /data-domain-script=["']([A-Za-z0-9_-]+)["']/i;

  const domainScriptId =
    html.match(domainScriptRegex)?.[1];

  const oneTrustIdRegex =
    /(?:domainId|domainID|data-domain-script)["'\s:=]+["']?([A-Za-z0-9_-]+)/i;

  const oneTrustId =
    domainScriptId ??
    html.match(oneTrustIdRegex)?.[1];

  const present =
    oneTrustDomainDetected ||
    oneTrustScriptDetected ||
    oneTrustObjectDetected ||
    optanonConsentDetected ||
    optanonAlertBoxDetected;

  return {
    name: "OneTrust",

    key: "onetrust",

    vendor: "OneTrust",

    category: "Consent",

    documentationUrl:
      "https://developer.onetrust.com/",

    description:
      "OneTrust est une Consent Management Platform utilisée pour gérer le consentement, les préférences utilisateurs et la conformité réglementaire.",

    present,

    status:
      present
        ? "Détecté directement"
        : "Non détecté",

    ids:
      oneTrustId
        ? [oneTrustId]
        : [],

    evidence: [
      ...(oneTrustDomainDetected
        ? ["onetrust.com / cookielaw.org"]
        : []),

      ...(oneTrustScriptDetected
        ? ["Script OneTrust"]
        : []),

      ...(oneTrustObjectDetected
        ? ["Objet global OneTrust"]
        : []),

      ...(optanonConsentDetected
        ? ["Cookie OptanonConsent"]
        : []),

      ...(optanonAlertBoxDetected
        ? ["Cookie OptanonAlertBoxClosed"]
        : []),

      ...(oneTrustId
        ? ["Domain Script ID OneTrust"]
        : []),
    ],

    sources:
      present
        ? ["HTML statique", "Script externe", "Script inline"]
        : [],

    certainty:
      oneTrustDomainDetected ||
      oneTrustScriptDetected ||
      oneTrustObjectDetected
        ? "Élevé"
        : present
          ? "Moyen"
          : "Faible",

    details: {
      oneTrustId,

      domainScriptId,

      oneTrustDomainDetected,

      oneTrustScriptDetected,

      oneTrustObjectDetected,

      optanonConsentDetected,

      optanonAlertBoxDetected,
    },
  };
}