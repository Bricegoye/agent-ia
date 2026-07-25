import { NextRequest, NextResponse } from "next/server";

import { APIOrchestrator } from "@/lib/orchestrator/api-orchestrator";
import type { ReportLanguage } from "@/lib/report/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const url = body.url;

    const language: ReportLanguage =
      body.language === "fr" ? "fr" : "en";

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "A valid URL is required.",
        },
        {
          status: 400,
        }
      );
    }

    const orchestrator = new APIOrchestrator();

    const result = await orchestrator.analyze(
      url,
      language
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[AIP API]", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown API error",
      },
      {
        status: 500,
      }
    );
  }
}