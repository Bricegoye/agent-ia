import type { AnalyticsDetectionResult, AnalyticsInsight } from "./types";

function hasTool(result: AnalyticsDetectionResult, key: string): boolean {
  return result.tools.some((tool) => tool.key === key && tool.present);
}

export function generateInsights(
  result: AnalyticsDetectionResult
): AnalyticsInsight[] {
  const insights: AnalyticsInsight[] = [];

  const hasGTM = hasTool(result, "gtm");
  const hasGA4 = hasTool(result, "ga4");
  const hasConsent = hasTool(result, "consent");

  if (hasGTM && !hasGA4) {
    insights.push({
      key: "gtm-without-visible-ga4",
      severity: "info",
      title: "GA4 potentiellement configuré via GTM",
      description:
        "Google Tag Manager est détecté, mais aucun Measurement ID GA4 n’est visible dans le HTML statique. GA4 peut être configuré dans le conteneur GTM ; un audit GTM ou une analyse réseau est recommandé.",
      relatedTools: ["gtm", "ga4"],
    });
  }

  if (hasGA4 && !hasGTM) {
    insights.push({
      key: "ga4-direct-implementation",
      severity: "success",
      title: "GA4 semble implémenté directement",
      description:
        "Google Analytics 4 est détecté alors qu’aucun conteneur GTM n’est visible. Cela suggère une implémentation directe via gtag.js ou un script équivalent.",
      relatedTools: ["ga4"],
    });
  }

  if (hasConsent) {
    insights.push({
      key: "cmp-detected-consent-mode-check",
      severity: "warning",
      title: "CMP détectée : vérifier Consent Mode",
      description:
        "Une solution de gestion du consentement est détectée. Il est recommandé de vérifier que Consent Mode v2 est correctement configuré pour les balises Google et les pixels marketing.",
      relatedTools: ["consent"],
    });
  }

  if (result.tools.length === 0) {
    insights.push({
      key: "no-analytics-tool-detected",
      severity: "critical",
      title: "Aucun outil analytics détecté",
      description:
        "Aucun outil analytics ou tag management n’a été détecté dans le HTML statique. Une analyse runtime avec navigateur ou un audit manuel est recommandé.",
      relatedTools: [],
    });
  }

  return insights;
}