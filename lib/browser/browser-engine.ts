import {
  chromium,
  type Browser,
  type Request,
  type Response,
} from "playwright";

export interface RuntimeGlobals {
  dataLayer: boolean;
  gtag: boolean;
  googleTagManager: boolean;
  adobeSatellite: boolean;
  utag: boolean;
  didomi: boolean;
  oneTrust: boolean;
}

export type NetworkRequestState =
  | "pending"
  | "completed"
  | "failed";

export interface NetworkObservation {
  url: string;
  method: string;
  resourceType: string;
  state: NetworkRequestState;
  httpStatus: number | null;
  failureText: string | null;
  isNavigationRequest: boolean;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
}

export interface BrowserAnalysisResult {
  requestedUrl: string;
  finalUrl: string;
  title: string;
  status: number | null;
  html: string;
  htmlSize: number;
  scripts: string[];

  /*
   * Conservé pour assurer la compatibilité
   * avec les détecteurs existants.
   */
  networkRequests: string[];

  /*
   * Nouvelle représentation structurée
   * des preuves réseau.
   */
  networkObservations: NetworkObservation[];

  dataLayer: unknown[];
  runtimeGlobals: RuntimeGlobals;
  consoleErrors: string[];
  pageErrors: string[];
  warnings: string[];
  analyzedAt: string;
  executionTime: number;
}

export interface BrowserEngineOptions {
  navigationTimeoutMs?: number;
  settleTimeMs?: number;
  maxNetworkRequests?: number;
}

const DEFAULT_NAVIGATION_TIMEOUT = 30_000;
const DEFAULT_SETTLE_TIME = 3_000;
const DEFAULT_MAX_NETWORK_REQUESTS = 1_000;
const MAX_RECORDED_ERRORS = 25;
const MAX_DATA_LAYER_ENTRIES = 100;

