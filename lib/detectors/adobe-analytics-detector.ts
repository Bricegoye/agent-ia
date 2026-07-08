import type { AnalyticsToolDetection } from "../types";

export function detectAdobeAnalytics(
  html: string
): AnalyticsToolDetection {
  const reportSuiteRegex = /s_account\s*=\s*["']([^"']+)["']/i;
  const trackingServerRegex =
    /trackingServer\s*[:=]\s*["']([^"']+)["']/i;

  const reportSuite = html.match(reportSuiteRegex)?.[1];

  const trackingServer = html.match(trackingServerRegex)?.[1];

  const appMeasurementDetected =
    /AppMeasurement|s\.t\(|s\.tl\(|s_gi\(/i.test(html);

  const adobeBeaconDetected =
    /omtrdc\.net|2o7\.net|adobedc\.net/i.test(html);

  const present =
    Boolean(reportSuite) ||
    appMeasurementDetected ||
    adobeBeaconDetected;

  return {
    name: "Adobe Analytics",

    key: "adobe-analytics",

    vendor: "Adobe",

    category: "Analytics",

    documentationUrl:
      "https://experienceleague.adobe.com/en/docs/analytics",

    description:
      "Adobe Analytics est la solution de Web Analytics d'Adobe Experience Cloud.",

    present,

    status: present ? "Détecté directement" : "Non détecté",

    ids: reportSuite ? [reportSuite] : [],

    evidence: [
      ...(reportSuite ? ["s_account"] : []),
      ...(appMeasurementDetected ? ["AppMeasurement"] : []),
      ...(adobeBeaconDetected ? ["Adobe Beacon"] : []),
    ],

    sources: present ? ["HTML statique", "Script inline"] : [],

    certainty: present ? "Élevé" : "Faible",

    details: {
      reportSuite,

      trackingServer,

      appMeasurementDetected,

      adobeBeaconDetected,
    },
  };
}