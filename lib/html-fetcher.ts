import {
  assertSafePublicUrl,
} from "./security/url-safety";

export type FetchHTMLResult = {
  url: string;
  html: string;
  status: number;
  statusText: string;
  finalUrl: string;
  redirected: boolean;
  htmlSize: number;
};

const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 10_000;

const REDIRECT_STATUSES = new Set([
  301,
  302,
  303,
  307,
  308,
]);

const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",

  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",

  "Accept-Language":
    "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",

  "Cache-Control": "no-cache",

  Pragma: "no-cache",
};

export async function fetchHTML(
  url: string
): Promise<FetchHTMLResult> {
  const requestedUrl = (
    await assertSafePublicUrl(url)
  ).toString();

  let currentUrl = requestedUrl;
  let redirectCount = 0;

  /*
   * Le même délai couvre toute la chaîne
   * de redirections.
   */
  const signal = AbortSignal.timeout(
    REQUEST_TIMEOUT_MS
  );

  try {
    while (true) {
      const response = await fetch(
        currentUrl,
        {
          cache: "no-store",

          /*
           * Les redirections sont gérées
           * manuellement afin de contrôler
           * chaque nouvelle destination.
           */
          redirect: "manual",

          headers: REQUEST_HEADERS,

          signal,
        }
      );

      const location =
        response.headers.get("location");

      const isRedirect =
        REDIRECT_STATUSES.has(
          response.status
        ) && Boolean(location);

      if (isRedirect && location) {
        if (
          redirectCount >= MAX_REDIRECTS
        ) {
          await response.body?.cancel();

          throw new Error(
            `Too many redirects while fetching ${requestedUrl}.`
          );
        }

        const nextUrl = new URL(
          location,
          currentUrl
        ).toString();

        /*
         * Vérifie la destination avant de
         * suivre la redirection.
         */
        currentUrl = (
          await assertSafePublicUrl(
            nextUrl
          )
        ).toString();

        redirectCount += 1;

        await response.body?.cancel();

        continue;
      }

      const html =
        await response.text();

      const htmlSize =
        Buffer.byteLength(
          html,
          "utf8"
        );

      console.log("[AIP Fetch]", {
        requestedUrl,
        finalUrl: currentUrl,
        status: response.status,
        statusText:
          response.statusText,
        redirected:
          redirectCount > 0,
        redirectCount,
        contentType:
          response.headers.get(
            "content-type"
          ),
        server:
          response.headers.get(
            "server"
          ),
        htmlSize,
      });

      return {
        url: requestedUrl,
        html,
        status: response.status,
        statusText:
          response.statusText,
        finalUrl: currentUrl,
        redirected:
          redirectCount > 0,
        htmlSize,
      };
    }
  } catch (error) {
    console.error(
      "[AIP Fetch Error]",
      {
        requestedUrl,
        currentUrl,
        redirectCount,

        error:
          error instanceof Error
            ? error.message
            : String(error),
      }
    );

    throw error;
  }
}