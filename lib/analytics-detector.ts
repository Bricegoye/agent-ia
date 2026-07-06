import type { AnalyticsDetectionResult } from "./types";
import { runDetectors } from "./detectors";

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function detectAnalyticsTools(params: {
  url: string;
  html: string;
  htmlSize: number;
}): AnalyticsDetectionResult {
  const { url, html, htmlSize } = params;

  const scriptSrcs = unique(
    [...html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(
      (match) => match[1]
    )
  );

  const headSnippet =
    html.match(/<head[\s\S]*?<\/head>/i)?.[0]?.slice(0, 3000) ?? "";

  const inlineScriptSnippet = [
    ...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi),
  ]
    .map((match) => match[0])
    .join("\n")
    .slice(0, 4000);

  const tools = runDetectors(html);

  return {
    url,
    fetchedAt: new Date().toISOString(),
    htmlSize,
    tools,
    rawSignals: {
      scriptSrcs,
      headSnippet,
      inlineScriptSnippet,
    },
  };
}