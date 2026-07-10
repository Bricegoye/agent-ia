import type { AnalyticsToolDetection } from "../types";

export function detectTagCommander(
  html: string
): AnalyticsToolDetection {

  const tcDomainDetected =
    /tagcommander\.com|commandersact\.com/i.test(html);

  const tcScriptDetected =
    /tC\.js|tc_events|tc_vars|TagCommander/i.test(html);

  const trustCommanderDetected =
    /TrustCommander/i.test(html);

  const containerRegex =
    /container(?:Id|ID)?["'\s:=]+([A-Za-z0-9_-]+)/i;

  const containerId =
    html.match(containerRegex)?.[1];

  const tcEventDetected =
    /tC\.event|tC\.privacy|tC\.containerReady/i.test(html);

  const present =
    tcDomainDetected ||
    tcScriptDetected ||
    trustCommanderDetected;

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

    ids:
      containerId
        ? [containerId]
        : [],

    evidence: [

      ...(tcDomainDetected
        ? ["tagcommander.com / commandersact.com"]
        : []),

      ...(tcScriptDetected
        ? ["TagCommander"]
        : []),

      ...(trustCommanderDetected
        ? ["TrustCommander"]
        : []),

      ...(tcEventDetected
        ? ["tC.event"]
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

      containerId,

      tcDomainDetected,

      tcScriptDetected,

      trustCommanderDetected,

      tcEventDetected,
    },
  };
}