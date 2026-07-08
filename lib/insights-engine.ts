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
  const hasAdobeLaunch = hasTool(result, "adobe-launch");

  // ============================
  // Plusieurs Tag Management Systems
  // ============================

  if (hasGTM && hasAdobeLaunch) {
    insights.push({
      key: "multiple-tag-management-systems",
      severity: "warning",
      title: "Plusieurs systèmes de Tag Management détectés",
      description:
        "Google Tag Manager et Adobe Experience Platform Launch sont détectés sur la même page. Il est recommandé de vérifier la gouvernance des balises afin d'éviter les doublons de tracking, les conflits de déclenchement ou les écarts de mesure.",
      relatedTools: ["gtm", "adobe-launch"],
    });
  }

  // ============================
  // GTM sans GA4
  // ============================

  if (hasGTM && !hasGA4) {
    insights.push({
      key: "gtm-without-visible-ga4",
      severity: "info",
      title: "GA4 potentiellement configuré via GTM",
      description:
        "Google Tag Manager est détecté, mais aucun Measurement ID GA4 n'est visible dans le HTML statique. GA4 peut être configuré dans le conteneur GTM. Une vérification du conteneur GTM ou une analyse réseau est recommandée.",
      relatedTools: ["gtm", "ga4"],
    });
  }

  // ============================
  // GA4 sans GTM
  // ============================

  if (hasGA4 && !hasGTM) {
    insights.push({
      key: "ga4-direct-implementation",
      severity: "success",
      title: "GA4 semble implémenté directement",
      description:
        "Google Analytics 4 est détecté alors qu'aucun conteneur Google Tag Manager n'est visible. Cela suggère une implémentation directe via gtag.js ou un script équivalent.",
      relatedTools: ["ga4"],
    });
  }

  // ============================
  // CMP détectée
  // ============================

  if (hasConsent) {
    insights.push({
      key: "cmp-detected-consent-mode-check",
      severity: "warning",
      title: "CMP détectée : vérifier Consent Mode",
      description:
        "Une plateforme de gestion du consentement est détectée. Il est recommandé de vérifier que Google Consent Mode v2 est correctement configuré afin de garantir la conformité et la qualité des données Analytics.",
      relatedTools: ["consent"],
    });
  }

  // ============================
  // Aucun outil détecté
  // ============================

  if (result.tools.length === 0) {
    insights.push({
      key: "no-analytics-tool-detected",
      severity: "critical",
      title: "Aucun outil Analytics détecté",
      description:
        "Aucune solution Analytics ou Tag Management n'a été détectée dans le HTML statique. Une analyse runtime avec un navigateur (Playwright) ou un audit manuel est recommandée.",
      relatedTools: [],
    });
  }

  return insights;
}