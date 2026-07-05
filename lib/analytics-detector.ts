import type {
  AnalyticsDetectionResult,
  AnalyticsToolDetection,
} from "./types";

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function matchAll(html: string, regex: RegExp): string[] {
  return unique([...html.matchAll(regex)].map((match) => match[0]));
}

function createToolDetection(params: AnalyticsToolDetection): AnalyticsToolDetection {
  return params;
}

export function detectAnalyticsTools(params: {
  url: string;
  html: string;
  htmlSize: number;
}): AnalyticsDetectionResult {
  const { url, html, htmlSize } = params;

  const scriptSrcs = unique(
    [...html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(
      (match) => match[1]
    )
  );

  const headSnippet = html.match(/<head[\s\S]*?<\/head>/i)?.[0]?.slice(0, 3000) ?? "";

  const inlineScriptSnippet = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[0])
    .join("\n")
    .slice(0, 4000);

  const gtmIds = matchAll(html, /GTM-[A-Z0-9]+/g);
  const ga4Ids = matchAll(html, /G-[A-Z0-9]{6,}/g);
  const uaIds = matchAll(html, /UA-\d{4,}-\d+/g);

  const tools: AnalyticsToolDetection[] = [];

  if (gtmIds.length > 0 || html.includes("googletagmanager.com/gtm.js")) {
    tools.push(
      createToolDetection({
        name: "Google Tag Manager",
        key: "gtm",
        present: true,
        status: "Détecté directement",
        ids: gtmIds,
        evidence: unique([
          ...gtmIds,
          html.includes("googletagmanager.com/gtm.js")
            ? "googletagmanager.com/gtm.js"
            : "",
        ]),
        sources: ["HTML statique", "Script externe"],
        certainty: gtmIds.length > 0 ? "Élevé" : "Moyen",
      })
    );
  }

  if (
    ga4Ids.length > 0 ||
    html.includes("gtag/js") ||
    html.includes("gtag('config'")
  ) {
    tools.push(
      createToolDetection({
        name: "Google Analytics 4",
        key: "ga4",
        present: true,
        status: "Détecté directement",
        ids: ga4Ids,
        evidence: unique([
          ...ga4Ids,
          html.includes("gtag/js") ? "gtag/js" : "",
          html.includes("gtag('config'") ? "gtag('config')" : "",
        ]),
        sources: ["HTML statique", "Script inline", "Script externe"],
        certainty: ga4Ids.length > 0 ? "Élevé" : "Moyen",
      })
    );
  }

  if (uaIds.length > 0) {
    tools.push(
      createToolDetection({
        name: "Universal Analytics",
        key: "ua",
        present: true,
        status: "Détecté directement",
        ids: uaIds,
        evidence: uaIds,
        sources: ["HTML statique", "Script inline"],
        certainty: "Élevé",
      })
    );
  }

  const pianoSignals = matchAll(
    html,
    /(?:pa\.atsv\.net|tag\.aticdn\.net|piano\.io|at-internet|piano-analytics|pa\.sendEvent)[^\s"'<>]*/gi
  );

  if (pianoSignals.length > 0) {
    tools.push(
      createToolDetection({
        name: "Piano Analytics",
        key: "piano",
        present: true,
        status: "Détecté directement",
        ids: pianoSignals,
        evidence: pianoSignals,
        sources: ["HTML statique", "Script inline", "Script externe"],
        certainty: "Moyen",
      })
    );
  }

  const eulerianSignals = matchAll(
    html,
    /(?:eulerian\.net|collect\.eulerian\.net|EA_push|ea\.tld)[^\s"'<>]*/gi
  );

  if (eulerianSignals.length > 0) {
    tools.push(
      createToolDetection({
        name: "Eulerian Analytics",
        key: "eulerian",
        present: true,
        status: "Détecté directement",
        ids: eulerianSignals,
        evidence: eulerianSignals,
        sources: ["HTML statique", "Script inline", "Domaine réseau"],
        certainty: "Moyen",
      })
    );
  }

  const adobeSignals = matchAll(
    html,
    /(?:AppMeasurement|s_code|omniture|2o7\.net|sc\.omtrdc\.net|\.sc\.omtr|reportSuite|rsid)[^\s"'<>]*/gi
  );

  if (adobeSignals.length > 0) {
    tools.push(
      createToolDetection({
        name: "Adobe Analytics",
        key: "adobe",
        present: true,
        status: "Détecté directement",
        ids: adobeSignals,
        evidence: adobeSignals,
        sources: ["HTML statique", "Script inline", "Script externe"],
        certainty: "Moyen",
      })
    );
  }

  const consentSignals = matchAll(
    html,
    /(?:didomi|onetrust|optanon|axeptio|cookiebot|consentmode|gtag\('consent')[^\s"'<>]*/gi
  );

  if (consentSignals.length > 0) {
    tools.push(
      createToolDetection({
        name: "Consent / CMP",
        key: "consent",
        present: true,
        status: "Détecté directement",
        ids: consentSignals,
        evidence: consentSignals,
        sources: ["HTML statique", "Script inline", "Script externe"],
        certainty: "Moyen",
      })
    );
  }

  const pixelSignals = matchAll(
    html,
    /(?:connect\.facebook\.net|fbq\(|linkedin\.com\/insight|snap\.licdn|analytics\.tiktok\.com|ttq\.|fls\.doubleclick\.net|hotjar|clarity\.ms|contentsquare|abtasty|optimizely)[^\s"'<>]*/gi
  );

  if (pixelSignals.length > 0) {
    tools.push(
      createToolDetection({
        name: "Marketing pixels / UX tools",
        key: "pixels",
        present: true,
        status: "Détecté directement",
        ids: pixelSignals,
        evidence: pixelSignals,
        sources: ["HTML statique", "Script inline", "Script externe"],
        certainty: "Moyen",
      })
    );
  }

  const dataLayerSignals = matchAll(html, /dataLayer|window\.dataLayer/gi);

  if (dataLayerSignals.length > 0) {
    tools.push(
      createToolDetection({
        name: "DataLayer",
        key: "datalayer",
        present: true,
        status: "Détecté directement",
        ids: [],
        evidence: dataLayerSignals,
        sources: ["HTML statique", "Script inline"],
        certainty: "Moyen",
      })
    );
  }

  return {
    url,
    fetchedAt: new Date().toISOString(),
    htmlSize,
    tools,
    rawSignals: {
      scriptSrcs,
      headSnippet,
      inlineScriptSnippet,
    },
  };
}