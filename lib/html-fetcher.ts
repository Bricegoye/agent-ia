export type FetchHTMLResult = {
  url: string;
  html: string;
  status: number;
  statusText: string;
  finalUrl: string;
  redirected: boolean;
  htmlSize: number;
};

export async function fetchHTML(
  url: string
): Promise<FetchHTMLResult> {
  try {
    const response = await fetch(url, {
      cache: "no-store",

      /**
       * Follow HTTP redirects automatically.
       */
      redirect: "follow",

      /**
       * Browser-like headers.
       *
       * This does NOT guarantee that websites protected
       * by anti-bot systems will accept the request.
       */
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",

        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",

        "Accept-Language":
          "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",

        "Cache-Control": "no-cache",

        Pragma: "no-cache",
      },

      /**
       * Stop the request after 10 seconds.
       */
      signal: AbortSignal.timeout(10000),
    });

    /**
     * Read the response body even when the HTTP status
     * is not successful.
     *
     * This is useful during diagnostics because some
     * anti-bot systems return an HTML challenge page.
     */
    const html = await response.text();

    /**
     * Diagnostic information.
     *
     * Useful during the V2 QA campaign to distinguish:
     *
     * - HTTP 403
     * - HTTP 429
     * - HTTP 5xx
     * - redirects
     * - anti-bot pages
     * - empty responses
     */
    console.log("[AIP Fetch]", {
      requestedUrl: url,
      finalUrl: response.url,
      status: response.status,
      statusText: response.statusText,
      redirected: response.redirected,
      contentType:
        response.headers.get("content-type"),
      server: response.headers.get("server"),
      htmlSize: html.length,
    });

    return {
      url,
      html,
      status: response.status,
      statusText: response.statusText,
      finalUrl: response.url,
      redirected: response.redirected,
      htmlSize: html.length,
    };
  } catch (error) {
    /**
     * Network / timeout / TLS / DNS errors.
     */
    console.error("[AIP Fetch Error]", {
      url,
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });

    throw error;
  }
}