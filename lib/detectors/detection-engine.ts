import { runDetectors } from "./index";

import type {
  AnalyticsDetectionResult,
  AnalyticsToolDetection,
} from "../types";

export class DetectionEngine {
  /**
   * Télécharge le HTML de la page
   */
  private async fetchHtml(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AIP Analytics Platform",
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to fetch ${url}`);
    }

    return await response.text();
  }

  /**
   * Exécute tous les détecteurs
   */
  async analyze(
    url: string
  ): Promise<AnalyticsDetectionResult> {

    const html = await this.fetchHtml(url);

    const tools: AnalyticsToolDetection[] =
      runDetectors(html);

    return {
      url,

      fetchedAt: new Date().toISOString(),

      htmlSize: html.length,

      tools,

      insights: [],

      rawSignals: {
        scriptSrcs: [],

        headSnippet: html.substring(
          0,
          Math.min(html.length, 2000)
        ),

        inlineScriptSnippet: "",
      },
    };
  }
}