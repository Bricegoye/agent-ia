import type { AnalyticsToolDetection } from "../types";

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function detectGTM(html: string): AnalyticsToolDetection {
  const gtmIds = unique(html.match(/GTM-[A-Z0-9]+/g) ?? []);

  const hasGtmScript = html.includes("googletagmanager.com/gtm.js");
  const hasGtmIframe = html.includes("googletagmanager.com/ns.html");

  const evidence = unique([
    ...gtmIds,
    hasGtmScript ? "googletagmanager.com/gtm.js" : "",
    hasGtmIframe ? "googletagmanager.com/ns.html" : "",
  ]);

  const present = evidence.length > 0;

  return {
    name: "Google Tag Manager",
    key: "gtm",
    present,
    status: present ? "Détecté directement" : "Non détecté",
    ids: gtmIds,
    evidence,
    sources: present ? ["HTML statique", "Script externe"] : [],
    certainty: gtmIds.length > 0 ? "Élevé" : present ? "Moyen" : "Faible",
  };
}