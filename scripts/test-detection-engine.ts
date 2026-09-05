import {
  DetectionEngine,
} from "../lib/detectors/detection-engine";

async function main() {
  const url =
    process.argv[2] ??
    "https://www.peugeot.fr/";

  console.log(
    `\nTest du Detection Engine V3.1 : ${url}\n`
  );

  const startedAt = Date.now();

  const detectionEngine =
    new DetectionEngine();

  const result =
    await detectionEngine.analyze(url);

  const summary = {
    url: result.url,
    fetchedAt: result.fetchedAt,
    executionTimeMs:
      Date.now() - startedAt,
    htmlSize: result.htmlSize,
    toolCount: result.tools.length,

    tools: result.tools.map(
      (tool) => ({
        key: tool.key,
        name: tool.name,
        category: tool.category,
        status: tool.status,
        certainty: tool.certainty,
        ids: tool.ids,
        sources: tool.sources,
        evidence: tool.evidence,
        detectionModes:
          tool.details
            ?.detectionModes ??
          null,
      })
    ),

    rawSignals: {
      scriptSourceCount:
        result.rawSignals
          .scriptSrcs.length,

      headSnippetSize:
        result.rawSignals
          .headSnippet.length,

      inlineScriptSnippetSize:
        result.rawSignals
          .inlineScriptSnippet
          .length,
    },
  };

  console.log(
    JSON.stringify(summary, null, 2)
  );
}

main().catch((error: unknown) => {
  console.error(
    "\nÉchec du Detection Engine V3.1 :"
  );

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});