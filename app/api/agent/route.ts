import { NextResponse } from "next/server";
import { ANALYTICS_SYSTEM_PROMPT } from "../../prompts/analytics";

async function fetchPageHTML(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    });

    const html = await res.text();
    console.log("✅ Status:", res.status, "| Taille:", html.length);

    // 1. Tous les src de scripts externes
    const scriptSrcs = [
      ...html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi),
    ]
      .map((m) => m[1])
      .join("\n");

    // 2. Contenu des scripts inline
    const scriptContents = [
      ...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi),
    ]
      .map((m) => m[0])
      .join("\n");

    // 3. Head complet
    const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? "";

    // 4. Extraction directe des identifiants connus
    const identifiers: string[] = [];

    // GTM
    const gtm = html.match(/GTM-[A-Z0-9]+/g);
    if (gtm) identifiers.push(`GTM détecté : ${[...new Set(gtm)].join(", ")}`);

    // GA4
    const ga4 = html.match(/G-[A-Z0-9]{6,}/g);
    if (ga4) identifiers.push(`GA4 détecté : ${[...new Set(ga4)].join(", ")}`);

    // UA (Universal Analytics legacy)
    const ua = html.match(/UA-\d{4,}-\d+/g);
    if (ua) identifiers.push(`UA détecté : ${[...new Set(ua)].join(", ")}`);

    // Piano Analytics / AT Internet
    const piano = html.match(
      /(?:pa\.atsv\.net|tag\.aticdn\.net|piano\.io|at-internet)[^\s"']*/gi
    );
    if (piano)
      identifiers.push(
        `Piano Analytics détecté : ${[...new Set(piano)].join(", ")}`
      );

    // Eulerian
    const eulerian = html.match(/(?:eulerian\.net|ea\.tld)[^\s"']*/gi);
    if (eulerian)
      identifiers.push(
        `Eulerian détecté : ${[...new Set(eulerian)].join(", ")}`
      );

    // Adobe Analytics
    const adobe = html.match(
      /(?:omniture|2o7\.net|sc\.omtrdc\.net|\.sc\.omtr|AppMeasurement|s_code|report-suite-id|rsid)[^\s"']*/gi
    );
    if (adobe)
      identifiers.push(
        `Adobe Analytics détecté : ${[...new Set(adobe)].join(", ")}`
      );

    // Segment
    const segment = html.match(/cdn\.segment\.(?:com|io)[^\s"']*/gi);
    if (segment)
      identifiers.push(`Segment détecté : ${[...new Set(segment)].join(", ")}`);

    const context = `
=== IDENTIFIANTS DÉTECTÉS AUTOMATIQUEMENT ===
${identifiers.length > 0 ? identifiers.join("\n") : "Aucun identifiant trouvé par regex"}

=== SCRIPT SRC EXTERNES ===
${scriptSrcs}

=== HEAD ===
${head.slice(0, 3000)}

=== SCRIPTS INLINE ===
${scriptContents.slice(0, 4000)}
`.slice(0, 12000);

    return context;
  } catch (err) {
    console.error("❌ Erreur scraping :", err);
    return "";
  }
}

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

    const url = extractURL(input);
    let enrichedInput = input;

    if (url) {
      const html = await fetchPageHTML(url);

      if (html) {
        enrichedInput = `
URL analysée : ${url}

--- CODE SOURCE DE LA PAGE (scripts et <head>) ---
${html}
---------------------------------------------------

Contexte additionnel fourni par l'utilisateur :
${input.replace(url, "").trim()}
        `.trim();
      }
    }

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
          { role: "user", content: enrichedInput },
        ],
      }),
    });

const data = await response.json();

console.log("========== OPENAI ==========");
console.log("Status :", response.status);
console.log(JSON.stringify(data, null, 2));

if (!response.ok) {
  return NextResponse.json({
    output: "Erreur OpenAI",
    details: data,
  });
}

return NextResponse.json({
  output: data.choices[0].message.content,
  usage: data.usage,
});
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json(
      { error: "Erreur interne serveur." },
      { status: 500 }
    );
  }
}