import type { AnalyticsToolDetection } from "../types";

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function detectConsent(html: string): AnalyticsToolDetection {
  const signals = unique(
    html.match(
      /(?:consent\.cookiebot\.com|cookiebot|Cookiebot|didomi|Didomi|onetrust|OneTrust|optanon|Optanon|axeptio|Axeptio|gtag\(['"]consent)/g
    ) ?? []
  );

  const hasCookiebot = signals.some((s) =>
    s.toLowerCase().includes("cookiebot")
  );

  const present = signals.length > 0;

  return {
    name: "Consent Management Platform",
    key: "consent",
    vendor: hasCookiebot ? "Cookiebot" : "Unknown",
    category: "Consent",
    documentationUrl: hasCookiebot
      ? "https://www.cookiebot.com/"
      : "https://support.google.com/tagmanager/answer/10718549",
    description:
      "Une Consent Management Platform permet de gérer le consentement utilisateur pour le dépôt de cookies et le déclenchement des balises marketing ou analytics.",
    present,
    status: present ? "Détecté directement" : "Non détecté",
    ids: signals,
    evidence: signals,
    sources: present ? ["HTML statique", "Script externe", "Script inline"] : [],
    certainty: present ? "Moyen" : "Faible",
  };
}