export async function fetchHTML(url: string): Promise<{
  url: string;
  html: string;
  status: number;
  htmlSize: number;
}> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    },
    signal: AbortSignal.timeout(8000),
  });

  const html = await response.text();

  return {
    url,
    html,
    status: response.status,
    htmlSize: html.length,
  };
}