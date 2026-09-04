import {
  BrowserEngine,
} from "../lib/browser/browser-engine";

import {
  DynamicEvidenceEngine,
} from "../lib/browser/dynamic-evidence-engine";

async function main() {
  const url =
    process.argv[2] ??
    "https://www.peugeot.fr/";

  console.log(
    `\nAnalyse des preuves dynamiques : ${url}\n`
  );

  const browserEngine = new BrowserEngine();
  const evidenceEngine =
    new DynamicEvidenceEngine();

  const browserResult =
    await browserEngine.analyze(url);

  const evidenceResult =
    evidenceEngine.analyze(browserResult);

  const summary = {
    url: browserResult.finalUrl,
    status: browserResult.status,
    executionTimeMs:
      browserResult.executionTime,

    technologies:
      evidenceResult.technologies.map(
        (technology) => ({
          key: technology.key,
          certainty: technology.certainty,
          ids: technology.ids,
          sources: technology.sources,
          evidence: technology.evidence,
          details: technology.details,
        })
      ),

    dataLayerEvents:
      evidenceResult.dataLayerEvents,

    consentSignals:
      evidenceResult.consentSignals,
  };

  console.log(
    JSON.stringify(summary, null, 2)
  );
}

main().catch((error: unknown) => {
  console.error(
    "\nÉchec de l’analyse des preuves dynamiques :"
  );

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});