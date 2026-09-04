import {
  fetchHTML,
} from "../lib/html-fetcher";

import {
  runDetectors,
} from "../lib/detectors";

import {
  BrowserEngine,
} from "../lib/browser/browser-engine";

import {
  DynamicEvidenceEngine,
} from "../lib/browser/dynamic-evidence-engine";

import {
  fuseDetections,
} from "../lib/detectors/detection-fusion";

import type {
  AnalyticsToolDetection,
} from "../lib/types";

function summarizeTool(
  tool: AnalyticsToolDetection
) {
  return {
    key: tool.key,
    name: tool.name,
    category: tool.category,
    present: tool.present,
    status: tool.status,
    certainty: tool.certainty,
    ids: tool.ids,
    sources: tool.sources,
    evidence: tool.evidence,
    detectionModes:
      tool.details?.detectionModes ?? null,
  };
}

async function main() {
  const url =
    process.argv[2] ??
    "https://www.peugeot.fr/";

  console.log(
    `\nTest de fusion statique/dynamique : ${url}\n`
  );

  /*
   * 1. Analyse statique identique à la V2.
   */
  const fetchResult = await fetchHTML(url);

  if (
    fetchResult.status < 200 ||
    fetchResult.status >= 300
  ) {
    throw new Error(
      `Static fetch failed with HTTP ${fetchResult.status}`
    );
  }

  const staticTools = runDetectors(
    fetchResult.html
  );

  /*
   * 2. Analyse dynamique avec Playwright.
   */
  const browserEngine = new BrowserEngine();

  const browserResult =
    await browserEngine.analyze(url);

  const dynamicEvidenceEngine =
    new DynamicEvidenceEngine();

  const dynamicResult =
    dynamicEvidenceEngine.analyze(
      browserResult
    );

  /*
   * 3. Fusion des deux analyses.
   */
  const fusedTools = fuseDetections(
    staticTools,
    dynamicResult.technologies
  );

  const summary = {
    url: browserResult.finalUrl,

    staticAnalysis: {
      htmlSize: fetchResult.htmlSize,
      toolCount: staticTools.length,
      tools: staticTools.map(
        summarizeTool
      ),
    },

    dynamicAnalysis: {
      htmlSize: browserResult.htmlSize,
      executionTimeMs:
        browserResult.executionTime,
      technologyCount:
        dynamicResult.technologies.length,

      technologies:
        dynamicResult.technologies.map(
          (technology) => ({
            key: technology.key,
            certainty:
              technology.certainty,
            ids: technology.ids,
            sources:
              technology.sources,
          })
        ),

      dataLayerEvents:
        dynamicResult.dataLayerEvents,

      consentSignals:
        dynamicResult.consentSignals,
    },

    fusedAnalysis: {
      toolCount: fusedTools.length,
      tools: fusedTools.map(
        summarizeTool
      ),
    },
  };

  console.log(
    JSON.stringify(summary, null, 2)
  );
}

main().catch((error: unknown) => {
  console.error(
    "\nÉchec du test de fusion :"
  );

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});