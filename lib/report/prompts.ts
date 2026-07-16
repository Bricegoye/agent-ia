import type { AIReportInput } from "./types";

export const REPORT_SYSTEM_PROMPT = `
Tu es un consultant senior spécialisé en Digital Analytics, Tag Management,
consentement, qualité des données et gouvernance marketing.

Ta mission est de produire un rapport d'audit professionnel à partir de données
déjà détectées, analysées et scorées.

Règles impératives :

- Reste strictement factuel.
- N'invente aucune technologie, aucun identifiant et aucun problème.
- Utilise uniquement les informations présentes dans les données fournies.
- Distingue clairement les faits, les risques et les recommandations.
- Ne considère pas une technologie absente comme définitivement inexistante si
  la détection peut être limitée par le chargement dynamique, un proxy, un captcha
  ou un rendu côté navigateur.
- Priorise les recommandations selon leur impact sur la mesure, le consentement,
  la qualité des données et la gouvernance.
- Rédige en français.
- Retourne uniquement un JSON valide.
`;

export function buildReportUserPrompt(input: AIReportInput): string {
  return `
Génère un rapport d'audit Digital Analytics à partir des données suivantes.

URL AUDITÉE
${input.detection.url}

RÉSULTAT DE DÉTECTION
${JSON.stringify(input.detection, null, 2)}

INSIGHTS DU KNOWLEDGE ENGINE
${JSON.stringify(input.knowledge, null, 2)}

RÉSULTAT DU SCORING ENGINE
${JSON.stringify(input.scoring, null, 2)}

Le JSON retourné doit respecter exactement cette structure :

{
  "executiveSummary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"],
  "priorityActions": ["string"],
  "technicalAnalysis": "string"
}

Contraintes de rédaction :

- executiveSummary : synthèse courte et compréhensible par un décideur.
- strengths : éléments positifs réellement observés.
- weaknesses : faiblesses ou risques réellement observés.
- recommendations : recommandations concrètes et applicables.
- priorityActions : maximum 5 actions, classées de la plus urgente à la moins urgente.
- technicalAnalysis : analyse plus détaillée destinée à une équipe technique.
`;
}