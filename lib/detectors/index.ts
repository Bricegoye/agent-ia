import type { AnalyticsToolDetection } from "../types";

import { detectGTM } from "./gtm-detector";
import { detectGA4 } from "./ga4-detector";
import { detectConsent } from "./consent-detector";
import { detectDataLayer } from "./datalayer-detector";
import { detectAdobeLaunch } from "./adobe-launch-detector";
import { detectAdobeAnalytics } from "./adobe-analytics-detector";
import { detectMetaPixel } from "./meta-pixel-detector";

type Detector = {
  key: string;
  name: string;
  detect: (html: string) => AnalyticsToolDetection;
};

const detectors: Detector[] = [
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
  {
    key: "consent",
    name: "Consent Management Platform",
    detect: detectConsent,
  },
  {
    key: "datalayer",
    name: "Google DataLayer",
    detect: detectDataLayer,
  },
  {
    key: "adobe-launch",
    name: "Adobe Experience Platform Launch",
    detect: detectAdobeLaunch,
  },
  {
    key: "adobe-analytics",
    name: "Adobe Analytics",
    detect: detectAdobeAnalytics,
  },
  {
    key: "meta-pixel",
    name: "Meta Pixel",
    detect: detectMetaPixel,
  },
];

export function runDetectors(html: string): AnalyticsToolDetection[] {
  return detectors
    .map((detector) => detector.detect(html))
    .filter((tool) => tool.present);
}