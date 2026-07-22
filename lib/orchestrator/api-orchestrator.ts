// lib/orchestrator/api-orchestrator.ts

import { DetectionEngine } from "@/lib/detectors/detection-engine";
import { KnowledgeEngine } from "@/lib/knowledge/knowledge-engine";
import { ScoringEngine } from "@/lib/scoring/scoring-engine";

import { AIReportEngine } from "@/lib/report/ai-report-engine";
import { OpenAIClient } from "@/lib/ai/openai-client";

export class APIOrchestrator {
  private readonly detectionEngine: DetectionEngine;
  private readonly knowledgeEngine: KnowledgeEngine;
  private readonly scoringEngine: ScoringEngine;
  private readonly reportEngine: AIReportEngine;

  constructor() {
    this.detectionEngine = new DetectionEngine();
    this.knowledgeEngine = new KnowledgeEngine();
    this.scoringEngine = new ScoringEngine();

    const aiClient = new OpenAIClient();
    this.reportEngine = new AIReportEngine(aiClient);
  }

  async analyze(url: string) {
    const start = Date.now();

    try {
      /**
       * 1. Detection
       */
      const detection =
        await this.detectionEngine.analyze(url);

      /**
       * 2. Knowledge
       */
      const knowledge =
        this.knowledgeEngine.analyze(detection);

      /**
       * 3. Récupération des règles validées
       */
      const matchedRuleIds =
        knowledge.insights?.map(i => i.key) ?? [];

      /**
       * 4. Scoring
       */
      const scoring =
        this.scoringEngine.calculate(
          matchedRuleIds
        );

      /**
       * 5. Rapport IA
       */
      const report =
        await this.reportEngine.generate({
          detection: knowledge,
          knowledge: knowledge.insights ?? [],
          scoring,
        });

      return {
        success: true,

        url,

        generatedAt: new Date().toISOString(),

        executionTime: Date.now() - start,

        detection: knowledge,

        scoring,

        report,
      };

    } catch (error) {

      console.error("[AIP]", error);

      return {
        success: false,

        url,

        executionTime: Date.now() - start,

        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      };

    }
  }
}