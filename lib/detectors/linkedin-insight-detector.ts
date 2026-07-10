import type { AnalyticsToolDetection } from "../types";

export function detectLinkedInInsight(
  html: string
): AnalyticsToolDetection {
  const partnerIdRegex =
    /_linkedin_partner_id\s*=\s*["']([^"']+)["']/i;

  const partnerId = html.match(partnerIdRegex)?.[1];

  const insightScriptDetected =
    /snap\.licdn\.com\/li\.lms-analytics\/insight\.min\.js/i.test(html);

  const linkedinDomainDetected =
    /linkedin\.com\/insight|px\.ads\.linkedin\.com/i.test(html);

  const present =
    Boolean(partnerId) ||
    insightScriptDetected ||
    linkedinDomainDetected;

  return {
    name: "LinkedIn Insight Tag",

    key: "linkedin-insight",

    vendor: "LinkedIn",

    category: "Advertising",

    documentationUrl:
      "https://www.linkedin.com/help/lms/answer/a427660",

    description:
      "LinkedIn Insight Tag permet de mesurer les conversions, créer des audiences et optimiser les campagnes LinkedIn Ads.",

    present,

    status: present ? "Détecté directement" : "Non détecté",

    ids: partnerId ? [partnerId] : [],

    evidence: [
      ...(partnerId ? ["_linkedin_partner_id"] : []),
      ...(insightScriptDetected
        ? ["snap.licdn.com/li.lms-analytics/insight.min.js"]
        : []),
      ...(linkedinDomainDetected
        ? ["linkedin.com/insight ou px.ads.linkedin.com"]
        : []),
    ],

    sources: present ? ["HTML statique", "Script externe", "Script inline"] : [],

    certainty: present ? "Élevé" : "Faible",

    details: {
      partnerId,
      insightScriptDetected,
      linkedinDomainDetected,
    },
  };
}