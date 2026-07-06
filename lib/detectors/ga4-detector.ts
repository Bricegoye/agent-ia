import type { AnalyticsToolDetection } from "../types";

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function detectGA4(html: string): AnalyticsToolDetection {
  const ga4Ids = unique(html.match(/G-[A-Z0-9]{6,}/g) ?? []);

  const hasGtagJs = html.includes("gtag/js");
  const hasGtagConfig =
    html.includes("gtag('config'") || html.includes('gtag("config"');

  const evidence = unique([
    ...ga4Ids,
    hasGtagJs ? "gtag/js" : "",
    hasGtagConfig ? "gtag config" : "",
  ]);

  const present = evidence.length > 0;

  return {
    name: "Google Analytics 4",
    key: "ga4",
    present,
    status: present ? "Détecté directement" : "Non détecté",
    ids: ga4Ids,
    evidence,
    sources: present ? ["HTML statique", "Script inline", "Script externe"] : [],
    certainty: ga4Ids.length > 0 ? "Élevé" : present ? "Moyen" : "Faible",
  };
}