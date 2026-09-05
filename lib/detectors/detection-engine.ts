import {
  runDetectors,
} from "./index";

import {
  fetchHTML,
  type FetchHTMLResult,
} from "../html-fetcher";

import {
  BrowserEngine,
  type BrowserAnalysisResult,
} from "../browser/browser-engine";

import {
  DynamicEvidenceEngine,
} from "../browser/dynamic-evidence-engine";

import {
  fuseDetections,
} from "./detection-fusion";

import type {
  AnalyticsDetectionResult,
  AnalyticsToolDetection,
} from "../types";

function getErrorMessage(
  error: unknown
): string {
  return error instanceof Error
    ? error.message
    : String(error);
}

function isSuccessfulStatus(
  status: number
): boolean {
  return (
    status >= 200 &&
    status < 300
  );
}

function extractScriptSources(
  html: string
): string[] {
  return [
    ...html.matchAll(
      /<script[^>]+src=["']([^"']+)["'][^>]*>/gi
    ),
  ].map((match) => match[1]);
}

function unique(
  values: string[]
): string[] {
  return [
    ...new Set(
      values.filter(Boolean)
    ),
  ];
}

export class DetectionEngine {
  private readonly browserEngine:
    BrowserEngine;

  private readonly dynamicEvidenceEngine:
    DynamicEvidenceEngine;

  constructor() {
    this.browserEngine =
      new BrowserEngine();

    this.dynamicEvidenceEngine =
      new DynamicEvidenceEngine();
  }

  async analyze(
    url: string
  ): Promise<AnalyticsDetectionResult> {
    /*
     * Les deux analyses sont lancées en parallèle
     * pour éviter d’additionner leurs temps
     * d’exécution.
     */
    const [
      staticOutcome,
      browserOutcome,
    ] = await Promise.allSettled([
      fetchHTML(url),
      this.browserEngine.analyze(url),
    ]);

    let staticResult:
      FetchHTMLResult | null = null;

    let browserResult:
      BrowserAnalysisResult | null = null;

    let staticFailure:
      string | null = null;

    let browserFailure:
      string | null = null;

    /*
     * Validation du résultat statique.
     */
    if (
      staticOutcome.status ===
      "fulfilled"
    ) {
      if (
        isSuccessfulStatus(
          staticOutcome.value.status
        )
      ) {
        staticResult =
          staticOutcome.value;
      } else {
        staticFailure =
          `HTTP ${staticOutcome.value.status} ${staticOutcome.value.statusText}`;
      }
    } else {
      staticFailure =
        getErrorMessage(
          staticOutcome.reason
        );
    }

    /*
     * Validation du résultat Playwright.
     *
     * Un statut null reste acceptable lorsque
     * la page a produit du HTML : certains sites
     * terminent leur navigation de manière
     * inhabituelle tout en restant analysables.
     */
    if (
      browserOutcome.status ===
      "fulfilled"
    ) {
      const result =
        browserOutcome.value;

      const statusIsUsable =
        result.status === null ||
        isSuccessfulStatus(
          result.status
        );

      const htmlIsUsable =
        result.html.trim().length > 0;

      if (
        statusIsUsable &&
        htmlIsUsable
      ) {
        browserResult = result;
      } else {
        browserFailure =
          result.status === null
            ? "Browser returned no usable HTML."
            : `HTTP ${result.status}`;
      }
    } else {
      browserFailure =
        getErrorMessage(
          browserOutcome.reason
        );
    }

    /*
     * L’audit échoue uniquement lorsque
     * les deux moteurs sont inutilisables.
     */
    if (
      !staticResult &&
      !browserResult
    ) {
      throw new Error(
        [
          `Unable to analyze ${url}.`,

          staticFailure
            ? `Static engine: ${staticFailure}.`
            : "",

          browserFailure
            ? `Browser engine: ${browserFailure}.`
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      );
    }

    /*
     * Détection V2 à partir du HTML statique.
     */
    const staticTools:
      AnalyticsToolDetection[] =
      staticResult
        ? runDetectors(
            staticResult.html
          )
        : [];

    /*
     * Détection dynamique V3.1.
     */
    const dynamicResult =
      browserResult
        ? this.dynamicEvidenceEngine.analyze(
            browserResult
          )
        : {
            technologies: [],
            dataLayerEvents: [],
            consentSignals: [],
          };

    /*
     * Fusion des preuves statiques
     * et dynamiques.
     */
    const tools =
      fuseDetections(
        staticTools,
        dynamicResult.technologies
      );

    /*
     * Le HTML rendu est prioritaire.
     * En cas d’échec de Chromium,
     * le HTML statique est conservé.
     */
    const analysisHtml =
      browserResult?.html ??
      staticResult?.html ??
      "";

    const extractedScriptSources =
      extractScriptSources(
        analysisHtml
      );

    const scriptSrcs = unique([
      ...extractedScriptSources,
      ...(browserResult?.scripts ??
        []),
    ]);

    const headSnippet =
      analysisHtml
        .match(
          /<head[\s\S]*?<\/head>/i
        )?.[0]
        ?.slice(0, 3000) ?? "";

    const inlineScriptSnippet = [
      ...analysisHtml.matchAll(
        /<script[^>]*>([\s\S]*?)<\/script>/gi
      ),
    ]
      .map((match) => match[0])
      .join("\n")
      .slice(0, 4000);

    /*
     * Diagnostics serveur sans interrompre
     * un audit ayant réussi avec l’autre moteur.
     */
    if (
      !staticResult &&
      staticFailure
    ) {
      console.warn(
        "[AIP Static Engine Fallback]",
        {
          url,
          error: staticFailure,
        }
      );
    }

    if (
      !browserResult &&
      browserFailure
    ) {
      console.warn(
        "[AIP Browser Engine Fallback]",
        {
          url,
          error: browserFailure,
        }
      );
    }

    return {
      url:
        browserResult?.finalUrl ??
        staticResult?.finalUrl ??
        url,

      fetchedAt:
        new Date().toISOString(),

      htmlSize:
        browserResult?.htmlSize ??
        staticResult?.htmlSize ??
        0,

      tools,

      insights: [],

      rawSignals: {
        scriptSrcs,
        headSnippet,
        inlineScriptSnippet,
      },
    };
  }
}