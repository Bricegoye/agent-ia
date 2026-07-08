import type { AnalyticsToolDetection } from "../types";
import { detectGTM } from "./gtm-detector";
import { detectGA4 } from "./ga4-detector";
import { detectConsent } from "./consent-detector";
import { detectDataLayer } from "./datalayer-detector";

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
  key: "datalayer",
  name: "Google DataLayer",
  detect: detectDataLayer,
},
  {
    key: "ga4",
    name: "Google Analytics 4",
    detect: detectGA4,
  },
  {
  key: "consent",
  name: "Consent Management Platform",
  detect: detectConsent,
},

];

export function runDetectors(html: string): AnalyticsToolDetection[] {
  return detectors
    .map((detector) => detector.detect(html))
    .filter((result) => result.present);
}