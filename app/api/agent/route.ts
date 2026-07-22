import { NextRequest, NextResponse } from "next/server";

import { APIOrchestrator } from "@/lib/orchestrator/api-orchestrator";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  const orchestrator = new APIOrchestrator();

  const result = await orchestrator.analyze(url);

  return NextResponse.json(result);
}