function validateUrl(value: string): URL {
  const parsedUrl = new URL(value);

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new Error(
      "Browser Engine only supports HTTP and HTTPS URLs."
    );
  }

  return parsedUrl;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export class BrowserEngine {
  private readonly navigationTimeoutMs: number;
  private readonly settleTimeMs: number;
  private readonly maxNetworkRequests: number;

  constructor(options: BrowserEngineOptions = {}) {
    this.navigationTimeoutMs =
      options.navigationTimeoutMs ??
      DEFAULT_NAVIGATION_TIMEOUT;

    this.settleTimeMs =
      options.settleTimeMs ??
      DEFAULT_SETTLE_TIME;

    this.maxNetworkRequests =
      options.maxNetworkRequests ??
      DEFAULT_MAX_NETWORK_REQUESTS;
  }

  async analyze(url: string): Promise<BrowserAnalysisResult> {
    const startedAt = Date.now();
    const requestedUrl = validateUrl(url).toString();

    let browser: Browser | null = null;

    const networkRequests = new Set<string>();
    const networkObservations: NetworkObservation[] = [];

    const observationByRequest =
      new Map<Request, NetworkObservation>();

    const observationStartTimes =
      new Map<Request, number>();

    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const warnings: string[] = [];

    const finishNetworkObservation = (
      request: Request,
      state: NetworkRequestState,
      failureText: string | null = null
    ) => {
      const observation =
        observationByRequest.get(request);

      const requestStartedAt =
        observationStartTimes.get(request);

      if (!observation || requestStartedAt === undefined) {
        return;
      }

      const finishedAt = Date.now();

      observation.state = state;
      observation.failureText = failureText;
      observation.completedAt =
        new Date(finishedAt).toISOString();
      observation.durationMs =
        finishedAt - requestStartedAt;
    };

    try {
      browser = await chromium.launch({
        headless: true,
      });

      const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        locale: "fr-FR",
        viewport: {
          width: 1440,
          height: 900,
        },
        extraHTTPHeaders: {
          "Accept-Language":
            "fr-FR,fr;q=0.9,en;q=0.8",
        },
      });

      try {
        const page = await context.newPage();

        page.setDefaultTimeout(
          this.navigationTimeoutMs
        );

        page.setDefaultNavigationTimeout(
          this.navigationTimeoutMs
        );

        page.on("request", (request) => {
          if (
            networkRequests.size <
            this.maxNetworkRequests
          ) {
            networkRequests.add(request.url());
          }

          if (
            networkObservations.length >=
            this.maxNetworkRequests
          ) {
            return;
          }

          const requestStartedAt = Date.now();

          const observation: NetworkObservation = {
            url: request.url(),
            method: request.method(),
            resourceType: request.resourceType(),
            state: "pending",
            httpStatus: null,
            failureText: null,
            isNavigationRequest:
              request.isNavigationRequest(),
            startedAt:
              new Date(requestStartedAt).toISOString(),
            completedAt: null,
            durationMs: null,
          };

          networkObservations.push(observation);
          observationByRequest.set(
            request,
            observation
          );
          observationStartTimes.set(
            request,
            requestStartedAt
          );
        });

        page.on("response", (receivedResponse) => {
          const observation =
            observationByRequest.get(
              receivedResponse.request()
            );

          if (observation) {
            observation.httpStatus =
              receivedResponse.status();
          }
        });

        page.on("requestfinished", (request) => {
          finishNetworkObservation(
            request,
            "completed"
          );
        });

        page.on("requestfailed", (request) => {
          const failure =
            request.failure()?.errorText ??
            "Unknown request failure";

          finishNetworkObservation(
            request,
            "failed",
            failure
          );

          if (
            warnings.length <
            MAX_RECORDED_ERRORS
          ) {
            warnings.push(
              `Request failed: ${request.url()} — ${failure}`
            );
          }
        });

        page.on("console", (message) => {
          if (
            message.type() === "error" &&
            consoleErrors.length <
              MAX_RECORDED_ERRORS
          ) {
            consoleErrors.push(message.text());
          }
        });

        page.on("pageerror", (error) => {
          if (
            pageErrors.length <
            MAX_RECORDED_ERRORS
          ) {
            pageErrors.push(error.message);
          }
        });

        let response: Response | null = null;

        try {
          response = await page.goto(requestedUrl, {
            waitUntil: "domcontentloaded",
            timeout: this.navigationTimeoutMs,
          });
        } catch (error) {
          warnings.push(
            error instanceof Error
              ? `Navigation warning: ${error.message}`
              : "Navigation did not complete normally."
          );
        }

        try {
          await page.waitForLoadState("load", {
            timeout: 10_000,
          });
        } catch {
          warnings.push(
            "The load event did not complete within 10 seconds."
          );
        }

        await page.waitForTimeout(
          this.settleTimeMs
        );

        const html = await page.content();

        const scripts = await page
          .locator("script[src]")
          .evaluateAll((elements) =>
            elements
              .map(
                (element) =>
                  (element as HTMLScriptElement).src
              )
              .filter(Boolean)
          );

        const runtimeData = await page.evaluate(
          (maxDataLayerEntries) => {
            const runtimeWindow =
              window as typeof window & {
                dataLayer?: unknown;
                gtag?: unknown;
                google_tag_manager?: unknown;
                _satellite?: unknown;
                utag?: unknown;
                Didomi?: unknown;
                didomi?: unknown;
                OneTrust?: unknown;
              };

            const rawDataLayer =
              runtimeWindow.dataLayer;

            const dataLayer = Array.isArray(
              rawDataLayer
            )
              ? rawDataLayer
                  .slice(-maxDataLayerEntries)
                  .map((entry) => {
                    try {
                      return JSON.parse(
                        JSON.stringify(
                          entry,
                          (_key, value) => {
                            if (
                              typeof value ===
                              "function"
                            ) {
                              return "[Function]";
                            }

                            return value;
                          }
                        )
                      );
                    } catch {
                      return String(entry);
                    }
                  })
              : [];

            const runtimeGlobals: RuntimeGlobals = {
              dataLayer:
                Array.isArray(rawDataLayer),
              gtag:
                typeof runtimeWindow.gtag ===
                "function",
              googleTagManager: Boolean(
                runtimeWindow.google_tag_manager
              ),
              adobeSatellite: Boolean(
                runtimeWindow._satellite
              ),
              utag: Boolean(runtimeWindow.utag),
              didomi: Boolean(
                runtimeWindow.Didomi ||
                  runtimeWindow.didomi
              ),
              oneTrust: Boolean(
                runtimeWindow.OneTrust
              ),
            };

            return {
              dataLayer,
              runtimeGlobals,
            };
          },
          MAX_DATA_LAYER_ENTRIES
        );

        return {
          requestedUrl,
          finalUrl: page.url(),
          title: await page.title(),
          status: response?.status() ?? null,
          html,
          htmlSize: Buffer.byteLength(
            html,
            "utf8"
          ),
          scripts: unique(scripts),
          networkRequests: [
            ...networkRequests,
          ],
          networkObservations:
            networkObservations.map(
              (observation) => ({
                ...observation,
              })
            ),
          dataLayer: runtimeData.dataLayer,
          runtimeGlobals:
            runtimeData.runtimeGlobals,
          consoleErrors,
          pageErrors,
          warnings,
          analyzedAt: new Date().toISOString(),
          executionTime:
            Date.now() - startedAt,
        };
      } finally {
        await context.close();
      }
    } finally {
      await browser?.close();
    }
  }
}