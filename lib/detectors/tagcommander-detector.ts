import type { AnalyticsToolDetection } from "../types";

export function detectTagCommander(
  html: string
): AnalyticsToolDetection {
  /*
   * Signatures fortes
   */

  const tcDomainDetected =
    /(?:cdn\.)?tagcommander\.com|commandersact\.com/i.test(html);

  /*
   * Exemples couverts :
   * - tc_header_21.js
   * - tc_footer_main_20.js
   * - tc_NextInteractive_33.1cb929cd.js
   */
  const tcContainerScriptRegex =
    /\btc_[A-Za-z0-9_-]*_(\d+)(?:\.[A-Za-z0-9_-]+)?\.js\b/gi;

  const containerMatches = [
    ...html.matchAll(tcContainerScriptRegex),
  ];

  const containerIds = [
    ...new Set(
      containerMatches
        .map((match) => match[1])
        .filter(Boolean)
    ),
  ];

  const tcContainerScriptDetected =
    containerMatches.length > 0;

  const tcNamespaceDetected =
    /\btC\.(?:containersLaunched|container|event|privacy|containerReady|script|pixelTrack)\b/i.test(
      html
    );

  /*
   * Signatures plus faibles
   */

  const tcDataLayerDetected =
    /\btc_vars\b|\btc_events\b/i.test(html);

  const tagCommanderKeywordDetected =
    /\bTagCommander\b/i.test(html);

  const trustCommanderDetected =
    /\bTrustCommander\b/i.test(html);

  /*
   * On évite de déclarer TagCommander uniquement parce que
   * le mot "TagCommander" apparaît dans une page.
   */
  const present =
    tcDomainDetected ||
    tcContainerScriptDetected ||
    tcNamespaceDetected ||
    (
      tagCommanderKeywordDetected &&
      tcDataLayerDetected
    );

  const certainty =
    tcDomainDetected ||
    tcContainerScriptDetected ||
    tcNamespaceDetected
      ? "Élevé"
      : present
        ? "Moyen"
        : "Faible";

  return {
    name: "TagCommander",

    key: "tagcommander",

    vendor: "Commanders Act",

    category: "Tag Management",

    documentationUrl:
      "https://community.commandersact.com/",

    description:
      "TagCommander est la solution de Tag Management de Commanders Act utilisée pour gérer les balises marketing et analytics.",

    present,

    status:
      present
        ? "Détecté directement"
        : "Non détecté",

    ids: containerIds,

    evidence: [
      ...(tcDomainDetected
        ? ["tagcommander.com / commandersact.com"]
        : []),

      ...(tcContainerScriptDetected
        ? ["Fichier conteneur tc_*_<id>.js"]
        : []),

      ...(tcNamespaceDetected
        ? ["Namespace JavaScript tC"]
        : []),

      ...(tcDataLayerDetected
        ? ["tc_vars / tc_events"]
        : []),

      ...(tagCommanderKeywordDetected
        ? ["TagCommander"]
        : []),

      ...(trustCommanderDetected
        ? ["TrustCommander"]
        : []),
    ],

    sources:
      present
        ? [
            "HTML statique",
            "Script externe",
            "Script inline",
          ]
        : [],

    certainty,

    details: {
      containerIds,

      tcDomainDetected,

      tcContainerScriptDetected,

      tcNamespaceDetected,

      tcDataLayerDetected,

      tagCommanderKeywordDetected,

      trustCommanderDetected,
    },
  };
}