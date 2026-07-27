import { runDetectors } from "./index";

import { fetchHTML } from "../html-fetcher";

import type {
  AnalyticsDetectionResult,
  AnalyticsToolDetection,
} from "../types";

export class DetectionEngine {
  /**
   * Exécute l'analyse du site.
   *
   * La récupération HTML est centralisée dans html-fetcher.ts
   * afin d'éviter plusieurs implémentations différentes du fetch.
   */
  async analyze(
    url: string
  ): Promise<AnalyticsDetectionResult> {
    /**
     * Fetch HTML
     */
    const fetchResult = await fetchHTML(url);

    /**
     * Un statut HTTP non 2xx signifie que le site
     * n'a pas fourni une page exploitable normalement.
     */
    if (
      fetchResult.status < 200 ||
      fetchResult.status >= 300
    ) {
      throw new Error(
        `Unable to fetch ${url} - HTTP ${fetchResult.status} ${fetchResult.statusText}`
      );
    }

    const html = fetchResult.html;

    /**
     * Exécute tous les détecteurs.
     */
    const tools: AnalyticsToolDetection[] =
      runDetectors(html);

    /**
     * Extraction des sources de scripts pour les rawSignals.
     */
    const scriptSrcs = [
      ...html.matchAll(
        /<script[^>]+src=["']([^"']+)["'][^>]*>/gi
      ),
    ].map((match) => match[1]);

    /**
     * Extraction du <head>.
     */
    const headSnippet =
      html
        .match(/<head[\s\S]*?<\/head>/i)?.[0]
        ?.slice(0, 3000) ?? "";

    /**
     * Extraction d'un échantillon des scripts inline.
     */
    const inlineScriptSnippet = [
      ...html.matchAll(
        /<script[^>]*>([\s\S]*?)<\/script>/gi
      ),
    ]
      .map((match) => match[0])
      .join("\n")
      .slice(0, 4000);

    return {
      /**
       * Utilise l'URL finale après redirection éventuelle.
       */
      url: fetchResult.finalUrl || url,

      fetchedAt: new Date().toISOString(),

      htmlSize: fetchResult.htmlSize,

      tools,

      insights: [],

      rawSignals: {
        scriptSrcs: [
          ...new Set(scriptSrcs.filter(Boolean)),
        ],

        headSnippet,

        inlineScriptSnippet,
      },
    };
  }
}