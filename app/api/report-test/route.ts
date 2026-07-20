import { NextResponse } from "next/server";

import { OpenAIClient } from "@/lib/ai";
import { AIReportEngine } from "@/lib/report/ai-report-engine";

import type { AIReportInput } from "@/lib/report/types";

export async function GET() {
  try {
    const aiClient = new OpenAIClient();
    const reportEngine = new AIReportEngine(aiClient);

    const testInput: AIReportInput = {
      detection: {
        url: "https://example.com",
        fetchedAt: new Date().toISOString(),
        htmlSize: 125000,
        tools: [
          {
            name: "Google Tag Manager",
            key: "gtm",
            vendor: "Google",
            category: "Tag Management",
            documentationUrl: "https://support.google.com/tagmanager",
            description: "Gestionnaire de balises Google.",
            present: true,
            status: "Détecté directement",
            ids: ["GTM-TEST123"],
            evidence: ["googletagmanager.com/gtm.js?id=GTM-TEST123"],
            sources: ["script"],
            certainty: "Élevé",
          },
          {
            name: "Google Analytics 4",
            key: "ga4",
            vendor: "Google",
            category: "Analytics",
            documentationUrl: "https://support.google.com/analytics",
            description: "Solution de mesure d'audience Google Analytics 4.",
            present: true,
            status: "Détecté directement",
            ids: ["G-TEST123"],
            evidence: ["gtag config G-TEST123"],
            sources: ["inline-script"],
            certainty: "Élevé",
          },
        ],
        insights: [],
        rawSignals: {
          scriptSrcs: [],
          headSnippet: "",
          inlineScriptSnippet: "",
        },
      },

      knowledge: [
        {
          key: "ga4-without-consent",
          severity: "warning",
          title: "GA4 détecté sans CMP confirmée",
          description:
            "Une solution analytics est détectée, mais aucune plateforme de consentement n'est confirmée.",
          relatedTools: ["Google Analytics 4"],
        },
      ],

      scoring: {
        globalScore: 68,
        maxScore: 100,
        grade: "C",
        categories: [
          {
            category: "analytics",
            score: 18,
            maxScore: 20,
          },
          {
            category: "tagManagement",
            score: 17,
            maxScore: 20,
          },
          {
            category: "consent",
            score: 5,
            maxScore: 20,
          },
          {
            category: "marketing",
            score: 14,
            maxScore: 20,
          },
          {
            category: "dataQuality",
            score: 14,
            maxScore: 20,
          },
        ],
      },
    };

    const report = await reportEngine.generate(testInput);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("AI report test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue.",
      },
      {
        status: 500,
      }
    );
  }
}