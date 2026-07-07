import type { AnalyticsToolDetection } from "../types";
import { detectGTM } from "./gtm-detector";
import { detectGA4 } from "./ga4-detector";

export type Detector = {
  key: string;
  name: string;
  detect: (html: string) => AnalyticsToolDetection;
};

export const detectors: Detector[] = [
  {
    key: "gtm",
    name: "Google Tag Manager",
    detect: detectGTM,
  },
  {
    key: "ga4",
    name: "Google Analytics 4",
    detect: detectGA4,
  },
];

export function runDetectors(html: string): AnalyticsToolDetection[] {
  return detectors
    .map((detector) => detector.detect(html))
    .filter((result) => result.present);
}