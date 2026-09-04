import type {
  AnalyticsToolDetection,
  CertaintyLevel,
} from "../types";

import type {
  DynamicTechnologyEvidence,
  DynamicTechnologyKey,
} from "../browser/dynamic-evidence-engine";

import { detectGTM } from "./gtm-detector";
import { detectGA4 } from "./ga4-detector";
import { detectFloodlight } from "./floodlight-detector";
import { detectDataLayer } from "./datalayer-detector";

type DetectorFactory = (
  html: string
) => AnalyticsToolDetection;

const detectorFactories: Record<
  DynamicTechnologyKey,
  DetectorFactory
> = {
  gtm: detectGTM,
  ga4: detectGA4,
  floodlight: detectFloodlight,
  datalayer: detectDataLayer,
};

const certaintyRank: Record<
  CertaintyLevel,
  number
> = {
  Faible: 1,
  Moyen: 2,
  Élevé: 3,
};

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function strongestCertainty(
  first: CertaintyLevel,
  second: CertaintyLevel
): CertaintyLevel {
  return certaintyRank[first] >=
    certaintyRank[second]
    ? first
    : second;
}

function createDynamicTool(
  dynamicTechnology: DynamicTechnologyEvidence
): AnalyticsToolDetection {
  const detector =
    detectorFactories[dynamicTechnology.key];

  const template = detector("");

  return {
    ...template,

    present: true,

    status: "Détecté directement",

    ids: [...dynamicTechnology.ids],

    evidence: [
      ...dynamicTechnology.evidence,
    ],

    sources: [
      ...dynamicTechnology.sources,
    ],

    certainty:
      dynamicTechnology.certainty,

    details: {
      ...(template.details ?? {}),

      detectionModes: {
        static: false,
        dynamic: true,
      },

      dynamicEvidence:
        dynamicTechnology.details,
    },
  };
}

function mergeTool(
  staticTool: AnalyticsToolDetection,
  dynamicTechnology: DynamicTechnologyEvidence
): AnalyticsToolDetection {
  return {
    ...staticTool,

    present: true,

    status: "Détecté directement",

    ids: unique([
      ...staticTool.ids,
      ...dynamicTechnology.ids,
    ]),

    evidence: unique([
      ...staticTool.evidence,
      ...dynamicTechnology.evidence,
    ]),

    sources: unique([
      ...staticTool.sources,
      ...dynamicTechnology.sources,
    ]),

    certainty: strongestCertainty(
      staticTool.certainty,
      dynamicTechnology.certainty
    ),

    details: {
      ...(staticTool.details ?? {}),

      detectionModes: {
        static: true,
        dynamic: true,
      },

      dynamicEvidence:
        dynamicTechnology.details,
    },
  };
}

export function fuseDetections(
  staticTools: AnalyticsToolDetection[],
  dynamicTechnologies:
    DynamicTechnologyEvidence[]
): AnalyticsToolDetection[] {
  const fusedTools:
    AnalyticsToolDetection[] =
    staticTools.map(
      (
        tool
      ): AnalyticsToolDetection => ({
        ...tool,

        ids: [...tool.ids],

        evidence: [...tool.evidence],

        sources: [...tool.sources],

        details: tool.details
          ? { ...tool.details }
          : undefined,
      })
    );

  const toolIndexByKey = new Map<
    string,
    number
  >(
    fusedTools.map((tool, index) => [
      tool.key,
      index,
    ])
  );

  for (
    const dynamicTechnology of
    dynamicTechnologies
  ) {
    const existingIndex =
      toolIndexByKey.get(
        dynamicTechnology.key
      );

    if (existingIndex === undefined) {
      const dynamicTool = createDynamicTool(
        dynamicTechnology
      );

      fusedTools.push(dynamicTool);

      toolIndexByKey.set(
        dynamicTool.key,
        fusedTools.length - 1
      );

      continue;
    }

    fusedTools[existingIndex] = mergeTool(
      fusedTools[existingIndex],
      dynamicTechnology
    );
  }

  return fusedTools;
}