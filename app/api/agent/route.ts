import { NextResponse } from "next/server";
import { ANALYTICS_SYSTEM_PROMPT } from "../../prompts/analytics";
import { fetchHTML } from "../../../lib/html-fetcher";
import { detectAnalyticsTools } from "../../../lib/analytics-detector";

function extractURL(input: string): string | null {
  const match = input.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
}

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: "Aucune requête fournie." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY non configurée côté serveur." },
        { status: 500 }
      );
    }

    const url = extractURL(input);

    if (!url) {
      return NextResponse.json(
        { error: "Merci de fournir une URL valide commençant par http:// ou https://." },
        { status: 400 }
      );
    }

    const fetchedPage = await fetchHTML(url);

    const detectionResult = detectAnalyticsTools({
      url: fetchedPage.url,
      html: fetchedPage.html,
      htmlSize: fetchedPage.htmlSize,
    });

    const structuredInput = `
URL analysée : ${url}

Voici le résultat structuré de l'analyse technique automatique :

${JSON.stringify(detectionResult, null, 2)}

Contexte additionnel fourni par l'utilisateur :
${input.replace(url, "").trim() || "Aucun contexte additionnel fourni."}

Consigne :
À partir de ces données structurées, produis un audit Digital Analytics clair, professionnel et orienté consultant.
Ne prétends jamais avoir détecté un outil qui n'apparaît pas dans le JSON.
Si GTM est détecté mais pas GA4, précise que GA4 peut être présent dans GTM sans être visible dans le HTML statique.
`.trim();

    // ==============================
// DEBUG MODE V2
// ==============================

return NextResponse.json({
  detection: detectionResult,
});

/*

// ==============================
// OPENAI (désactivé temporairement)
// ==============================

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: ANALYTICS_SYSTEM_PROMPT },
      { role: "user", content: structuredInput },
    ],
  }),
});

const data = await response.json();

if (!response.ok) {
  return NextResponse.json(
    {
      error: "Erreur OpenAI",
      details: data,
    },
    { status: response.status }
  );
}

return NextResponse.json({
  output:
    data.choices?.[0]?.message?.content ||
    "Aucun contenu renvoyé par OpenAI.",
  usage: data.usage,
  detection: detectionResult,
});

*/
  } catch (error) {
    console.error("Erreur API agent :", error);

    return NextResponse.json(
      { error: "Erreur interne serveur." },
      { status: 500 }
    );
  }
}