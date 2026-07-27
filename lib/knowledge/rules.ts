import type {
  AnalyticsDetectionResult,
  AnalyticsInsight,
  AnalyticsToolDetection,
} from "../types";

function isDetected(
  tools: AnalyticsToolDetection[],
  key: string
): boolean {
  return tools.some(
    (tool) => tool.key === key && tool.present
  );
}

function getDetectedTool(
  tools: AnalyticsToolDetection[],
  key: string
): AnalyticsToolDetection | undefined {
  return tools.find(
    (tool) => tool.key === key && tool.present
  );
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
    hasConsent ||
    hasDidomi ||
    hasOneTrust ||
    hasAxeptio;

  const hasAdobeLaunch = isDetected(
    tools,
    "adobe-launch"
  );

  const hasMetaPixel = isDetected(
    tools,
    "meta-pixel"
  );

  const hasLinkedIn = isDetected(
    tools,
    "linkedin-insight"
  );

  const hasTikTok = isDetected(
    tools,
    "tiktok-pixel"
  );

  const hasFloodlight = isDetected(
    tools,
    "floodlight"
  );

  const hasAdvertisingTool =
    hasMetaPixel ||
    hasLinkedIn ||
    hasTikTok ||
    hasFloodlight;

  /**
   * Plusieurs systèmes de Tag Management
   */
  if (hasGTM && hasAdobeLaunch) {
    insights.push({
      key: "multiple-tag-management-systems",
      severity: "warning",
      title:
        "Plusieurs systèmes de Tag Management détectés",
      description:
        "Google Tag Manager et Adobe Experience Platform Launch sont détectés sur la même page. Il est recommandé de vérifier la gouvernance des balises afin d’éviter les doublons de tracking, les conflits de déclenchement ou les écarts de mesure.",
      relatedTools: ["gtm", "adobe-launch"],
    });
  }

  /**
   * GTM détecté
   */
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

  /**
   * GTM détecté sans GA4 visible.
   *
   * IMPORTANT :
   * GA4 peut être déployé dans le conteneur GTM.
   * L'absence dans le HTML statique ne signifie donc
   * pas que GA4 est absent du site.
   */
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

  /**
   * GA4 détecté sans GTM.
   */
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

  /**
   * GTM détecté sans DataLayer visible.
   *
   * Le DataLayer peut être créé ou enrichi au runtime.
   */
  if (hasGTM && !hasDataLayer) {
    insights.push({
      key: "gtm-without-datalayer",
      severity: "warning",
      title:
        "GTM détecté sans DataLayer identifiable",
      description:
        "Google Tag Manager est présent, mais aucun DataLayer n’a été identifié dans le HTML statique. Cela ne permet pas de conclure à son absence. Une vérification en environnement navigateur peut être nécessaire.",
      relatedTools: ["gtm", "datalayer"],
    });
  }

  /**
   * CMP détectée.
   *
   * CORRECTION V2 :
   *
   * Une CMP détectée ne prouve pas :
   * - la conformité réglementaire ;
   * - la présence de Consent Mode ;
   * - la bonne configuration de Consent Mode.
   *
   * Consent Mode est traité comme une vérification
   * d'intégration avec l'écosystème Google.
   */
  if (hasAnyConsent) {
    insights.push({
      key: "cmp-detected-consent-mode-check",
      severity: "info",
      title:
        "CMP détectée : intégration Consent Mode à vérifier",
      description:
        "Une plateforme de gestion du consentement est détectée. Si des services Google sont utilisés, il est recommandé de vérifier en environnement runtime si Google Consent Mode est implémenté et correctement relié aux choix de consentement. La présence d’une CMP ne permet pas, à elle seule, de confirmer la conformité réglementaire.",
      relatedTools: [
        ...(hasDidomi ? ["didomi"] : []),
        ...(hasOneTrust ? ["onetrust"] : []),
        ...(hasAxeptio ? ["axeptio"] : []),
        ...(hasConsent ? ["consent"] : []),
      ],
    });
  }

  /**
   * GA4 détecté sans CMP visible.
   *
   * CORRECTION V2 :
   *
   * "CMP non détectée" ne signifie pas
   * "CMP absente".
   */
  if (hasGA4 && !hasAnyConsent) {
    insights.push({
      key: "ga4-without-visible-consent",
      severity: "warning",
      title: "GA4 détecté, CMP non confirmée",
      description:
        "Google Analytics 4 est détecté, mais aucune plateforme de gestion du consentement n’a pu être confirmée dans le HTML statique analysé. Cela ne prouve pas l’absence d’un mécanisme de consentement. Une vérification runtime est recommandée.",
      relatedTools: ["ga4", "consent"],
    });
  }

  /**
   * Outils publicitaires détectés sans CMP visible.
   *
   * CORRECTION V2 :
   *
   * Avant :
   * severity = critical
   *
   * Maintenant :
   * severity = warning
   *
   * Une CMP peut être chargée dynamiquement ou
   * être invisible dans l'analyse statique.
   */
  if (hasAdvertisingTool && !hasAnyConsent) {
    insights.push({
      key: "advertising-without-visible-consent",
      severity: "warning",
      title:
        "Outils publicitaires détectés, CMP non confirmée",
      description:
        "Un ou plusieurs outils publicitaires sont détectés, mais aucune plateforme de gestion du consentement n’a pu être confirmée dans le HTML statique analysé. Cela ne permet pas de conclure à l’absence d’un mécanisme de consentement. Une vérification runtime du déclenchement des balises et de la gestion du consentement est recommandée.",
      relatedTools: [
        ...(hasMetaPixel ? ["meta-pixel"] : []),
        ...(hasLinkedIn
          ? ["linkedin-insight"]
          : []),
        ...(hasTikTok ? ["tiktok-pixel"] : []),
        ...(hasFloodlight ? ["floodlight"] : []),
        "consent",
      ],
    });
  }

  /**
   * Plusieurs conteneurs GTM
   */
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

  /**
   * Aucun outil supporté détecté.
   *
   * CORRECTION V2 :
   *
   * Avant :
   * "Aucun outil Analytics détecté"
   * severity = critical
   *
   * Problème :
   * le moteur testait en réalité TOUS les outils,
   * pas uniquement Analytics.
   *
   * Et surtout :
   * aucun outil détecté statiquement
   * ≠ aucun outil présent sur le site.
   */
  const detectedTools = tools.filter(
    (tool) => tool.present
  );

  if (detectedTools.length === 0) {
    insights.push({
      key: "no-supported-tool-detected",
      severity: "warning",
      title:
        "Aucun outil supporté détecté dans l’analyse statique",
      description:
        "Aucun des outils actuellement pris en charge par le Detection Engine n’a pu être confirmé dans le HTML statique. Cela ne signifie pas qu’aucune technologie analytics, marketing ou de consentement n’est présente. Une analyse runtime ou un audit manuel est recommandé.",
      relatedTools: [],
    });
  }

  return insights;
}