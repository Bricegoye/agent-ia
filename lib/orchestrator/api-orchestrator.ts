// lib/orchestrator/api-orchestrator.ts

import { DetectionEngine } from "@/lib/detectors/detection-engine";
import { KnowledgeEngine } from "@/lib/knowledge/knowledge-engine";
import { ScoringEngine } from "@/lib/scoring/scoring-engine";

import { AIReportEngine } from "@/lib/report/ai-report-engine";
import { OpenAIClient } from "@/lib/ai/openai-client";

import type { ReportLanguage } from "@/lib/report/types";

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

  async analyze(
    url: string,
    language: ReportLanguage = "en"
  ) {
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
       * 3. Scoring
       *
       * Le Scoring Engine évalue directement
       * les outils détectés.
       */
      const scoring =
        this.scoringEngine.calculate(
          knowledge.tools ?? []
        );

      /**
       * 4. Rapport IA
       *
       * La langue sélectionnée par l'utilisateur
       * est transmise au Report Engine.
       */
      const report =
        await this.reportEngine.generate({
          detection: knowledge,
          knowledge: knowledge.insights ?? [],
          scoring,
          language,
        });

      /**
       * 5. Résultat final
       */
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