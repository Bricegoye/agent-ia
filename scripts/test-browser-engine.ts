import { BrowserEngine } from "../lib/browser/browser-engine";

const TRACKING_PATTERN =
  /google-analytics|googletagmanager|doubleclick|adobedtm|omtrdc|demdex|didomi|onetrust|cookiebot|segment|matomo|contentsquare|hotjar|commandersact|tagcommander|tealium|eulerian|facebook|linkedin|tiktok/i;

async function main() {
  const url = process.argv[2] ?? "https://example.com";
  const browserEngine = new BrowserEngine();

  console.log(`\nAnalyse dynamique de : ${url}\n`);

  const result = await browserEngine.analyze(url);

  const trackingScripts = result.scripts
    .filter((scriptUrl) => TRACKING_PATTERN.test(scriptUrl))
    .slice(0, 50);

  const trackingRequests = result.networkRequests
    .filter((requestUrl) => TRACKING_PATTERN.test(requestUrl))
    .slice(0, 50);

  const summary = {
    status: result.status,
    title: result.title,
    requestedUrl: result.requestedUrl,
    finalUrl: result.finalUrl,
    analyzedAt: result.analyzedAt,
    executionTimeMs: result.executionTime,
    htmlSize: result.htmlSize,

    scriptCount: result.scripts.length,
    networkRequestCount: result.networkRequests.length,
    dataLayerEntryCount: result.dataLayer.length,

    runtimeGlobals: result.runtimeGlobals,

    tracking: {
      scriptCount: trackingScripts.length,
      requestCount: trackingRequests.length,
      scripts: trackingScripts,
      requests: trackingRequests,
    },

    errors: {
      console: result.consoleErrors,
      page: result.pageErrors,
    },

    warnings: result.warnings,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("\nÉchec du test Browser Engine :");

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});