import {
  BrowserEngine,
  type NetworkObservation,
} from "../lib/browser/browser-engine";

const TRACKING_PATTERN =
  /google-analytics|googletagmanager|doubleclick|googlesyndication|adobedtm|omtrdc|demdex|didomi|onetrust|cookiebot|segment|matomo|contentsquare|hotjar|commandersact|tagcommander|tealium|eulerian|facebook|linkedin|tiktok/i;

const TRACKING_ID_PATTERN =
  /\b(?:GTM-[A-Z0-9]+|G-[A-Z0-9]+|AW-(?:AW-)?\d+|DC-\d+)\b/gi;

function summarizeUrl(value: string): string {
  try {
    const url = new URL(value);

    const importantParameters = [
      "id",
      "tid",
      "en",
      "gcs",
      "gcd",
      "pscdl",
      "npa",
    ];

    const summary = new URLSearchParams();

    for (const parameter of importantParameters) {
      for (const parameterValue of url.searchParams.getAll(
        parameter
      )) {
        summary.append(parameter, parameterValue);
      }
    }

    const query = summary.toString();

    return `${url.origin}${url.pathname}${
      query ? `?${query}` : ""
    }`;
  } catch {
    return value.slice(0, 300);
  }
}

function extractTrackingIds(values: string[]): string[] {
  const ids = values.flatMap(
    (value) => value.match(TRACKING_ID_PATTERN) ?? []
  );

  return [...new Set(ids)];
}

function extractDataLayerEvents(
  entries: unknown[]
): string[] {
  const events = entries.flatMap((entry) => {
    if (
      typeof entry !== "object" ||
      entry === null ||
      !("event" in entry)
    ) {
      return [];
    }

    const event = (entry as Record<string, unknown>).event;

    return typeof event === "string" ? [event] : [];
  });

  return [...new Set(events)];
}

function summarizeObservation(
  observation: NetworkObservation
) {
  return {
    url: summarizeUrl(observation.url),
    method: observation.method,
    resourceType: observation.resourceType,
    state: observation.state,
    httpStatus: observation.httpStatus,
    failureText: observation.failureText,
    durationMs: observation.durationMs,
  };
}

async function main() {
  const url = process.argv[2] ?? "https://example.com";
  const browserEngine = new BrowserEngine();

  console.log(`\nAnalyse dynamique de : ${url}\n`);

  const result = await browserEngine.analyze(url);

  const trackingScripts = result.scripts.filter(
    (scriptUrl) => TRACKING_PATTERN.test(scriptUrl)
  );

  const trackingRequests =
    result.networkObservations.filter((observation) =>
      TRACKING_PATTERN.test(observation.url)
    );

  const completedCount =
    result.networkObservations.filter(
      (observation) =>
        observation.state === "completed"
    ).length;

  const failedCount =
    result.networkObservations.filter(
      (observation) => observation.state === "failed"
    ).length;

  const pendingCount =
    result.networkObservations.filter(
      (observation) => observation.state === "pending"
    ).length;

  const httpErrorCount =
    result.networkObservations.filter(
      (observation) =>
        observation.httpStatus !== null &&
        observation.httpStatus >= 400
    ).length;

  const completedTrackingCount =
    trackingRequests.filter(
      (observation) =>
        observation.state === "completed"
    ).length;

  const failedTrackingCount =
    trackingRequests.filter(
      (observation) => observation.state === "failed"
    ).length;

  const pendingTrackingCount =
    trackingRequests.filter(
      (observation) => observation.state === "pending"
    ).length;

  const trackingIds = extractTrackingIds([
    ...trackingScripts,
    ...trackingRequests.map(
      (observation) => observation.url
    ),
  ]);

  const summary = {
    status: result.status,
    title: result.title,
    requestedUrl: result.requestedUrl,
    finalUrl: result.finalUrl,
    analyzedAt: result.analyzedAt,
    executionTimeMs: result.executionTime,
    htmlSize: result.htmlSize,

    scripts: {
      total: result.scripts.length,
      tracking: trackingScripts.length,
    },

    network: {
      uniqueUrls: result.networkRequests.length,
      observations: result.networkObservations.length,
      completed: completedCount,
      failed: failedCount,
      pending: pendingCount,
      httpErrors: httpErrorCount,
    },

    dataLayer: {
      entryCount: result.dataLayer.length,
      events: extractDataLayerEvents(
        result.dataLayer
      ),
    },

    runtimeGlobals: result.runtimeGlobals,

    tracking: {
      detectedIds: trackingIds,
      scriptCount: trackingScripts.length,
      requestCount: trackingRequests.length,
      completed: completedTrackingCount,
      failed: failedTrackingCount,
      pending: pendingTrackingCount,
      observations: trackingRequests
        .slice(0, 50)
        .map(summarizeObservation),
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