import type { AnalyticsToolDetection } from "../types";

export function detectFloodlight(
  html: string
): AnalyticsToolDetection {
  const doubleClickDomainDetected =
    /fls\.doubleclick\.net|ad\.doubleclick\.net/i.test(html);

  const activityDetected =
    /\/activityi(?:;|\/|\?)/i.test(html);

  const floodlightKeywordDetected =
    /\bfloodlight\b/i.test(html);

  const dcSendToDetected =
    /send_to["'\s:]+["']DC-[A-Za-z0-9_-]+/i.test(html);

  const allowCustomScriptsDetected =
    /allow_custom_scripts["'\s:]+true/i.test(html);

  const ordParameterDetected =
    /[;?&]ord=/i.test(html);

  const srcParameterDetected =
    /[;?&]src=\d+/i.test(html);

  const typeParameterDetected =
    /[;?&]type=[A-Za-z0-9_-]+/i.test(html);

  const catParameterDetected =
    /[;?&]cat=[A-Za-z0-9_-]+/i.test(html);

  const floodlightUrlRegex =
    /https?:\/\/(?:fls|ad)\.doubleclick\.net\/activityi[^"'\s\\<]*/i;

  const floodlightUrl =
    html.match(floodlightUrlRegex)?.[0];

  const advertiserIdRegex =
    /(?:src=|DC-)(\d+)/i;

  const advertiserId =
    html.match(advertiserIdRegex)?.[1];

  const activityGroupRegex =
    /[;?&]type=([A-Za-z0-9_-]+)/i;

  const activityGroup =
    html.match(activityGroupRegex)?.[1];

  const activityTagRegex =
    /[;?&]cat=([A-Za-z0-9_-]+)/i;

  const activityTag =
    html.match(activityTagRegex)?.[1];

  const present =
    doubleClickDomainDetected ||
    activityDetected ||
    dcSendToDetected ||
    (
      srcParameterDetected &&
      typeParameterDetected &&
      catParameterDetected
    );

  return {
    name: "Floodlight",

    key: "floodlight",

    vendor: "Google",

    category: "Advertising",

    documentationUrl:
      "https://support.google.com/campaignmanager/answer/2823219",

    description:
      "Floodlight est la technologie de suivi des conversions de Google Campaign Manager 360 utilisée pour mesurer les actions réalisées après une exposition ou un clic publicitaire.",

    present,

    status:
      present
        ? "Détecté directement"
        : "Non détecté",

    ids:
      advertiserId
        ? [advertiserId]
        : [],

    evidence: [
      ...(doubleClickDomainDetected
        ? ["fls.doubleclick.net / ad.doubleclick.net"]
        : []),

      ...(activityDetected
        ? ["Endpoint activityi"]
        : []),

      ...(floodlightKeywordDetected
        ? ["Mot-clé Floodlight"]
        : []),

      ...(dcSendToDetected
        ? ["Identifiant send_to DC-*"]
        : []),

      ...(allowCustomScriptsDetected
        ? ["allow_custom_scripts"]
        : []),

      ...(srcParameterDetected
        ? ["Paramètre src"]
        : []),

      ...(typeParameterDetected
        ? ["Paramètre type"]
        : []),

      ...(catParameterDetected
        ? ["Paramètre cat"]
        : []),

      ...(ordParameterDetected
        ? ["Paramètre ord"]
        : []),
    ],

    sources:
      present
        ? [
            "HTML statique",
            "Script externe",
            "Script inline",
            "Iframe",
          ]
        : [],

    certainty:
      doubleClickDomainDetected ||
      dcSendToDetected ||
      (
        srcParameterDetected &&
        typeParameterDetected &&
        catParameterDetected
      )
        ? "Élevé"
        : present
          ? "Moyen"
          : "Faible",

    details: {
      floodlightUrl,

      advertiserId,

      activityGroup,

      activityTag,

      doubleClickDomainDetected,

      activityDetected,

      floodlightKeywordDetected,

      dcSendToDetected,

      allowCustomScriptsDetected,

      ordParameterDetected,

      srcParameterDetected,

      typeParameterDetected,

      catParameterDetected,
    },
  };
}