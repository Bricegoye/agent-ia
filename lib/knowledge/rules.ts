import type {
  AnalyticsDetectionResult,
  AnalyticsInsight,
  AnalyticsToolDetection,
} from "../types";

function isDetected(
  tools: AnalyticsToolDetection[],
  key: string
): boolean {
  return tools.some((tool) => tool.key === key && tool.present);
}

function getDetectedTool(
  tools: AnalyticsToolDetection[],
  key: string
): AnalyticsToolDetection | undefined {
  return tools.find((tool) => tool.key === key && tool.present);
}

export function evaluateKnowledgeRules(
  result: AnalyticsDetectionResult
): AnalyticsInsight[] {
  const insights: AnalyticsInsight[] = [];
  const tools = result.tools;

  const hasGTM = isDetected(tools, "gtm");
  const hasGA4 = isDetected(tools, "ga4");
  const hasDataLayer = isDetected(tools, "datalayer");

  const hasConsent = isDetected(tools, "consent");
  const hasDidomi = isDetected(tools, "didomi");
  const hasOneTrust = isDetected(tools, "onetrust");
  const hasAxeptio = isDetected(tools, "axeptio");

  const hasAnyConsent =
    hasConsent || hasDidomi || hasOneTrust || hasAxeptio;

  const hasAdobeLaunch = isDetected(tools, "adobe-launch");

  const hasMetaPixel = isDetected(tools, "meta-pixel");
  const hasLinkedIn = isDetected(tools, "linkedin-insight");
  const hasTikTok = isDetected(tools, "tiktok-pixel");
  const hasFloodlight = isDetected(tools, "floodlight");

  const hasAdvertisingTool =
    hasMetaPixel || hasLinkedIn || hasTikTok || hasFloodlight;

  // Plusieurs systèmes de Tag Management
  if (hasGTM && hasAdobeLaunch) {
    insights.push({
      key: "multiple-tag-management-systems",
      severity: "warning",
      title: "Plusieurs systèmes de Tag Management détectés",
      description:
        "Google Tag Manager et Adobe Experience Platform Launch sont détectés sur la même page. Il est recommandé de vérifier la gouvernance des balises afin d’éviter les doublons de tracking, les conflits de déclenchement ou les écarts de mesure.",
      relatedTools: ["gtm", "adobe-launch"],
    });
  }

  // GTM détecté
  if (hasGTM) {
    insights.push({
      key: "gtm-detected",
      severity: "success",
      title: "Google Tag Manager détecté",
      description:
        "Google Tag Manager est présent sur le site et peut centraliser le déploiement des outils analytics et marketing.",
      relatedTools: ["gtm"],
    });
  }

  // GTM sans GA4 visible
  if (hasGTM && !hasGA4) {
    insights.push({
      key: "gtm-without-visible-ga4",
      severity: "info",
      title: "GA4 potentiellement configuré via GTM",
      description:
        "Google Tag Manager est détecté, mais aucun Measurement ID GA4 n’est visible dans le HTML statique. GA4 peut être configuré dans le conteneur GTM. Une vérification du conteneur ou une analyse réseau est recommandée.",
      relatedTools: ["gtm", "ga4"],
    });
  }

  // GA4 sans GTM
  if (hasGA4 && !hasGTM) {
    insights.push({
      key: "ga4-direct-implementation",
      severity: "success",
      title: "GA4 semble implémenté directement",
      description:
        "Google Analytics 4 est détecté alors qu’aucun conteneur Google Tag Manager n’est visible. Cela suggère une implémentation directe via gtag.js ou un script équivalent.",
      relatedTools: ["ga4"],
    });
  }

  // GTM sans DataLayer
  if (hasGTM && !hasDataLayer) {
    insights.push({
      key: "gtm-without-datalayer",
      severity: "warning",
      title: "GTM détecté sans DataLayer identifiable",
      description:
        "Google Tag Manager est présent, mais aucun DataLayer n’a été identifié dans le HTML statique. Une vérification en environnement navigateur peut être nécessaire.",
      relatedTools: ["gtm", "datalayer"],
    });
  }

  // CMP détectée
  if (hasAnyConsent) {
    insights.push({
      key: "cmp-detected-consent-mode-check",
      severity: "warning",
      title: "CMP détectée : vérifier Consent Mode",
      description:
        "Une plateforme de gestion du consentement est détectée. Il est recommandé de vérifier que Google Consent Mode v2 est correctement configuré afin de garantir la conformité et la qualité des données Analytics.",
      relatedTools: [
        ...(hasDidomi ? ["didomi"] : []),
        ...(hasOneTrust ? ["onetrust"] : []),
        ...(hasAxeptio ? ["axeptio"] : []),
        ...(hasConsent ? ["consent"] : []),
      ],
    });
  }

  // GA4 sans CMP
  if (hasGA4 && !hasAnyConsent) {
    insights.push({
      key: "ga4-without-consent",
      severity: "warning",
      title: "GA4 détecté sans CMP identifiable",
      description:
        "Google Analytics 4 est détecté, mais aucune plateforme de gestion du consentement n’a été identifiée dans le HTML analysé.",
      relatedTools: ["ga4", "consent"],
    });
  }

  // Outils publicitaires sans CMP
  if (hasAdvertisingTool && !hasAnyConsent) {
    insights.push({
      key: "advertising-without-consent",
      severity: "critical",
      title: "Outils publicitaires détectés sans CMP identifiable",
      description:
        "Un ou plusieurs outils publicitaires sont présents, mais aucune plateforme de gestion du consentement n’a été identifiée.",
      relatedTools: [
        ...(hasMetaPixel ? ["meta-pixel"] : []),
        ...(hasLinkedIn ? ["linkedin-insight"] : []),
        ...(hasTikTok ? ["tiktok-pixel"] : []),
        ...(hasFloodlight ? ["floodlight"] : []),
        "consent",
      ],
    });
  }

  // Plusieurs conteneurs GTM
  const gtmTool = getDetectedTool(tools, "gtm");

  if (gtmTool && gtmTool.ids.length > 1) {
    insights.push({
      key: "multiple-gtm-containers",
      severity: "warning",
      title: "Plusieurs conteneurs GTM détectés",
      description:
        "Plusieurs identifiants Google Tag Manager ont été détectés. Il faut vérifier qu’ils sont tous nécessaires afin d’éviter les doublons de collecte.",
      relatedTools: ["gtm"],
    });
  }

  // Aucun outil détecté
  const detectedTools = tools.filter((tool) => tool.present);

  if (detectedTools.length === 0) {
    insights.push({
      key: "no-analytics-tool-detected",
      severity: "critical",
      title: "Aucun outil Analytics détecté",
      description:
        "Aucune solution Analytics ou Tag Management n’a été détectée dans le HTML statique. Une analyse runtime avec un navigateur ou un audit manuel est recommandée.",
      relatedTools: [],
    });
  }

  return insights;
}